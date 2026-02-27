import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api/api';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveManagement from './pages/LeaveManagement';
import Hierarchy from './pages/Hierarchy';

// Protected route wrapper
const Protected = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return <AppLayout user={user}>{children}</AppLayout>;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Protected user={user}><Dashboard user={user} /></Protected>} />
        <Route path="/hierarchy" element={<Protected user={user}><Hierarchy /></Protected>} />
        <Route path="/leaves" element={<Protected user={user}><LeaveManagement /></Protected>} />
      </Routes>
    </Router>
  );
}

export default App;