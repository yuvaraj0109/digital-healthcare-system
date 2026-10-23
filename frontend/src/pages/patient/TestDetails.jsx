import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { testsAPI, slotsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Stethoscope,
  Clock,
  FlaskConical,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const parseTimeToMinutes = (time) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(time?.trim() ?? '');
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (minute > 59 || (meridiem ? hour < 1 || hour > 12 : hour > 23)) return null;

  const normalizedHour = meridiem
    ? (hour % 12) + (meridiem === 'PM' ? 12 : 0)
    : hour;
  return normalizedHour * 60 + minute;
};

const normalizePatientSlot = (slot) => {
  const startMinutes = parseTimeToMinutes(slot.startTime);
  const endMatch = /^12:00\s*AM$/i.exec(slot.endTime?.trim() ?? '');

  if (startMinutes >= 11 * 60 && startMinutes < 12 * 60 && endMatch) {
    return { ...slot, endTime: '12:00 PM' };
  }

  return slot;
};

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Generate next 5 dates for date tab picker
  const datesList = Array.from({ length: 5 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      dayName: format(d, 'EEE'),
      displayDate: format(d, 'MMM dd'),
    };
  });

  // Fetch Test Details
  const { data: test, isLoading: testLoading, isError: testError } = useQuery({
    queryKey: ['test', id],
    queryFn: async () => {
      const res = await testsAPI.getById(id);
      return res.data;
    },
  });

  // Fetch Available Slots for selected date
  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', selectedDate],
    queryFn: async () => {
      const res = await slotsAPI.getAll({ date: selectedDate });
      return res.data
        .map(normalizePatientSlot)
        .sort((a, b) => {
          const aStart = parseTimeToMinutes(a.startTime);
          const bStart = parseTimeToMinutes(b.startTime);
          if (aStart === null) return bStart === null ? 0 : 1;
          if (bStart === null) return -1;
          return aStart - bStart;
        });
    },
  });

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      toast.error('Please select an appointment slot to proceed.');
      return;
    }

    if (!isAuthenticated) {
      toast('Please sign in to complete your booking.', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: `/tests/${id}` } } });
      return;
    }

    // Navigate to Mock Payment with state
    navigate('/mock-payment', {
      state: {
        test,
        slot: selectedSlot,
      },
    });
  };

  if (testLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (testError || !test) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Test Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const effectivePrice = test.discountPrice > 0 ? test.discountPrice : test.price;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Diagnostic Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Test Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-teal-100">
                {test.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Code: {test.code}</span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {test.name}
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{test.description}</p>
            </div>

            {/* Parameter Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Report Time
                </div>
                <div className="font-bold text-slate-800 text-sm">{test.turnaroundTime}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-600" /> Sample Required
                </div>
                <div className="font-bold text-slate-800 text-sm">{test.sampleType}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Lab Standard
                </div>
                <div className="font-bold text-slate-800 text-sm">NABL ISO Verified</div>
              </div>
            </div>

            {/* Fasting / Preparation instruction callout */}
            {test.preparationInstruction && (
              <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Test Preparation Instruction:</span>{' '}
                  {test.preparationInstruction}
                </div>
              </div>
            )}
          </div>

          {/* Slot Selection Box */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" /> Select Appointment Slot
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose a convenient date and available time slot for sample collection
              </p>
            </div>

            {/* Date Selector Tabs */}
            <div className="grid grid-cols-5 gap-2">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      setSelectedSlot(null);
                    }}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-semibold opacity-80">{d.dayName}</div>
                    <div className="text-sm font-extrabold mt-0.5">{d.displayDate}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Available Time Windows ({selectedDate})
              </span>

              {slotsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center text-xs text-slate-500">
                  No slots currently available for {selectedDate}. Please select another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const isBookedFull = slot.bookedCount >= slot.capacity;
                    const isSelected = selectedSlot?._id === slot._id;

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        disabled={isBookedFull}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isBookedFull
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-teal-50 text-teal-800 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/30'
                        }`}
                      >
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {isBookedFull ? (
                          <span className="text-[10px] text-rose-500 font-normal">Full</span>
                        ) : isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-normal">
                            {slot.capacity - slot.bookedCount} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Test Selected:</span>
                <span className="font-semibold text-slate-800 text-right">{test.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold text-teal-700">
                  {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'Not Selected'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Standard Test Price</span>
                <span>${test.price.toFixed(2)}</span>
              </div>
              {test.discountPrice > 0 && test.discountPrice < test.price && (
                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                  <span>Special Discount</span>
                  <span>-${(test.price - test.discountPrice).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-teal-700">${effectivePrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={!selectedSlot}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> 100% Risk-Free Mock Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;
