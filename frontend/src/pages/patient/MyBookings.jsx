import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ReportViewerModal from '../../components/ReportViewerModal';
import { Calendar, Clock, FileText, ArrowRight, Activity, Filter, Download } from 'lucide-react';

const filterTabs = ['All', 'Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const res = await bookingsAPI.getMyBookings();
      return res.data;
    },
  });

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Diagnostic Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track appointment status timelines and view verified medical reports
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 h-36 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-700 text-sm text-center">
          Failed to load your bookings. Please try again.
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-base">No bookings found</h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'All'
              ? "You haven't booked any diagnostic tests yet."
              : `No bookings with status '${activeTab}'.`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
          >
            Browse Diagnostic Tests
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Side: Test & Date info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={b.status} />
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ID: {b.bookingId}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Paid (${b.totalAmount.toFixed(2)})
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{b.test?.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" /> {b.bookingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> {b.bookingTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => navigate(`/track/${b._id}`)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Activity className="w-3.5 h-3.5 text-teal-600" /> Track Journey
                </button>

                {b.status === 'Report Ready' && b.reportUrl ? (
                  <button
                    onClick={() =>
                      setSelectedReport({
                        url: b.reportUrl,
                        name: b.reportOriginalName,
                        bookingId: b.bookingId,
                      })
                    }
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Report
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    Report pending lab completion
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Viewer Modal */}
      {selectedReport && (
        <ReportViewerModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          reportUrl={selectedReport.url}
          reportName={selectedReport.name}
          bookingId={selectedReport.bookingId}
        />
      )}
    </div>
  );
};

export default MyBookings;
