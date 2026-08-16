import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal, LocationModal } from './components/Modals';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchListingPage } from './pages/SearchListingPage';
import { FlashSalePage, DarazMallPage } from './pages/FlashSalePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage, TrackOrderPage } from './pages/OrderConfirmationPage';
import { MyAccountPage, CustomerCarePage } from './pages/MyAccountPage';
import { SellerCenterPage, CoinsRewardsPage } from './pages/SellerCenterPage';

/**
 * Scroll to top on route change automatically
 */
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
};

/**
 * App Layout with Header, Footer, and Next.js / React Router declarative Routes
 */
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#eff0f5] text-[#212121] font-sans selection:bg-[#16a34a] selection:text-white">
      <ScrollToTop />

      {/* 1. Header (Sticky Top Bar, Search, Language, Cart, Account, Categories) */}
      <Header />

      {/* 2. Declarative Route-based Page Rendering */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/category/:slug" element={<SearchListingPage />} />
          <Route path="/search" element={<SearchListingPage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/ashaalmall" element={<DarazMallPage />} />
          <Route path="/daraz-mall" element={<Navigate to="/ashaalmall" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/customer-care" element={<CustomerCarePage />} />
          <Route path="/seller-center" element={<SellerCenterPage />} />
          <Route path="/coins-rewards" element={<CoinsRewardsPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Footer (Authentic Ashaal Footer, Helpline, Payment Brands, App Links) */}
      <Footer />

      {/* 4. Global Interactive Modals */}
      <LoginModal />
      <LocationModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
