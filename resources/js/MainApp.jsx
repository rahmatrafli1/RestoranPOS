// filepath: resources/js/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages will be created next
import Login from './pages/auth/Login';
// import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } 
        />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard routes will be added here */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;