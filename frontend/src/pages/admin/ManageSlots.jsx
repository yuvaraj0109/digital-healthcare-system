import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Layers, Plus, Trash2, Calendar, Clock, X, CheckCircle2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

const ManageSlots = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    date: todayStr,
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    capacity: 5,
  });

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['adminManageSlots', filterDate],
    queryFn: async () => (await slotsAPI.getAll({ date: filterDate })).data,
  });

  // Create Slot Mutation
  const createMutation = useMutation({
    mutationFn: slotsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageSlots']);
      toast.success('Appointment slot added successfully!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add slot');
    },
  });

  // Delete Slot Mutation
  const deleteMutation = useMutation({
    mutationFn: slotsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageSlots']);
      toast.success('Slot removed!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete slot');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, capacity: Number(formData.capacity) });
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Appointment Slots
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure daily time windows and capacity for diagnostic sample collections
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add New Appointment Slot
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs max-w-sm">
        <Calendar className="w-4 h-4 text-teal-600" />
        <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter by Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="text-[11px] text-rose-600 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading slots...</div>
        ) : slots.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No appointment slots found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time Window</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Bookings Count</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-800">{s.date}</td>
                    <td className="p-3 font-semibold text-teal-700">
                      {s.startTime} - {s.endTime}
                    </td>
                    <td className="p-3">{s.capacity} Patients</td>
                    <td className="p-3 font-bold text-slate-900">{s.bookedCount} Booked</td>
                    <td className="p-3">
                      {s.bookedCount >= s.capacity ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded text-[10px]">
                          Fully Booked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                          Available ({s.capacity - s.bookedCount} left)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove slot on ${s.date} (${s.startTime})?`)) {
                            deleteMutation.mutate(s._id);
                          }
                        }}
                        disabled={s.bookedCount > 0}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title={s.bookedCount > 0 ? 'Cannot delete slot with active bookings' : 'Delete slot'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Appointment Slot</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. 08:00 AM"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. 09:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Capacity (Max Patients)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl shadow-sm hover:bg-teal-700"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlots;
