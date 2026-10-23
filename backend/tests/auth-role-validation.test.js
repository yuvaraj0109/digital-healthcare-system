const test = require('node:test');
const assert = require('node:assert/strict');

const authController = require('../controllers/authController');
const User = require('../models/User');

const originalFindOne = User.findOne;

const runLogin = async (body) => {
  let error;
  const req = { body };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };

  await authController.loginUser(req, res, (err) => {
    error = err;
  });

  return { error, res };
};

test('login rejects a role mismatch even when email and password are correct', async () => {
  User.findOne = () => ({
    _id: 'user-id',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Patient',
    phone: '123456789',
    gender: 'Female',
    age: 30,
    password: 'hashed-password',
    select() {
      return this;
    },
    matchPassword: async () => true,
    getSignedJwtToken: () => 'token-value'
  });

  const result = await runLogin({
    email: 'jane@example.com',
    password: 'secret123',
    role: 'Staff'
  });

  assert.ok(result.error, 'Expected an error for a role mismatch');
  assert.equal(
    result.error.message,
    'Invalid credentials or role mismatch. Please select the correct role.'
  );
  assert.equal(result.res.statusCode, 401);
});

test.after(() => {
  User.findOne = originalFindOne;
});
