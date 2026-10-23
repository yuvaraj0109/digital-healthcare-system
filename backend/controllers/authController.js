const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, age } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'Patient', // Registration default is always Patient
    phone: phone || '',
    gender: gender || 'Unspecified',
    age: age || 0
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: user.getSignedJwtToken()
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const selectedRole = role?.trim();

  if (!email || !password || !selectedRole) {
    res.status(400);
    throw new Error('Please provide email, password and role');
  }

  const normalizedRole = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).toLowerCase();
  const validRoles = ['Patient', 'Staff', 'Admin'];

  if (!validRoles.includes(normalizedRole)) {
    res.status(400);
    throw new Error('Please select a valid role');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.role !== normalizedRole) {
    res.status(401);
    throw new Error('Invalid credentials or role mismatch. Please select the correct role.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    gender: user.gender,
    age: user.age,
    token: user.getSignedJwtToken()
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      age: user.age
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
