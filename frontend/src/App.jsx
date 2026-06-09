import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, AuthProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Customer pages
import WelcomePage   from './pages/customer/WelcomePage';
import MenuPage      from './pages/customer/MenuPage';
import CheckoutPage  from './pages/customer/CheckoutPage';

// Admin pages
import AdminLoginPage  from './pages/admin/AdminLoginPage';
import AdminLayout     from './pages/admin/AdminLayout';
import AdminTablesPage from './pages/admin/AdminTablesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage   from './pages/admin/AdminMenuPage';

import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer routes */}
            <Route path="/"        element={<WelcomePage />} />
            <Route path="/menu"    element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/tables" replace />} />
              <Route path="tables" element={<AdminTablesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="menu"   element={<AdminMenuPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
