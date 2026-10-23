const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'],
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'System'
  },
  note: {
    type: String,
    default: ''
  }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientDetails: {
      name: String,
      email: String,
      phone: String,
      age: Number,
      gender: String
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true
    },
    bookingDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    bookingTime: {
      type: String, // Start - End time
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Paid'
    },
    paymentDetails: {
      transactionId: String,
      paymentMethod: String,
      paidAt: {
        type: Date,
        default: Date.now
      }
    },
    status: {
      type: String,
      enum: ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'],
      default: 'Booked'
    },
    statusHistory: [statusHistorySchema],
    reportUrl: {
      type: String,
      default: null
    },
    reportOriginalName: {
      type: String,
      default: null
    },
    reportUploadedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
