const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Test = require('../models/Test');
const Slot = require('../models/Slot');
const User = require('../models/User');

// Helper to generate unique booking ID
const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DHP-${rand}`;
};

// @desc    Create new booking with mock payment
// @route   POST /api/bookings
// @access  Private (Patient)
const createBooking = asyncHandler(async (req, res) => {
  const { testId, slotId, patientDetails, paymentDetails } = req.body;

  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  const slot = await Slot.findById(slotId);
  if (!slot) {
    res.status(404);
    throw new Error('Slot not found');
  }

  if (slot.bookedCount >= slot.capacity) {
    res.status(400);
    throw new Error('Selected slot is fully booked. Please select another slot.');
  }

  const bookingId = generateBookingId();
  const priceToCharge = test.discountPrice > 0 ? test.discountPrice : test.price;

  const booking = await Booking.create({
    bookingId,
    patient: req.user._id,
    patientDetails: {
      name: patientDetails?.name || req.user.name,
      email: patientDetails?.email || req.user.email,
      phone: patientDetails?.phone || req.user.phone || '',
      age: patientDetails?.age || req.user.age || 0,
      gender: patientDetails?.gender || req.user.gender || 'Unspecified'
    },
    test: test._id,
    slot: slot._id,
    bookingDate: slot.date,
    bookingTime: `${slot.startTime} - ${slot.endTime}`,
    totalAmount: priceToCharge,
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: paymentDetails?.transactionId || `TXN-${Date.now()}`,
      paymentMethod: paymentDetails?.paymentMethod || 'Mock Card / UPI',
      paidAt: new Date()
    },
    status: 'Booked',
    statusHistory: [
      {
        status: 'Booked',
        updatedAt: new Date(),
        updatedBy: req.user.name,
        note: 'Appointment booked & payment confirmed successfully.'
      }
    ]
  });

  // Increment slot booked count
  slot.bookedCount += 1;
  await slot.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate('test')
    .populate('slot')
    .populate('patient', 'name email phone');

  res.status(201).json(populatedBooking);
});

// @desc    Get logged in patient bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Patient)
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ patient: req.user._id })
    .populate('test')
    .populate('slot')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Get all bookings (Admin & Staff)
// @route   GET /api/bookings
// @access  Private (Admin & Staff)
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  let query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  let bookings = await Booking.find(query)
    .populate('test')
    .populate('slot')
    .populate('patient', 'name email phone')
    .sort({ createdAt: -1 });

  if (search) {
    const s = search.toLowerCase();
    bookings = bookings.filter(b => 
      b.bookingId.toLowerCase().includes(s) ||
      b.patientDetails?.name?.toLowerCase().includes(s) ||
      b.patientDetails?.email?.toLowerCase().includes(s) ||
      b.test?.name?.toLowerCase().includes(s)
    );
  }

  res.json(bookings);
});

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('test')
    .populate('slot')
    .populate('patient', 'name email phone');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure patient only sees their own booking, while Staff/Admin can see all
  if (req.user.role === 'Patient' && booking.patient._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// @desc    Update status (Staff & Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Staff & Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Validate strict order sequence
  const currentIndex = validStatuses.indexOf(booking.status);
  const targetIndex = validStatuses.indexOf(status);

  if (targetIndex < currentIndex) {
    res.status(400);
    throw new Error(`Cannot revert status from ${booking.status} back to ${status}`);
  }

  if (status === 'Report Ready') {
    const hasUploadedReport = Boolean(req.file);
    const hasExistingReport = Boolean(booking.reportUrl);

    if (!hasUploadedReport && !hasExistingReport) {
      res.status(400);
      throw new Error('Report PDF is required to mark status as Report Ready');
    }

    if (req.file) {
      booking.reportUrl = `/uploads/reports/${req.file.filename}`;
      booking.reportOriginalName = req.file.originalname;
      booking.reportUploadedAt = new Date();
    }
  }

  booking.status = status;
  booking.statusHistory.push({
    status: status,
    updatedAt: new Date(),
    updatedBy: `${req.user.role} (${req.user.name})`,
    note: note || `Status updated to ${status}`
  });

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('test')
    .populate('slot')
    .populate('patient', 'name email phone');

  res.json(updatedBooking);
});

// @desc    Upload PDF Report (Staff & Admin)
// @route   POST /api/bookings/:id/report
// @access  Private (Staff & Admin)
const uploadReport = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF report file');
  }

  // Construct report file URL (relative server path)
  const reportUrl = `/uploads/reports/${req.file.filename}`;

  booking.reportUrl = reportUrl;
  booking.reportOriginalName = req.file.originalname;
  booking.reportUploadedAt = new Date();

  // Automatically update status to 'Report Ready' if not already
  if (booking.status !== 'Report Ready') {
    booking.status = 'Report Ready';
    booking.statusHistory.push({
      status: 'Report Ready',
      updatedAt: new Date(),
      updatedBy: `${req.user.role} (${req.user.name})`,
      note: 'Medical report PDF uploaded and finalized.'
    });
  }

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('test')
    .populate('slot')
    .populate('patient', 'name email phone');

  res.json(updatedBooking);
});

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  uploadReport
};
