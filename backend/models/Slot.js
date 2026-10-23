const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please provide date in YYYY-MM-DD format']
    },
    startTime: {
      type: String, // e.g. "08:00 AM"
      required: [true, 'Please provide start time']
    },
    endTime: {
      type: String, // e.g. "09:00 AM"
      required: [true, 'Please provide end time']
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify slot capacity'],
      default: 5
    },
    bookedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual to check if available
slotSchema.virtual('isAvailable').get(function () {
  return this.bookedCount < this.capacity;
});

slotSchema.set('toJSON', { virtuals: true });
slotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Slot', slotSchema);
