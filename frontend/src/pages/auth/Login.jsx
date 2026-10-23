import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Stethoscope, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Patient');
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError('');

    try {
      const user = await login(email, password, selectedRole);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials or role mismatch. Please select the correct role.';
      setLoginError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-3 shadow-sm border border-teal-100">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to AuraHealth
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Access your healthcare dashboard, lab test tracking & report downloads
          </p>
        </div>

        {/* Role selector */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
            Select your role
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRole('Patient')}
              aria-pressed={selectedRole === 'Patient'}
              className={`py-1.5 px-2 rounded-xl font-medium flex items-center justify-center gap-1 transition border ${selectedRole === 'Patient' ? 'bg-teal-50 text-teal-700 border-teal-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'}`}
            >
              <User className="w-3.5 h-3.5 text-teal-600" /> Patient
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('Staff')}
              aria-pressed={selectedRole === 'Staff'}
              className={`py-1.5 px-2 rounded-xl font-medium flex items-center justify-center gap-1 transition border ${selectedRole === 'Staff' ? 'bg-cyan-50 text-cyan-700 border-cyan-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300'}`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-600" /> Staff
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('Admin')}
              aria-pressed={selectedRole === 'Admin'}
              className={`py-1.5 px-2 rounded-xl font-medium flex items-center justify-center gap-1 transition border ${selectedRole === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'}`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Admin
            </button>
          </div>
        </div>

        {loginError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700" role="alert">
            {loginError}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have a patient account?{' '}
          <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700 underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
