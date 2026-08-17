import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { HeroNetwork } from '../pages/HeroNetwork';
import { HeroDetail } from '../pages/HeroDetail';
import { HeroForm } from '../pages/HeroForm';
import { MissionList } from '../pages/MissionList';
import { MissionForm } from '../pages/MissionForm';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Heroes Routes */}
          <Route path="/heroes" element={<HeroNetwork />} />
          <Route path="/heroes/new" element={<HeroForm />} />
          <Route path="/heroes/:id" element={<HeroDetail />} />
          <Route path="/heroes/:id/edit" element={<HeroForm />} />
          
          {/* Missions Routes */}
          <Route path="/missions" element={<MissionList />} />
          <Route path="/missions/new" element={<MissionForm />} />
          <Route path="/missions/:id/edit" element={<MissionForm />} />
          
          {/* We will add other routes here later */}
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

