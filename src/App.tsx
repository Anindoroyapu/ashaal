import React, { useEffect } from 'react';
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

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'product-details':
        return <ProductDetailPage />;
      case 'search':
        return <SearchListingPage />;
      case 'flash-sale':
        return <FlashSalePage />;
      case 'daraz-mall':
        return <DarazMallPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'my-account':
        return <MyAccountPage />;
      case 'customer-care':
        return <CustomerCarePage />;
      case 'seller-center':
        return <SellerCenterPage />;
      case 'coins-rewards':
        return <CoinsRewardsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eff0f5] text-[#212121] font-sans selection:bg-[#16a34a] selection:text-white">
      {/* 1. Header (Sticky Top Bar, Search, Language, Cart, Account, Categories) */}
      <Header />

      {/* 2. Dynamic Main Content Page */}
      <main className="flex-1 w-full">{renderCurrentPage()}</main>

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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
