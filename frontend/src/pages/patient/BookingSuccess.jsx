import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="py-12 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Complete</h2>
        <Link to="/my-bookings" className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl inline-block">
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-6">
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Payment Confirmed
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Appointment Booked Successfully!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your reference ID is <span className="font-mono font-bold text-slate-800">{booking.bookingId}</span>
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500">Test Name</span>
            <span className="font-bold text-slate-800">{booking.test?.name || 'Diagnostic Test'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Patient</span>
            <span className="font-semibold text-slate-800">{booking.patientDetails?.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Appointment Date</span>
            <span className="font-semibold text-slate-800">{booking.bookingDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Time Window</span>
            <span className="font-semibold text-teal-700">{booking.bookingTime}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
            <span className="text-slate-500">Initial Status</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/track/${booking._id}`)}
            className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            Track Healthcare Journey <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/my-bookings"
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center transition"
          >
            View All My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
