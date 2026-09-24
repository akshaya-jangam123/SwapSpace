import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { AdminRoute } from './layouts/AdminRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Discover } from './pages/Discover';
import { SkillDetail } from './pages/SkillDetail';
import { ItemDetail } from './pages/ItemDetail';
import { CreateSkill } from './pages/CreateSkill';
import { CreateItem } from './pages/CreateItem';
import { EditSkill } from './pages/EditSkill';
import { EditItem } from './pages/EditItem';
import { Dashboard } from './pages/Dashboard';
import { Matches } from './pages/Matches';
import { Exchanges } from './pages/Exchanges';
import { ExchangeDetail } from './pages/ExchangeDetail';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { MyProfile } from './pages/MyProfile';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminListings } from './pages/Admin/AdminListings';
import { AdminReports } from './pages/Admin/AdminReports';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/skills/:id" element={<SkillDetail />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/users/:id" element={<Profile />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedRoute>
                    <Matches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exchanges"
                element={
                  <ProtectedRoute>
                    <Exchanges />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exchanges/:id"
                element={
                  <ProtectedRoute>
                    <ExchangeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-skill"
                element={
                  <ProtectedRoute>
                    <CreateSkill />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-item"
                element={
                  <ProtectedRoute>
                    <CreateItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditSkill />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/listings"
                element={
                  <AdminRoute>
                    <AdminListings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <AdminReports />
                  </AdminRoute>
                }
              />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
