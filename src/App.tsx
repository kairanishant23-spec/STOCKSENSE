import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

// Auth & Context
import { AuthProvider } from '@/context/AuthContext';
import { InventoryProvider } from '@/context/InventoryContext';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ReceiptsListPage = React.lazy(() => import('@/pages/ReceiptsListPage'));
const ReceiptFormPage = React.lazy(() => import('@/pages/ReceiptFormPage'));
const DeliveryListPage = React.lazy(() => import('@/pages/DeliveryListPage'));
const DeliveryFormPage = React.lazy(() => import('@/pages/DeliveryFormPage'));
const StockAdjustmentPage = React.lazy(() => import('@/pages/StockAdjustmentPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductFormPage = React.lazy(() => import('@/pages/ProductFormPage'));
const MoveHistoryPage = React.lazy(() => import('@/pages/MoveHistoryPage'));
const WarehousePage = React.lazy(() => import('@/pages/WarehousePage'));
const LocationsPage = React.lazy(() => import('@/pages/LocationsPage'));
const InternalTransfersPage = React.lazy(() => import('@/pages/InternalTransfersPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="operations/receipts" element={<ReceiptsListPage />} />
          <Route path="operations/receipts/new" element={<ReceiptFormPage />} />
          <Route path="operations/receipts/:id" element={<ReceiptFormPage />} />
          
          <Route path="operations/deliveries" element={<DeliveryListPage />} />
          <Route path="operations/deliveries/new" element={<DeliveryFormPage />} />
          <Route path="operations/deliveries/:id" element={<DeliveryFormPage />} />
          
          <Route path="operations/adjustments" element={<StockAdjustmentPage />} />
          
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          
          <Route path="move-history" element={<MoveHistoryPage />} />
          
          <Route path="settings/warehouse" element={<WarehousePage />} />
          <Route path="settings/locations" element={<LocationsPage />} />
          
          <Route path="transfers" element={<InternalTransfersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InventoryProvider>
          <AppRoutes />
        </InventoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
