const test = require('node:test');
const assert = require('node:assert/strict');

const connectDB = require('../config/db');

test('connectDB should fall back to an in-memory MongoDB when no URI is configured', async () => {
  delete process.env.MONGODB_URI;

  await assert.doesNotReject(async () => {
    await connectDB();
  });
});
