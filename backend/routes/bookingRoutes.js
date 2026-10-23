const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  uploadReport
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, authorize('Patient'), createBooking)
  .get(protect, authorize('Admin', 'Staff'), getAllBookings);

router.get('/my-bookings', protect, authorize('Patient'), getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/status', protect, authorize('Admin', 'Staff'), upload.single('report'), updateBookingStatus);
router.post('/:id/report', protect, authorize('Admin', 'Staff'), upload.single('report'), uploadReport);

module.exports = router;
