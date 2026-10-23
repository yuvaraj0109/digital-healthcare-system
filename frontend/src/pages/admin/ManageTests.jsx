import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  FlaskConical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const categories = ['Blood Test', 'Radiology', 'Pathology', 'Cardiology', 'Diabetes', 'Health Package', 'General'];

const ManageTests = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Blood Test',
    description: '',
    price: 50,
    discountPrice: 40,
    turnaroundTime: '24 Hours',
    sampleType: 'Blood',
    preparationInstruction: 'Fasting 8-10 hours recommended.',
    isActive: true,
  });

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['adminManageTests'],
    queryFn: async () => (await testsAPI.getAll()).data,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: testsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageTests']);
      toast.success('New diagnostic test added!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add test');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => testsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageTests']);
      toast.success('Test updated successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update test');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: testsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageTests']);
      toast.success('Test deleted!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete test');
    },
  });

  const openCreateModal = () => {
    setEditingTest(null);
    setFormData({
      name: '',
      code: `TEST-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Blood Test',
      description: '',
      price: 50,
      discountPrice: 40,
      turnaroundTime: '24 Hours',
      sampleType: 'Blood',
      preparationInstruction: 'Fasting 8-10 hours recommended.',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      code: test.code,
      category: test.category,
      description: test.description,
      price: test.price,
      discountPrice: test.discountPrice || 0,
      turnaroundTime: test.turnaroundTime,
      sampleType: test.sampleType,
      preparationInstruction: test.preparationInstruction || '',
      isActive: test.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
    };

    if (editingTest) {
      updateMutation.mutate({ id: editingTest._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Diagnostic Tests Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, or toggle diagnostic tests available for patients
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add New Diagnostic Test
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Test Code & Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Turnaround</th>
                  <th className="p-3">Sample</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => (
                  <tr key={test._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-400 text-[10px]">{test.code}</div>
                      <div className="font-bold text-slate-800 text-sm">{test.name}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-semibold rounded text-[11px]">
                        {test.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      ${test.discountPrice > 0 ? test.discountPrice : test.price}
                      {test.discountPrice > 0 && (
                        <span className="text-[10px] text-slate-400 line-through block font-normal">
                          ${test.price}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">{test.turnaroundTime}</td>
                    <td className="p-3 text-slate-600">{test.sampleType}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(test)}
                        className="p-1.5 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete test '${test.name}'?`)) {
                            deleteMutation.mutate(test._id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
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

      {/* Add / Edit Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTest ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Complete Blood Count (CBC)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Turnaround Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.turnaroundTime}
                    onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. 24 Hours"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sample Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.sampleType}
                    onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Blood, Urine"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preparation Note</label>
                <input
                  type="text"
                  value={formData.preparationInstruction}
                  onChange={(e) => setFormData({ ...formData, preparationInstruction: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Fasting instructions..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl shadow-sm hover:bg-teal-700"
                >
                  {editingTest ? 'Save Changes' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTests;
