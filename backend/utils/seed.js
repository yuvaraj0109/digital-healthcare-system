const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Test = require('../models/Test');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    const existingUser = await User.exists({});
    if (existingUser) {
      console.log('Existing users found. Skipping initial seed data.');
      return;
    }

    console.log('Seeding initial data...');

    // Ensure upload dir exists and create a sample dummy PDF
    const reportsDir = path.join(__dirname, '../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const samplePdfPath = path.join(reportsDir, 'sample-report.pdf');
    if (!fs.existsSync(samplePdfPath)) {
      // Basic minimal valid PDF binary content for testing viewer/downloader
      const dummyPdfContent = `%PDF-1.4
1 0 obj <>/ProcSet[/PDF/Text/ImageB/ImageC/ImageI] >>/MediaBox[ 0 0 612 792] /Contents 4 0 R >>
endobj
2 0 obj <>/ColorSpace<>/Font<>>>
endobj
3 0 obj <>/ColorSpace<>/Font<>>>
endobj
4 0 obj <>/Length 145>>
stream
BT
/F1 18 Tf
50 720 Td
(DIGITAL HEALTHCARE PLATFORM - OFFICIAL MEDICAL REPORT) Tj
/F2 12 Tf
0 -30 Td
(Patient: John Doe | Status: Normal | Verified by Pathologist Dr. R. Sharma) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000140 00000 n 
0000000216 00000 n 
0000000292 00000 n 
trailer
<>/Size 5>>
startxref
486
%%EOF`;
      fs.writeFileSync(samplePdfPath, dummyPdfContent);
    }

    // 1. Create Default Users
    const admin = await User.create({
      name: 'Dr. Sarah Connor (Admin)',
      email: 'admin@health.com',
      password: 'admin123',
      role: 'Admin',
      phone: '+1 800-555-0199',
      gender: 'Female',
      age: 42
    });

    const staff = await User.create({
      name: 'Alex Vance (Lab Technician)',
      email: 'staff@health.com',
      password: 'staff123',
      role: 'Staff',
      phone: '+1 800-555-0144',
      gender: 'Male',
      age: 31
    });

    const patient = await User.create({
      name: 'John Doe',
      email: 'patient@health.com',
      password: 'patient123',
      role: 'Patient',
      phone: '+1 555-019-2834',
      gender: 'Male',
      age: 29
    });

    console.log('Default Users Created:');
    console.log(' - Admin: admin@health.com / admin123');
    console.log(' - Staff: staff@health.com / staff123');
    console.log(' - Patient: patient@health.com / patient123');

    // 2. Create Diagnostic Tests
    const tests = await Test.insertMany([
      {
        name: 'Complete Blood Count (CBC)',
        code: 'TEST-CBC-01',
        category: 'Blood Test',
        description: 'Comprehensive evaluation of overall health including RBC, WBC, Hemoglobin, Hematocrit, and Platelet count.',
        price: 49.00,
        discountPrice: 39.00,
        turnaroundTime: '12 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'Fasting for 8 hours prior to test is recommended.',
        isActive: true
      },
      {
        name: 'Lipid Profile Screen',
        code: 'TEST-LIPID-02',
        category: 'Cardiology',
        description: 'Measures Total Cholesterol, HDL (Good), LDL (Bad), Triglycerides, and VLDL to assess cardiovascular health risk.',
        price: 75.00,
        discountPrice: 59.00,
        turnaroundTime: '24 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'Strict 10-12 hours overnight fasting mandatory.',
        isActive: true
      },
      {
        name: 'Thyroid Stimulating Hormone (TSH / T3 / T4)',
        code: 'TEST-THYROID-03',
        category: 'Blood Test',
        description: 'Complete panel to evaluate thyroid gland activity and diagnose hypothyroidism or hyperthyroidism.',
        price: 65.00,
        discountPrice: 49.00,
        turnaroundTime: '24 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'No specific preparation required. Morning sample preferred.',
        isActive: true
      },
      {
        name: 'Glycated Hemoglobin (HbA1c)',
        code: 'TEST-HBA1C-04',
        category: 'Diabetes',
        description: 'Gold standard test for average blood glucose levels over the past 2 to 3 months.',
        price: 55.00,
        discountPrice: 45.00,
        turnaroundTime: '12 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'Fasting is not required.',
        isActive: true
      },
      {
        name: 'Vitamin D (25-Hydroxy)',
        code: 'TEST-VITD-05',
        category: 'Pathology',
        description: 'Measures serum Vitamin D levels for bone density health and immune system balance.',
        price: 89.00,
        discountPrice: 69.00,
        turnaroundTime: '36 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'Normal diet. Inform if taking Vitamin D supplements.',
        isActive: true
      },
      {
        name: 'Liver Function Test (LFT Panel)',
        code: 'TEST-LFT-06',
        category: 'Pathology',
        description: 'Evaluates liver enzymes (ALT, AST, ALP), Bilirubin, and Total Protein levels.',
        price: 80.00,
        discountPrice: 65.00,
        turnaroundTime: '24 Hours',
        sampleType: 'Blood',
        preparationInstruction: 'Fast for 8 hours. Avoid alcohol 24 hours prior.',
        isActive: true
      }
    ]);

    console.log(`Created ${tests.length} diagnostic tests.`);

    // 3. Create Slots for Today & Next 3 Days
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const timeSlots = [
      { startTime: '08:00 AM', endTime: '09:00 AM' },
      { startTime: '09:00 AM', endTime: '10:00 AM' },
      { startTime: '10:00 AM', endTime: '11:00 AM' },
      { startTime: '11:00 AM', endTime: '12:00 PM' },
      { startTime: '02:00 PM', endTime: '03:00 PM' },
      { startTime: '04:00 PM', endTime: '05:00 PM' }
    ];

    const slotDocs = [];
    for (const dateStr of dates) {
      for (const t of timeSlots) {
        slotDocs.push({
          date: dateStr,
          startTime: t.startTime,
          endTime: t.endTime,
          capacity: 5,
          bookedCount: 0,
          isActive: true
        });
      }
    }

    const createdSlots = await Slot.insertMany(slotDocs);
    console.log(`Created ${createdSlots.length} appointment slots.`);

    // 4. Create Sample Initial Booking
    const sampleSlot = createdSlots[0];
    const sampleTest = tests[0];

    const booking1 = await Booking.create({
      bookingId: 'DHP-MED982',
      patient: patient._id,
      patientDetails: {
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender
      },
      test: sampleTest._id,
      slot: sampleSlot._id,
      bookingDate: sampleSlot.date,
      bookingTime: `${sampleSlot.startTime} - ${sampleSlot.endTime}`,
      totalAmount: sampleTest.discountPrice,
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-984210491',
        paymentMethod: 'Credit Card (Mock)',
        paidAt: new Date()
      },
      status: 'Report Ready',
      statusHistory: [
        { status: 'Booked', updatedAt: new Date(Date.now() - 3600000 * 5), updatedBy: patient.name, note: 'Booked online.' },
        { status: 'Confirmed', updatedAt: new Date(Date.now() - 3600000 * 4), updatedBy: 'Staff (Alex Vance)', note: 'Appointment confirmed.' },
        { status: 'Sample Collected', updatedAt: new Date(Date.now() - 3600000 * 3), updatedBy: 'Staff (Alex Vance)', note: 'Blood sample tube #4092 collected.' },
        { status: 'Processing', updatedAt: new Date(Date.now() - 3600000 * 2), updatedBy: 'Staff (Alex Vance)', note: 'Centrifuge & Analyzer in progress.' },
        { status: 'Report Ready', updatedAt: new Date(Date.now() - 3600000 * 1), updatedBy: 'Staff (Alex Vance)', note: 'Report generated and verified.' }
      ],
      reportUrl: '/uploads/reports/sample-report.pdf',
      reportOriginalName: 'CBC_Patient_Report_JohnDoe.pdf',
      reportUploadedAt: new Date()
    });

    sampleSlot.bookedCount = 1;
    await sampleSlot.save();

    console.log('Sample booking created successfully.');
    console.log('Seeding completed!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

module.exports = seedData;

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}
