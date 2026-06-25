import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/MainLayout';
import ClientDashboard from './pages/client/Dashboard';
import MyProjects from './pages/client/MyProjects';
import ClientProfile from './pages/client/Profile'; // Import new component
import ArchitectDetails from './pages/ArchitectDetails'; // Import ArchitectDetails
import ArchitectDashboard from './pages/architect/Dashboard';
import ProjectRequests from './pages/architect/Requests';
import ArchitectProfile from './pages/architect/Profile'; // Import new component
import AdminDashboard from './pages/admin/Dashboard';
import ManageArchitects from './pages/admin/Architects';
import AllProjects from './pages/admin/Projects';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/architect/:id" element={<ArchitectDetails />} />

          {/* Client Routes */}
          <Route 
            path="/client/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client/projects" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <MyProjects />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/client/profile" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientProfile />
              </ProtectedRoute>
            } 
          />

          {/* Architect Routes */}
          <Route 
            path="/architect/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ARCHITECT']}>
                <ArchitectDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/architect/requests" 
            element={
              <ProtectedRoute allowedRoles={['ARCHITECT']}>
                <ProjectRequests />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/architect/profile" 
            element={
              <ProtectedRoute allowedRoles={['ARCHITECT']}>
                <ArchitectProfile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/architects" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageArchitects />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AllProjects />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
