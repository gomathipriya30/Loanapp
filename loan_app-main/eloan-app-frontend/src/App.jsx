import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Public components ---
import LandingPage from './pages/LandingPage.jsx'; // <-- IMPORT NEW
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminLogin from './components/AdminLogin.jsx';

// --- User Protected components ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import LoanList from './pages/LoanList.jsx';
import MyLoans from './pages/MyLoans.jsx';
import Profile from './pages/Profile.jsx';
import EMICalculator from './pages/EMICalculator.jsx';
import Support from './pages/Support.jsx';
import TicketDetail from './pages/TicketDetail.jsx';

// --- Admin Protected components ---
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import AdminDashboardLayout from './layouts/AdminDashboardLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx'; // Admin Dashboard homepage
import ManageLoans from './pages/admin/ManageLoans.jsx';
import AddLoan from './pages/admin/AddLoan.jsx';
import EditLoan from './pages/admin/EditLoan.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageAdmins from './pages/admin/ManageAdmins.jsx';
import ManageApplications from './pages/admin/ManageApplications.jsx';
import ManageSupport from './pages/admin/ManageSupport.jsx';
import SupportTicketDetail from './pages/admin/SupportTicketDetail.jsx';
import Settings from './pages/admin/Settings.jsx';

function App() {
  return (
    <Routes>
      {/* === Public Routes === */}
      {/* Changed the root path to render LandingPage */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* === Protected User Dashboard Routes === */}
      <Route element={<ProtectedRoute />}>
        {/* Redirect /dashboard to /dashboard/loans */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/loans" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="loans" element={<LoanList />} /> {/* Renamed from index */}
          <Route path="apply" element={<LoanList />} /> {/* Assuming apply uses LoanList */}
          <Route path="my-loans" element={<MyLoans />} />
          <Route path="calculator" element={<EMICalculator />} />
          <Route path="support" element={<Support />} />
          <Route path="support/:id" element={<TicketDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* === Protected Admin Dashboard Routes === */}
      <Route element={<ProtectedAdminRoute />}>
        {/* Redirect /admin/dashboard to /admin/dashboard/stats or similar */}
        <Route path="/admin/dashboard" element={<Navigate to="/admin/dashboard/stats" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
          <Route path="stats" element={<Dashboard />} /> {/* Admin homepage */}
          <Route path="applications" element={<ManageApplications />} />
          <Route path="support" element={<ManageSupport />} />
          <Route path="support/:id" element={<SupportTicketDetail />} />
          <Route path="loans" element={<ManageLoans />} />
          <Route path="loans/add" element={<AddLoan />} />
          <Route path="loans/:id/edit" element={<EditLoan />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Optional: Add a catch-all route for 404 Not Found */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}

    </Routes>
  );
}

export default App;