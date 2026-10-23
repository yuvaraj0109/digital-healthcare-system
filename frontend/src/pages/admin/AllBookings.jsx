import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ReportViewerModal from '../../components/ReportViewerModal';
import { ClipboardList, Search, FileText, Calendar, User } from 'lucide-react';

const filterStatuses = ['All', 'Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];

const AllBookings = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['adminAllBookingsView', selectedStatus, searchTerm],
    queryFn: async () => {
      const res = await bookingsAPI.getAll({
        status: selectedStatus,
        search: searchTerm,
      });
      return res.data;
    },
  });

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          All Diagnostic Bookings Record
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive log of all patient appointments, payments, and lab statuses across the platform
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search booking ID, patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterStatuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading bookings record...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No bookings match the specified filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Diagnostic Test</th>
                  <th className="p-3">Appointment</th>
                  <th className="p-3">Paid Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{b.bookingId}</td>
                    <td className="p-3 font-bold text-slate-800">
                      {b.patientDetails?.name}
                      <span className="block font-normal text-[11px] text-slate-400">
                        {b.patientDetails?.email}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-semibold">{b.test?.name}</td>
                    <td className="p-3 text-slate-500">
                      {b.bookingDate}
                      <span className="block text-[11px] text-teal-700 font-medium">{b.bookingTime}</span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">${b.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      {b.reportUrl ? (
                        <button
                          onClick={() =>
                            setSelectedReport({
                              url: b.reportUrl,
                              name: b.reportOriginalName,
                              bookingId: b.bookingId,
                            })
                          }
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded text-[11px] inline-flex items-center gap-1 transition"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Modal */}
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

export default AllBookings;
