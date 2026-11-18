import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ChevronDown,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Trophy,
  Zap,
  Flame,
  Award,
  Coins,
  GraduationCap,
  Sparkles,
  Target,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    setIsCartOpen,
    user,
    setIsAuthModalOpen,
    setIsDashboardOpen,
    setIsTrackerOpen,
    theme,
    toggleTheme,
    currency,
    changeCurrency,
    currentCurrency,
    CURRENCIES,
  } = useApp();

  const isAdmin = (user?.category || user?.role || '').toLowerCase() === 'admin' || (user?.category || user?.role || '').toLowerCase() === 'a';

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const serviceCategories = [
    {
      id: 'ut-champions',
      title: 'UT Champions Finals',
      desc: 'Rank 1 to 7 guaranteed wins with VPN',
      icon: Trophy,
      badge: 'TOP PICK',
      badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    },
    {
      id: 'division-rivals',
      title: 'Division Rivals Boost',
      desc: 'Division 10 to Elite & 7 Weekly Wins',
      icon: Zap,
      badge: 'POPULAR',
      badgeColor: 'text-[#FFB800] bg-[#FFB800]/10 border-[#FFB800]/30',
    },
    {
      id: 'coaching',
      title: '1-on-1 Pro Coaching',
      desc: 'Tactics, VODs & private screen share sessions',
      icon: GraduationCap,
      badge: 'ELITE PROS',
      badgeColor: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30',
    },
    {
      id: 'all-services',
      title: 'Champions Play-Offs',
      desc: 'Direct qualification to Weekend League',
      icon: Flame,
      badge: 'GUARANTEED',
      badgeColor: 'text-[#00D6FF] bg-[#00D6FF]/10 border-[#00D6FF]/30',
    },
    {
      id: 'all-services',
      title: 'Live Events & Milestones',
      desc: 'Seasonal XP, Evolutions & SBC challenges',
      icon: Target,
      badge: null,
    },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none font-sans">
      
      {/* Top Utility Bar */}
      <div className="w-full bg-[#080A0F] border-b border-[#1C2433] py-2 px-4 sm:px-8 lg:px-12 text-[11px] text-gray-400 font-medium">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          
          {/* Top Bar Left: Fast & Safe Boosting | 24/7 Support | Professional Players | Secure & Confidential */}
          <div className="flex items-center space-x-4 sm:space-x-6 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-gray-300">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Fast & Safe Boosting</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>24/7 Support</span>
            </span>
            <span className="hidden md:flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Professional Players</span>
            </span>
            <span className="hidden lg:flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Secure & Confidential</span>
            </span>
          </div>

          {/* Top Bar Right: Currency Dropdown, Admin Portal, Track */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 text-xs font-bold">
            {/* Interactive Currency Selector Dropdown */}
            <div className="relative" ref={currencyDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-gray-200 hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <span className="text-sm">{currentCurrency.flag}</span>
                <span>{currentCurrency.code}</span>
                <span className="text-[#00F59B] text-[11px] font-mono">({currentCurrency.symbol.trim()})</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180 text-[#00F59B]' : ''}`} />
              </motion.button>

              {/* Currency Dropdown Panel */}
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-52 bg-[#141824] border border-[#262B3D] rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-[#262B3D]">
                      Select Currency
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5 pt-1">
                      {Object.values(CURRENCIES).map((curr) => {
                        const isSelected = currency === curr.code;
                        return (
                          <button
                            key={curr.code}
                            onClick={() => {
                              changeCurrency(curr.code);
                              setIsCurrencyOpen(false);
                            }}
                            className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30'
                                : 'text-gray-300 hover:bg-[#1C2234] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{curr.flag}</span>
                              <div>
                                <div className="font-black leading-none">{curr.code}</div>
                                <div className="text-[10px] text-gray-400 font-normal mt-0.5">{curr.name}</div>
                              </div>
                            </div>
                            <span className="font-mono font-black text-xs text-[#00F59B]">{curr.symbol}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center space-x-1 text-red-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin Portal</span>
                </button>

                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="flex items-center space-x-1 text-red-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin Tracker</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-nav bg-[#0B0D13]/95 border-b border-[#262B3D] px-4 sm:px-8 lg:px-12 py-3.5 shadow-2xl transition-all">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#141824] to-[#1C2234] border border-[#262B3D] group-hover:border-[#00F59B]/50 flex items-center justify-center shadow-lg transition-all">
              <span className="text-lg sm:text-xl font-black italic tracking-tighter text-[#00F59B] group-hover:scale-105 transition-transform">
                BH
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-xl font-black tracking-wider text-white uppercase italic">
                BOOSTING<span className="text-[#00F59B]">HAVEN</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.22em] text-gray-400 uppercase mt-0.5">
                PREMIUM SERVICES
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation Links: Exactly as in Image */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentPage === 'home'
                  ? 'text-[#00F59B]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>HOME</span>
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00F59B]" />
              )}
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center space-x-1 ${
                  isServicesOpen || ['all-services', 'coaching'].includes(currentPage)
                    ? 'text-[#00F59B]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>SERVICES CATALOG</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-[440px] bg-[#141824]/95 backdrop-blur-xl border border-[#262B3D] rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {serviceCategories.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(item.id)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#1C2234] border border-transparent hover:border-[#262B3D] text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center shrink-0 group-hover:border-[#00F59B]/50 transition-colors">
                          <IconComp className="w-4 h-4 text-[#00F59B] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-[#00F59B] transition-colors truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded border ${item.badgeColor || 'text-gray-300 bg-gray-800'}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('ut-champions')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentPage === 'ut-champions'
                  ? 'text-[#00F59B]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>UT CHAMPIONS</span>
              {currentPage === 'ut-champions' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00F59B]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('division-rivals')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentPage === 'division-rivals'
                  ? 'text-[#00F59B]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>DIVISION RIVALS</span>
              {currentPage === 'division-rivals' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00F59B]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentPage === 'about'
                  ? 'text-[#00F59B]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>ABOUT US</span>
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00F59B]" />
              )}
            </button>

            {/* Dynamic Dashboard Link based on User Category */}
            {user && (user.category === 'Admin' || user.category === 'A' || user.role === 'Admin') && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                  currentPage === 'admin'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                <span>🛡️ ADMIN PANEL</span>
              </button>
            )}

            {user && (user.category === 'Player' || user.category === 'P' || user.role === 'Player') && (
              <button
                onClick={() => handleNavClick('player-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                  currentPage === 'player-dashboard'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20'
                    : 'bg-[#00F59B]/10 hover:bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/30'
                }`}
              >
                <span>🎮 PLAYER DASHBOARD</span>
              </button>
            )}
          </div>

          {/* Right Action Icons (Circular Buttons: Search, User, Cart) */}
          <div className="flex items-center space-x-2.5">
            
            {/* Search / Services Trigger */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#1A2232' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => (isAdmin ? setIsTrackerOpen(true) : handleNavClick('all-services'))}
              className="w-9 h-9 rounded-full bg-[#121722] border border-[#1C2433] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isAdmin ? "Admin Order Tracker" : "Search Services"}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* User Account / Auth Trigger */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#1A2232' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
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
              }}
              className="w-9 h-9 rounded-full bg-[#121722] border border-[#1C2433] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative"
              title={user ? `${user.name} (${user.category || user.role || 'Customer'})` : 'Sign In'}
              aria-label="User Account"
            >
              <User className="w-4 h-4" />
              {user && (
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0B0D13] ${
                  (user.category || user.role || '').toLowerCase() === 'admin' || (user.category || user.role || '').toLowerCase() === 'a'
                    ? 'bg-red-500'
                    : (user.category || user.role || '').toLowerCase() === 'player' || (user.category || user.role || '').toLowerCase() === 'p'
                    ? 'bg-[#00F59B]'
                    : 'bg-emerald-400'
                }`} />
              )}
            </motion.button>

            {/* Shopping Cart Button with Circular Badge */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#1A2232' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 rounded-full bg-[#121722] border border-[#1C2433] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
              <AnimatePresence>
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#00F59B] text-[#080B11] font-black text-[10px] rounded-full flex items-center justify-center shadow-md"
                >
                  {cart.length}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-[#121722] border border-[#1C2433] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-[#00F59B]" /> : <Menu className="w-4 h-4" />}
            </motion.button>

          </div>

        </div>

        {/* Mobile Fullscreen Slide Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[76px] sm:top-[84px] bottom-0 z-50 bg-[#0B0D13]/98 backdrop-blur-2xl p-4 pb-28 overflow-y-auto animate-in slide-in-from-top-4 duration-200 border-t border-[#262B3D] flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Primary Pages */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'home' ? 'bg-[#141824] border-[#00F59B] text-white' : 'bg-[#141824]/60 border-[#262B3D] text-gray-300'
                  }`}
                >
                  <span>Home</span>
                  <span className="text-[10px] text-gray-500">🏠</span>
                </button>

                <button
                  onClick={() => handleNavClick('ut-champions')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'ut-champions' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>UT Champions</span>
                  <span className="text-[10px] text-[#00F59B]">🏆</span>
                </button>

                <button
                  onClick={() => handleNavClick('division-rivals')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'division-rivals' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>Division Rivals</span>
                  <span className="text-[10px] text-[#FFB800]">⚡</span>
                </button>

                <button
                  onClick={() => handleNavClick('coaching')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'coaching' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>Pro Coaching</span>
                  <span className="text-[10px] text-[#A855F7]">🎓</span>
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between col-span-2 ${
                    currentPage === 'about' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>About Boosting Haven</span>
                  <span className="text-[10px] text-[#00F59B]">🛡️</span>
                </button>
              </div>

              {/* All Services & Bundles */}
              <button
                onClick={() => handleNavClick('all-services')}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#141824] to-[#1C2234] border border-[#262B3D] text-xs font-black uppercase text-left flex items-center justify-between text-white"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#FFB800]" />
                  <span>All FC Packages & Play-Offs</span>
                </div>
                <span className="text-[9px] text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded">
                  GUARANTEED
                </span>
              </button>

              {/* Theme Switcher in Mobile Drawer */}
              <button
                onClick={toggleTheme}
                className="w-full py-2.5 px-3 rounded-xl bg-[#141824] border border-[#262B3D] text-white font-bold flex items-center justify-between text-xs"
              >
                <span className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-[#FFB800]" />
                      <span>Theme Mode: Dark Obsidian</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-red-600" />
                      <span>Theme Mode: Light Red & White</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#00F59B]">
                  {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                </span>
              </button>

              {/* Admin Portal & Tracking Shortcuts */}
              <div className="bg-[#141824]/70 rounded-2xl p-3 border border-[#262B3D] space-y-2 text-xs">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D13] border border-[#FF3B30]/30 text-white font-bold flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF3B30]" />
                    <span>Admin Order Portal</span>
                  </span>
                  <span className="text-[9px] bg-[#FF3B30]/20 text-[#FF3B30] px-1.5 py-0.5 rounded font-black">
                    MGMT
                  </span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsTrackerOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-red-400" />
                      <span>Admin Order Tracker</span>
                    </span>
                    <span className="text-red-400">→</span>
                  </button>
                )}
              </div>

            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-4 border-t border-[#262B3D] space-y-3 pb-6">
              {/* Mobile Drawer Theme Switcher */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141824] border border-[#262B3D]">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <Sun className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-xs font-bold text-gray-200">
                    Theme: {theme === 'dark' ? 'Obsidian Dark' : 'Red & White Light'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 rounded-lg bg-[#0B0D13] border border-[#262B3D] text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-red-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Currency Selector */}
              <div className="p-3 rounded-xl bg-[#141824] border border-[#262B3D] space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Currency: <strong className="text-white">{currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol.trim()})</strong></span>
                  <span className="text-[#00F59B] font-bold">Live Conversion</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => changeCurrency(curr.code)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 border transition-colors ${
                        currency === curr.code
                          ? 'bg-[#00F59B] text-[#0B0D13] border-[#00F59B]'
                          : 'bg-[#0B0D13] text-gray-300 border-[#262B3D]'
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDashboardOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00F59B] text-[#0B0D13] font-black text-xs uppercase tracking-wider"
                >
                  View My Orders ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00F59B] text-[#0B0D13] font-black text-xs uppercase tracking-wider"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
}
