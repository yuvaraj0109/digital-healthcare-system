import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Calendar,
  LogOut,
  User,
  ShieldAlert,
  ClipboardList,
  Layers,
  Users,
  Menu,
  X,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isPatient, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
      isActive(path)
        ? 'bg-teal-50 text-teal-700 shadow-xs'
        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-teal-700 bg-clip-text text-transparent">
                AuraHealth
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-teal-600 font-semibold -mt-1">
                Diagnostic Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Patient Links */}
            {(!user || isPatient) && (
              <>
                <Link to="/" className={navLinkClass('/')}>
                  <Stethoscope className="w-4 h-4" /> Browse Tests
                </Link>
                {user && (
                  <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>
                    <Calendar className="w-4 h-4" /> My Bookings
                  </Link>
                )}
              </>
            )}

            {/* Staff Links */}
            {isStaff && (
              <>
                <Link to="/staff/dashboard" className={navLinkClass('/staff/dashboard')}>
                  <Activity className="w-4 h-4" /> Staff Dashboard
                </Link>
                <Link to="/staff/bookings" className={navLinkClass('/staff/bookings')}>
                  <ClipboardList className="w-4 h-4" /> Bookings & Status
                </Link>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  <Activity className="w-4 h-4" /> Admin Dashboard
                </Link>
                <Link to="/admin/tests" className={navLinkClass('/admin/tests')}>
                  <Stethoscope className="w-4 h-4" /> Tests
                </Link>
                <Link to="/admin/slots" className={navLinkClass('/admin/slots')}>
                  <Layers className="w-4 h-4" /> Slots
                </Link>
                <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                  <Users className="w-4 h-4" /> Users
                </Link>
                <Link to="/admin/bookings" className={navLinkClass('/admin/bookings')}>
                  <ClipboardList className="w-4 h-4" /> All Bookings
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100/80 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-teal-600 font-medium">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {(!user || isPatient) && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/')}
              >
                Browse Tests
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass('/my-bookings')}
                >
                  My Bookings
                </Link>
              )}
            </>
          )}

          {isStaff && (
            <>
              <Link
                to="/staff/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/staff/dashboard')}
              >
                Staff Dashboard
              </Link>
              <Link
                to="/staff/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/staff/bookings')}
              >
                Bookings & Status
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin/dashboard')}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/tests"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin/tests')}
              >
                Manage Tests
              </Link>
              <Link
                to="/admin/slots"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin/slots')}
              >
                Manage Slots
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin/users')}
              >
                Manage Users
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/admin/bookings')}
              >
                All Bookings
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-teal-600 font-medium">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs text-rose-600 bg-rose-50 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
