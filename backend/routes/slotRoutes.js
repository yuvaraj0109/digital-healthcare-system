const express = require('express');
const router = express.Router();
const { getSlots, createSlot, deleteSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSlots)
  .post(protect, authorize('Admin'), createSlot);

router.route('/:id')
  .delete(protect, authorize('Admin'), deleteSlot);

module.exports = router;
