import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

const MockPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { test, slot } = location.state || {};

  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || 30,
    gender: user?.gender || 'Male',
  });

  const [cardDetails, setCardDetails] = useState({
    cardName: user?.name || 'John Doe',
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '982',
  });

  const [processing, setProcessing] = useState(false);

  if (!test || !slot) {
    return (
      <div className="py-12 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Booking Information Found</h2>
        <p className="text-xs text-slate-500">Please select a test and time slot first.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const effectivePrice = test.discountPrice > 0 ? test.discountPrice : test.price;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate slight processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      const bookingPayload = {
        testId: test._id,
        slotId: slot._id,
        patientDetails: {
          name: patientDetails.name,
          email: patientDetails.email,
          phone: patientDetails.phone,
          age: Number(patientDetails.age),
          gender: patientDetails.gender,
        },
        paymentDetails: {
          transactionId: `TXN-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentMethod: 'Mock Online Payment',
        },
      };

      const res = await bookingsAPI.create(bookingPayload);
      const createdBooking = res.data;

      toast.success('Payment completed & booking confirmed!');
      navigate('/booking-success', { state: { booking: createdBooking } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment simulation failed.';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Slot Selection
      </button>

      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Simulation Payment Gateway
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Mock Payment
        </h1>
        <p className="text-xs text-slate-500">
          This is a mock checkout. Click "Pay Now" to simulate instant successful payment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Patient Info & Mock Payment Form */}
        <div className="space-y-6">
          {/* Patient Details Confirmation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" /> Patient Details for Lab Record
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={patientDetails.phone}
                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Age / Gender
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="number"
                      value={patientDetails.age}
                      onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <select
                      value={patientDetails.gender}
                      onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card Inputs */}
          <form onSubmit={handlePayNow} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" /> Payment Card Info (Mock)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    required
                    value={cardDetails.expDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-50"
            >
              {processing ? (
                <span>Simulating Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay ${effectivePrice.toFixed(2)} Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Summary Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
                Order Summary
              </span>
              <span className="text-xs text-slate-400 font-mono">{test.code}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{test.name}</h3>
              <p className="text-xs text-slate-300 mt-1">{test.category} Diagnostic Test</p>
            </div>

            <div className="space-y-3 pt-2 text-xs border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" /> Date:
                </span>
                <span className="font-semibold text-white">{slot.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" /> Time Window:
                </span>
                <span className="font-semibold text-teal-300">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${test.price.toFixed(2)}</span>
              </div>
              {test.discountPrice > 0 && test.discountPrice < test.price && (
                <div className="flex justify-between text-teal-400">
                  <span>Platform Discount</span>
                  <span>-${(test.price - test.discountPrice).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                <span>Total Amount Due</span>
                <span className="text-teal-300">${effectivePrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl text-[11px] text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Instant mock authorization. No real money will be charged.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
