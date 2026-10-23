const test = require('node:test');
const assert = require('node:assert/strict');

const bookingController = require('../controllers/bookingController');
const Booking = require('../models/Booking');

const originalFindById = Booking.findById;

const runUpdateStatus = async ({ status, note, file } = {}) => {
  let error;

  const req = {
    params: { id: 'booking-1' },
    body: { status, note },
    file,
    user: { role: 'Staff', name: 'Alex Vance' }
  };

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

  await bookingController.updateBookingStatus(req, res, (err) => {
    error = err;
  });

  return { error, res };
};

test('Report Ready status rejects updates without a PDF report', async () => {
  Booking.findById = () => ({
    _id: 'booking-1',
    status: 'Processing',
    reportUrl: null,
    statusHistory: [],
    populate() {
      return this;
    },
    save: async function () {
      return this;
    }
  });

  const result = await runUpdateStatus({ status: 'Report Ready', note: 'Ready' });

  assert.ok(result.error, 'Expected error when Report Ready is set without a PDF');
  assert.equal(result.error.message, 'Report PDF is required to mark status as Report Ready');
  assert.equal(result.res.statusCode, 400);
});

test.after(() => {
  Booking.findById = originalFindById;
});
