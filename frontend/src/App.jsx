import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import Home from './pages/patient/Home';
import TestDetails from './pages/patient/TestDetails';
import MockPayment from './pages/patient/MockPayment';
import BookingSuccess from './pages/patient/BookingSuccess';
import MyBookings from './pages/patient/MyBookings';
import TrackJourney from './pages/patient/TrackJourney';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTests from './pages/admin/ManageTests';
import ManageSlots from './pages/admin/ManageSlots';
import ManageUsers from './pages/admin/ManageUsers';
import AllBookings from './pages/admin/AllBookings';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import BookingsList from './pages/staff/BookingsList';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tests/:id" element={<TestDetails />} />

            {/* Patient Protected Routes */}
            <Route
              path="/mock-payment"
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <MockPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-success"
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Shared Track Journey Route */}
            <Route
              path="/track/:id"
              element={
                <ProtectedRoute allowedRoles={['Patient', 'Staff', 'Admin']}>
                  <TrackJourney />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tests"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageTests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/slots"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageSlots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AllBookings />
                </ProtectedRoute>
              }
            />

            {/* Staff Protected Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/bookings"
              element={
                <ProtectedRoute allowedRoles={['Staff']}>
                  <BookingsList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
