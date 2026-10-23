const asyncHandler = require('express-async-handler');
const Slot = require('../models/Slot');

// @desc    Get slots (optional date filter)
// @route   GET /api/slots
// @access  Public
const getSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  let query = { isActive: true };

  if (date) {
    query.date = date;
  }

  const slots = await Slot.find(query).sort({ date: 1, startTime: 1 });
  res.json(slots);
});

// @desc    Create a new slot
// @route   POST /api/slots
// @access  Private (Admin only)
const createSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, capacity } = req.body;

  if (!date || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please provide date, start time, and end time');
  }

  const existing = await Slot.findOne({ date, startTime, endTime });
  if (existing) {
    res.status(400);
    throw new Error('Slot with this date and time range already exists');
  }

  const slot = await Slot.create({
    date,
    startTime,
    endTime,
    capacity: capacity || 5,
    bookedCount: 0
  });

  res.status(201).json(slot);
});

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private (Admin only)
const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);

  if (slot) {
    if (slot.bookedCount > 0) {
      res.status(400);
      throw new Error('Cannot delete a slot that already has bookings');
    }
    await slot.deleteOne();
    res.json({ message: 'Slot removed successfully' });
  } else {
    res.status(404);
    throw new Error('Slot not found');
  }
});

module.exports = {
  getSlots,
  createSlot,
  deleteSlot
};
