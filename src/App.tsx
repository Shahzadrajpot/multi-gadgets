import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { antdTheme } from './theme/antdTheme';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// Customer Primary Pages (Eager loaded for instant first paint)
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Lazy-loaded Policy Pages (Code-split to keep initial bundle ultra-light)
const AboutPage = lazy(() => import('./pages/policies/AboutPage'));
const ContactPage = lazy(() => import('./pages/policies/ContactPage'));
const ShippingPage = lazy(() => import('./pages/policies/ShippingPage'));
const ReturnsPage = lazy(() => import('./pages/policies/ReturnsPage'));
const PrivacyPage = lazy(() => import('./pages/policies/PrivacyPage'));

// Lazy-loaded Admin Pages (Code-split so shoppers NEVER download admin code)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminDiscounts = lazy(() => import('./pages/admin/AdminDiscounts'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

import { PageSkeleton } from './components/shared/Skeletons';

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <AuthProvider>
            <AppProvider>
              <BrowserRouter>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="shop" element={<ShopPage />} />
                      <Route path="product/:slug" element={<ProductPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      
                      {/* Live Policy Pages */}
                      <Route path="about" element={<AboutPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="shipping" element={<ShippingPage />} />
                      <Route path="returns" element={<ReturnsPage />} />
                      <Route path="privacy" element={<PrivacyPage />} />
                      <Route path="account" element={<Navigate to="/admin/login" replace />} />
                    </Route>

                    {/* Admin Portal Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="discounts" element={<AdminDiscounts />} />
                      <Route path="banners" element={<AdminBanners />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
