import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ReportViewerModal from '../../components/ReportViewerModal';
import toast from 'react-hot-toast';
import {
  ClipboardList,
  Search,
  Upload,
  RefreshCw,
  X,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const validStatuses = ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];

const BookingsList = () => {
  const queryClient = useQueryClient();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusReportFile, setStatusReportFile] = useState(null);

  const [uploadModalBooking, setUploadModalBooking] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [viewReportModal, setViewReportModal] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['staffBookings', selectedStatusFilter, searchTerm],
    queryFn: async () => {
      const res = await bookingsAPI.getAll({
        status: selectedStatusFilter,
        search: searchTerm,
      });
      return res.data;
    },
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, data }) => bookingsAPI.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staffBookings']);
      toast.success('Booking status updated!');
      closeStatusModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const openStatusModal = (booking) => {
    setStatusModalBooking(booking);
    setTargetStatus(booking.status);
    setStatusNote('');
    setStatusReportFile(null);
  };

  const closeStatusModal = () => {
    setStatusModalBooking(null);
    setTargetStatus('');
    setStatusNote('');
    setStatusReportFile(null);
  };

  const requiresReportUpload = targetStatus === 'Report Ready' && !statusModalBooking?.reportUrl;

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!statusModalBooking) return;

    if (requiresReportUpload && !statusReportFile) {
      toast.error('Please upload the lab report PDF before marking status as Report Ready.');
      return;
    }

    const formData = new FormData();
    formData.append('status', targetStatus);
    if (statusNote) formData.append('note', statusNote);
    if (statusReportFile) formData.append('report', statusReportFile);

    statusMutation.mutate({
      id: statusModalBooking._id,
      data: requiresReportUpload ? formData : { status: targetStatus, note: statusNote },
    });
  };

  // Upload Report PDF submit
  const handleReportUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadModalBooking || !pdfFile) {
      toast.error('Please select a PDF report file to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('report', pdfFile);

      await bookingsAPI.uploadReport(uploadModalBooking._id, formData);
      queryClient.invalidateQueries(['staffBookings']);
      toast.success('Medical report PDF uploaded & status set to Report Ready!');
      setUploadModalBooking(null);
      setPdfFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PDF Report upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Staff Bookings Queue & Status Manager
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Advance sample collection statuses and attach official PDF lab report documents
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search booking ref, patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...validStatuses].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatusFilter === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading queue...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No bookings match the selected criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Test</th>
                  <th className="p-3">Appointment Slot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{b.bookingId}</td>
                    <td className="p-3 font-bold text-slate-800">
                      {b.patientDetails?.name}
                      <span className="block font-normal text-[11px] text-slate-400">
                        {b.patientDetails?.phone || b.patientDetails?.email}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{b.test?.name}</td>
                    <td className="p-3 text-slate-500">
                      {b.bookingDate} ({b.bookingTime})
                    </td>
                    <td className="p-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openStatusModal(b)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-semibold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                      >
                        <RefreshCw className="w-3 h-3 text-teal-600" /> Update Status
                      </button>

                      <button
                        onClick={() => setUploadModalBooking(b)}
                        className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition inline-flex items-center gap-1 text-[11px] shadow-xs"
                      >
                        <Upload className="w-3 h-3" /> Upload Report
                      </button>

                      {b.reportUrl && (
                        <button
                          onClick={() => setViewReportModal(b)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                        >
                          <FileText className="w-3 h-3" /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Booking Status</h3>
                <p className="text-xs text-slate-400">Ref ID: {statusModalBooking.bookingId}</p>
              </div>
              <button onClick={closeStatusModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Status Step *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {validStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Flow: Booked → Confirmed → Sample Collected → Processing → Report Ready
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Note / Lab Remark</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Blood sample tube #402 collected from patient."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {requiresReportUpload && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Upload PDF Report *
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={(e) => setStatusReportFile(e.target.files[0])}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <p className="text-[10px] text-amber-700 mt-1">
                    Please upload the lab report PDF before marking status as Report Ready.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusMutation.isPending || (requiresReportUpload && !statusReportFile)}
                  className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statusMutation.isPending ? 'Saving...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload PDF Report Modal */}
      {uploadModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload PDF Medical Report</h3>
                <p className="text-xs text-slate-400">
                  {uploadModalBooking.test?.name} (Ref: {uploadModalBooking.bookingId})
                </p>
              </div>
              <button
                onClick={() => setUploadModalBooking(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select PDF Report File *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Only .pdf files up to 10MB are accepted.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                Uploading a report will automatically advance the status to{' '}
                <span className="font-bold">Report Ready</span> and notify the patient.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalBooking(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !pdfFile}
                  className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl shadow-sm hover:bg-teal-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading PDF...' : 'Upload & Finalize Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {viewReportModal && (
        <ReportViewerModal
          isOpen={!!viewReportModal}
          onClose={() => setViewReportModal(null)}
          reportUrl={viewReportModal.reportUrl}
          reportName={viewReportModal.reportOriginalName}
          bookingId={viewReportModal.bookingId}
        />
      )}
    </div>
  );
};

export default BookingsList;
