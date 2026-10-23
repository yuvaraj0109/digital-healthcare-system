const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide test name'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Please provide test code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['Blood Test', 'Radiology', 'Pathology', 'Cardiology', 'Diabetes', 'Health Package', 'General'],
      default: 'General'
    },
    description: {
      type: String,
      required: [true, 'Please provide description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide price']
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    turnaroundTime: {
      type: String,
      required: [true, 'Please provide turnaround time (e.g., 24 Hours)'],
      default: '24 Hours'
    },
    sampleType: {
      type: String,
      required: [true, 'Please provide sample type (e.g., Blood, Urine, Nasal Swab)'],
      default: 'Blood'
    },
    preparationInstruction: {
      type: String,
      default: 'Fasting 8-10 hours recommended.'
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

module.exports = mongoose.model('Test', testSchema);
