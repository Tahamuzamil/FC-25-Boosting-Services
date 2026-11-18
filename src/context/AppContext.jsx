import { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { apiClient } from '../services/apiContract';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.38, flag: '🇨🇦', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.54, flag: '🇦🇺', name: 'Australian Dollar' },
  SAR: { code: 'SAR', symbol: 'SAR ', rate: 3.75, flag: '🇸🇦', name: 'Saudi Riyal' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, flag: '🇦🇪', name: 'UAE Dirham' },
  BRL: { code: 'BRL', symbol: 'R$ ', rate: 5.60, flag: '🇧🇷', name: 'Brazilian Real' },
  TRY: { code: 'TRY', symbol: '₺', rate: 34.20, flag: '🇹🇷', name: 'Turkish Lira' },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fc_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch {
      // fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Multi-Currency State
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_currency');
      return saved && CURRENCIES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrency(code);
      try {
        localStorage.setItem('fc_currency', code);
      } catch {}
      showToast(`Currency updated to ${CURRENCIES[code].flag} ${code} (${CURRENCIES[code].name})`, 'info');
    }
  };

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.USD;

  // Format any price (in USD base) to the currently selected currency
  const formatPrice = (amountInUSD, includeCode = false) => {
    if (amountInUSD === undefined || amountInUSD === null || amountInUSD === '') return '';
    let num = 0;
    if (typeof amountInUSD === 'number') {
      num = amountInUSD;
    } else {
      const clean = String(amountInUSD).replace(/[^0-9.]/g, '');
      num = parseFloat(clean) || 0;
    }
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = (num * curr.rate).toFixed(2);
    if (includeCode) {
      return `${curr.symbol}${converted} ${curr.code}`;
    }
    return `${curr.symbol}${converted}`;
  };

  // Convert raw numeric price from USD to selected currency
  const convertPrice = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null || amountInUSD === '') return 0;
    let num = 0;
    if (typeof amountInUSD === 'number') {
      num = amountInUSD;
    } else {
      const clean = String(amountInUSD).replace(/[^0-9.]/g, '');
      num = parseFloat(clean) || 0;
    }
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    return Number((num * curr.rate).toFixed(2));
  };

  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState('home');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerSearchId, setTrackerSearchId] = useState('');

  // Contact Method Modal (WhatsApp / Discord)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeOrderForContact, setActiveOrderForContact] = useState(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fc_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const cartItem = {
      cartItemId: `${item.serviceId || 'srv'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...item,
    };
    setCart((prev) => [...prev, cartItem]);
    showToast(`Added "${item.serviceName}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // User Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_orders');
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const login = async (email, password) => {
    try {
      const loggedInUser = await apiClient.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('fc_user', JSON.stringify(loggedInUser));
      localStorage.setItem('haven_user', JSON.stringify(loggedInUser));
      setIsAuthModalOpen(false);

      const category = (loggedInUser.category || loggedInUser.role || 'Customer').trim().toLowerCase();

      if (category === 'admin' || category === 'a') {
        setCurrentPage('admin');
        showToast(`Welcome Admin ${loggedInUser.name}! Opening Admin Dashboard...`, 'success');
      } else if (category === 'player' || category === 'p' || category === 'booster') {
        setCurrentPage('player-dashboard');
        showToast(`Welcome Pro Player ${loggedInUser.name}! Opening Player Dashboard...`, 'success');
      } else {
        setCurrentPage('home');
        showToast(`Welcome back, ${loggedInUser.name}! Enjoy Boosting Haven.`, 'success');
      }
      return loggedInUser;
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
      throw err;
    }
  };

  const register = async (name, email, password, category = 'Customer', options = {}) => {
    try {
      const newUser = await apiClient.register(name, email, password, category, options);
      setUser(newUser);
      localStorage.setItem('fc_user', JSON.stringify(newUser));
      localStorage.setItem('haven_user', JSON.stringify(newUser));
      setIsAuthModalOpen(false);

      const cat = (category || 'Customer').trim().toLowerCase();
      if (cat === 'admin' || cat === 'a') {
        setCurrentPage('admin');
        showToast(`Account created! Welcome Admin ${newUser.name}.`, 'success');
      } else if (cat === 'player' || cat === 'p' || cat === 'booster') {
        setCurrentPage('player-dashboard');
        showToast(`Roster application received! Welcome Pro Booster ${newUser.name}.`, 'success');
      } else {
        setCurrentPage('home');
        showToast(`Account created successfully! Welcome to Boosting Haven, ${newUser.name}.`, 'success');
      }
      return newUser;
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fc_user');
    localStorage.removeItem('haven_user');
    setCurrentPage('home');
    showToast('Signed out successfully.', 'info');
  };

  const createOrder = async (orderPayload) => {
    try {
      const created = await apiClient.createOrder(orderPayload);
      setOrders((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      showToast('Error syncing order to server.', 'error');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await apiClient.adminUpdateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      showToast(`Order #${orderId} status set to ${newStatus}`, 'success');
      return updated;
    } catch {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      showToast(`Status updated to ${newStatus} (Local State)`, 'info');
    }
  };

  const openTrackerWithId = (orderId = '') => {
    setTrackerSearchId(orderId);
    setIsTrackerOpen(true);
  };

  const openContactModal = (orderConfig) => {
    setActiveOrderForContact(orderConfig);
    setIsContactModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        trackerSearchId,
        setTrackerSearchId,
        openTrackerWithId,
        isContactModalOpen,
        setIsContactModalOpen,
        activeOrderForContact,
        openContactModal,
        theme,
        toggleTheme,
        toast,
        showToast,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        user,
        login,
        register,
        logout,
        orders,
        createOrder,
        updateOrderStatus,
        currency,
        setCurrency: changeCurrency,
        changeCurrency,
        currentCurrency,
        CURRENCIES,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
