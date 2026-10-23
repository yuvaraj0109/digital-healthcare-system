import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Search, Trash2, Shield, UserCheck, Stethoscope, User } from 'lucide-react';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminManageUsers'],
    queryFn: async () => (await usersAPI.getAll()).data,
  });

  // Update Role Mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => usersAPI.updateRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageUsers']);
      toast.success('User role updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    },
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminManageUsers']);
      toast.success('User deleted!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    },
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Manage System Accounts & Roles
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View registered patients, laboratory staff, and administrative users
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search user by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading user accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">User Details</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Change Role</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-800">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : u.role === 'Staff'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Patient">Patient</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user '${u.name}'?`)) {
                            deleteMutation.mutate(u._id);
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
    </div>
  );
};

export default ManageUsers;
