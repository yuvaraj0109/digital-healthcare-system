import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { bookingsAPI, testsAPI, usersAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  PlusCircle,
  ArrowRight,
  Activity,
  Layers,
  ClipboardList
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: bookings = [] } = useQuery({
    queryKey: ['adminAllBookings'],
    queryFn: async () => (await bookingsAPI.getAll()).data,
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['adminTests'],
    queryFn: async () => (await testsAPI.getAll()).data,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => (await usersAPI.getAll()).data,
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const patientCount = users.filter((u) => u.role === 'Patient').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Executive Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Platform performance metrics, diagnostic tests catalog management, and user controls
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{patientCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{bookings.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tests</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{tests.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Revenue</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              ${totalRevenue.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base">Quick Administrative Actions</h3>
          <p className="text-xs text-slate-300">Add diagnostic tests or configure appointment slots</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/tests"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" /> Manage Tests
          </Link>
          <Link
            to="/admin/slots"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Layers className="w-4 h-4" /> Manage Slots
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Users className="w-4 h-4" /> Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Platform Bookings</h3>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Test</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-800">{b.bookingId}</td>
                  <td className="p-3 font-medium text-slate-800">{b.patientDetails?.name}</td>
                  <td className="p-3 text-slate-700">{b.test?.name}</td>
                  <td className="p-3 text-slate-500">
                    {b.bookingDate} ({b.bookingTime})
                  </td>
                  <td className="p-3 font-bold text-slate-900">${b.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <StatusBadge status={b.status} size="sm" />
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

export default AdminDashboard;
