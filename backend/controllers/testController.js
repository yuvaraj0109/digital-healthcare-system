const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');

// @desc    Get all diagnostic tests
// @route   GET /api/tests
// @access  Public
const getTests = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = { isActive: true };

  if (req.user && req.user.role === 'Admin') {
    delete query.isActive; // Admin can see all including inactive
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const tests = await Test.find(query).sort({ createdAt: -1 });
  res.json(tests);
});

// @desc    Get single test by ID
// @route   GET /api/tests/:id
// @access  Public
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Create a new diagnostic test
// @route   POST /api/tests
// @access  Private (Admin only)
const createTest = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    category,
    description,
    price,
    discountPrice,
    turnaroundTime,
    sampleType,
    preparationInstruction,
    isActive
  } = req.body;

  const testExists = await Test.findOne({ code });
  if (testExists) {
    res.status(400);
    throw new Error('Test code already exists');
  }

  const test = await Test.create({
    name,
    code,
    category,
    description,
    price,
    discountPrice: discountPrice || 0,
    turnaroundTime,
    sampleType,
    preparationInstruction,
    isActive: isActive !== undefined ? isActive : true
  });

  res.status(201).json(test);
});

// @desc    Update diagnostic test
// @route   PUT /api/tests/:id
// @access  Private (Admin only)
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    test.name = req.body.name || test.name;
    test.code = req.body.code || test.code;
    test.category = req.body.category || test.category;
    test.description = req.body.description || test.description;
    test.price = req.body.price !== undefined ? req.body.price : test.price;
    test.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : test.discountPrice;
    test.turnaroundTime = req.body.turnaroundTime || test.turnaroundTime;
    test.sampleType = req.body.sampleType || test.sampleType;
    test.preparationInstruction = req.body.preparationInstruction || test.preparationInstruction;
    if (req.body.isActive !== undefined) {
      test.isActive = req.body.isActive;
    }

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Delete diagnostic test
// @route   DELETE /api/tests/:id
// @access  Private (Admin only)
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    await test.deleteOne();
    res.json({ message: 'Test removed successfully' });
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
};
