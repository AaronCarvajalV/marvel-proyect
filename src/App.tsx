import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { HeroNetwork } from './pages/HeroNetwork';
import { HeroDetail } from './pages/HeroDetail';
import { HeroForm } from './pages/HeroForm';
import { MissionList } from './pages/MissionList';
import { MissionForm } from './pages/MissionForm';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="heroes" element={<HeroNetwork />} />
              <Route path="heroes/new" element={<HeroForm />} />
              <Route path="heroes/:id" element={<HeroDetail />} />
              <Route path="missions" element={<MissionList />} />
              <Route path="missions/new" element={<MissionForm />} />
              <Route path="missions/:id/edit" element={<MissionForm />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
