import { AppProvider, useApp } from './context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UTChampionsPage from './pages/UTChampionsPage';
import DivisionRivalsPage from './pages/DivisionRivalsPage';
import CoinsBoostingPage from './pages/CoinsBoostingPage';
import AllServicesPage from './pages/AllServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import CoachingPage from './pages/CoachingPage';
import AdminOrderDashboard from './components/AdminOrderDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import UserDashboardModal from './components/UserDashboardModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import ContactMethodModal from './components/ContactMethodModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
};

function MainLayout() {
  const { currentPage, user } = useApp();
  const isAdmin = (user?.category || user?.role || '').toLowerCase() === 'admin' || (user?.category || user?.role || '').toLowerCase() === 'a';

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'ut-champions': return <UTChampionsPage />;
      case 'division-rivals': return <DivisionRivalsPage />;
      case 'coins': return <CoinsBoostingPage />;
      case 'all-services': return <AllServicesPage />;
      case 'about': return <AboutUsPage />;
      case 'coaching': return <CoachingPage />;
      case 'admin': return <AdminOrderDashboard />;
      case 'player-dashboard':
      case 'player': return <PlayerDashboard />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#00F59B] selection:text-[#0B0D13]">
      <Navbar />

      <main className="flex-1 w-full pb-20 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Modals, Drawers & Widgets */}
      <CartDrawer />
      <AuthModal />
      <UserDashboardModal />
      {isAdmin && <OrderTrackerModal />}
      <ContactMethodModal />
      <FloatingChatWidget />
      <MobileBottomNav />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
