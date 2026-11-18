import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Home, Trophy, Zap, Calculator, ShoppingBag, User } from 'lucide-react';

export default function MobileBottomNav() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    setIsCartOpen,
    user,
    setIsAuthModalOpen,
    setIsDashboardOpen,
    setIsTrackerOpen,
  } = useApp();

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculatorClick = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('quick-calculator');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const el = document.getElementById('quick-calculator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAccountClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const cat = (user.category || user.role || 'Customer').toLowerCase();
    if (cat === 'admin' || cat === 'a') {
      setCurrentPage('admin');
    } else if (cat === 'player' || cat === 'p' || cat === 'booster') {
      setCurrentPage('player-dashboard');
    } else {
      setIsDashboardOpen(true);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => handleNavigation('home'),
      isActive: currentPage === 'home',
    },
    {
      id: 'champs',
      label: 'Champs',
      icon: Trophy,
      action: () => handleNavigation('ut-champions'),
      isActive: currentPage === 'ut-champions',
    },
    {
      id: 'rivals',
      label: 'Rivals',
      icon: Zap,
      action: () => handleNavigation('division-rivals'),
      isActive: currentPage === 'division-rivals',
    },
    {
      id: 'calc',
      label: 'Calculator',
      icon: Calculator,
      action: handleCalculatorClick,
      isActive: false,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      action: () => setIsCartOpen(true),
      isActive: false,
      badge: cart.length,
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Sign In',
      icon: User,
      action: handleAccountClick,
      isActive: ['admin', 'player-dashboard'].includes(currentPage),
      hasUserDot: !!user,
    },
  ];

  return (
    <aside
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080A0F]/95 backdrop-blur-2xl border-t border-[#1C2433] px-2 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-6 items-center justify-around gap-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[48px] select-none ${
                active
                  ? 'text-[#00F59B]'
                  : 'text-gray-400 hover:text-gray-200 active:scale-95'
              }`}
            >
              {/* Active Indicator Glow Bar */}
              {active && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#00F59B] shadow-[0_0_8px_#00F59B]"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}

              {/* Icon Container with Badge / Dot */}
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    active ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />

                {/* Cart Badge with Animation */}
                {item.id === 'cart' && (
                  <AnimatePresence>
                    {item.badge > 0 && (
                      <motion.span
                        key={item.badge}
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.25, 1] }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#00F59B] text-[#080B11] text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,245,155,0.6)] leading-none"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}

                {/* Logged-in user indicator dot */}
                {item.hasUserDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00F59B] ring-2 ring-[#080A0F]" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight font-extrabold leading-none truncate max-w-full ${
                  active ? 'text-[#00F59B]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
