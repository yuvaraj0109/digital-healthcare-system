import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import {
  Stethoscope,
  FlaskConical,
  Cpu,
  FileCheck,
  ClipboardList,
  ArrowRight,
  Clock
} from 'lucide-react';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['staffDashboardBookings'],
    queryFn: async () => (await bookingsAPI.getAll()).data,
  });

  const bookedCount = bookings.filter((b) => b.status === 'Booked').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const sampleCollectedCount = bookings.filter((b) => b.status === 'Sample Collected').length;
  const processingCount = bookings.filter((b) => b.status === 'Processing').length;
  const readyCount = bookings.filter((b) => b.status === 'Report Ready').length;

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratory Staff Operations Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sample processing queue, status updates & medical report upload workflow
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Booked</p>
          <h3 className="text-xl font-extrabold text-blue-700 mt-1">{bookedCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Confirmed</p>
          <h3 className="text-xl font-extrabold text-indigo-700 mt-1">{confirmedCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Sample Collected</p>
          <h3 className="text-xl font-extrabold text-amber-700 mt-1">{sampleCollectedCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Processing</p>
          <h3 className="text-xl font-extrabold text-cyan-700 mt-1">{processingCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Report Ready</p>
          <h3 className="text-xl font-extrabold text-emerald-700 mt-1">{readyCount}</h3>
        </div>
      </div>

      {/* Quick Launch CTA */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base">Update Sample Statuses & Upload Reports</h3>
          <p className="text-xs text-teal-200">
            Advance patients along the 5-step status flow and attach verified PDF report documents
          </p>
        </div>
        <Link
          to="/staff/bookings"
          className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          Open Bookings Queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Action Needed Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Urgent Lab Queue</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Test</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings
                .filter((b) => b.status !== 'Report Ready')
                .slice(0, 5)
                .map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{b.bookingId}</td>
                    <td className="p-3 font-bold text-slate-800">{b.patientDetails?.name}</td>
                    <td className="p-3 text-slate-700">{b.test?.name}</td>
                    <td className="p-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to="/staff/bookings"
                        className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold rounded text-[11px] transition"
                      >
                        Update Status
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
