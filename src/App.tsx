import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingAssistant } from './components/FloatingAssistant';
import { PromoModal } from './components/PromoModal';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { Portfolio } from './pages/Portfolio';
import { Lab } from './pages/Lab';
import { RequestWizard } from './pages/RequestWizard';
import { TrackRequest } from './pages/TrackRequest';
import { Contact } from './pages/Contact';
import { Policies } from './pages/Policies';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Products } from './pages/Products';
import { ProductCustomizer } from './pages/ProductCustomizer';
import { Cart } from './pages/Cart';
import { OrderCheckout } from './pages/OrderCheckout';
import { PaymentGateway } from './pages/PaymentGateway';
import { Account } from './pages/Account';

export function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin';
  const isPaymentGateway = location.pathname.startsWith('/payment-gateway') || location.pathname.startsWith('/pay');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <ScrollToTop />
      {!isAdminDashboard && !isPaymentGateway && !isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders" element={<Account />} />
          <Route path="/order" element={<OrderCheckout />} />
          <Route path="/checkout" element={<OrderCheckout />} />
          <Route path="/payment-gateway" element={<PaymentGateway />} />
          <Route path="/pay" element={<PaymentGateway />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/customize" element={<ProductCustomizer />} />
          <Route path="/customize/:productId" element={<ProductCustomizer />} />
          <Route path="/customizer" element={<ProductCustomizer />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/request" element={<RequestWizard />} />
          <Route path="/track" element={<TrackRequest />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdminDashboard && !isPaymentGateway && !isAuthPage && <Footer />}
      {!isAdminDashboard && !isPaymentGateway && !isAuthPage && <FloatingAssistant />}
      {!isAdminDashboard && !isPaymentGateway && !isAuthPage && <PromoModal />}
    </div>
  );
}

export default App;
