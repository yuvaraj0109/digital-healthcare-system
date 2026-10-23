import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingsAPI } from '../../services/api';
import Timeline from '../../components/Timeline';
import StatusBadge from '../../components/StatusBadge';
import ReportViewerModal from '../../components/ReportViewerModal';
import { ChevronLeft, FileText, Calendar, Clock, User, ShieldCheck } from 'lucide-react';

const TrackJourney = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await bookingsAPI.getById(id);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Record Not Found</h2>
        <button
          onClick={() => navigate('/my-bookings')}
          className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back Link */}
      <button
        onClick={() => navigate('/my-bookings')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Bookings
      </button>

      {/* Booking Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <span className="text-xs font-mono font-bold text-slate-400">Ref: {booking.bookingId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {booking.test?.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" /> Patient: {booking.patientDetails?.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> {booking.bookingDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {booking.bookingTime}
            </span>
          </div>
        </div>

        {booking.status === 'Report Ready' && booking.reportUrl && (
          <button
            onClick={() => setShowReportModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition"
          >
            <FileText className="w-4 h-4" /> View & Download PDF Report
          </button>
        )}
      </div>

      {/* Status Timeline Visualization Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Healthcare Status Journey</h3>
            <p className="text-xs text-slate-500">Live 5-step status tracking for your medical sample</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-teal-600" />
        </div>

        <Timeline currentStatus={booking.status} statusHistory={booking.statusHistory} />
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportViewerModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportUrl={booking.reportUrl}
          reportName={booking.reportOriginalName}
          bookingId={booking.bookingId}
        />
      )}
    </div>
  );
};

export default TrackJourney;
