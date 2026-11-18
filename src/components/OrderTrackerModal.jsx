import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiContract';
import {
  X,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlayCircle,
  Trophy,
  User,
  Lock,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function OrderTrackerModal() {
  const { isTrackerOpen, setIsTrackerOpen, trackerSearchId, user, setIsAuthModalOpen, openContactModal, formatPrice } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackerSearchId || 'BH-ORD-71020');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if current user has Admin category / role
  const userCat = (user?.category || user?.role || '').toLowerCase().trim();
  const isAdmin = userCat === 'admin' || userCat === 'a';

  useEffect(() => {
    if (isTrackerOpen && isAdmin) {
      const q = trackerSearchId || searchQuery || 'BH-ORD-71020';
      setSearchQuery(q);
      performSearch(q);
    }
  }, [trackerSearchId, isTrackerOpen, isAdmin]);

  const performSearch = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await apiClient.trackOrder(query, user?.category || user?.role || (isAdmin ? 'Admin' : 'Customer'));
      setOrderData(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  if (!isTrackerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsTrackerOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SCENARIO CHECK: IF NOT ADMIN, CUSTOMERS CANNOT TRACK ORDERS */}
        {!isAdmin ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto shadow-xl shadow-red-500/10 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full inline-block">
                RESTRICTED • ADMIN ONLY
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Order Tracking Is Admin Only
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                By platform policy, <strong>customers cannot track orders directly</strong>. Only authorized <strong>Administrator operators</strong> have access to live order progress, match logs, and booster VPN routes.
              </p>
            </div>

            {user ? (
              <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-4 max-w-md mx-auto text-xs text-gray-400 space-y-1">
                <div>You are signed in as: <span className="font-bold text-white">{user.name}</span></div>
                <div>Account Category: <span className="text-amber-400 font-bold uppercase">{user.category || user.role || 'Customer'}</span></div>
                <p className="text-[11px] text-gray-500 pt-1">
                  For real-time updates regarding your active service, please contact our 24/7 Operations Desk directly on WhatsApp or Discord.
                </p>
              </div>
            ) : (
              <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-4 max-w-md mx-auto space-y-3">
                <p className="text-xs text-gray-400">
                  Are you an Administrator? Sign in with your Admin credentials to unlock the Live Order Tracker.
                </p>
                <button
                  onClick={() => {
                    setIsTrackerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  Sign In with Admin Account
                </button>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsTrackerOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setIsTrackerOpen(false);
                  openContactModal({
                    serviceName: 'Order Status Inquiry',
                    details: 'Customer requesting update on active order',
                    price: 0,
                    platform: 'ps5'
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] text-xs font-black uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-[#00F59B]/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact 24/7 Support</span>
              </button>
            </div>
          </div>
        ) : (
          /* 2. IF ADMIN: FULL PRIVILEGED ORDER TRACKER */
          <div className="space-y-5">
            {/* Header */}
            <div className="mb-4 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#00F59B]">
                  ADMINISTRATOR ORDER MONITOR
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400">
                  ADMIN ONLY
                </span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Order & Booster Tracking Desk
              </h3>
              <p className="text-xs text-gray-400">
                Authorized Admin view: Search any Order Reference (e.g. BH-ORD-71020, FC-94821) for full match logs, booster assignment, and VPN route.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Order Reference (e.g. BH-ORD-71020)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#00F59B]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#00F59B]/20"
              >
                Track
              </button>
            </form>

            {/* Content Area */}
            <div className="overflow-y-auto space-y-4 max-h-[50vh] pr-1 text-xs">
              {isLoading ? (
                <div className="py-12 text-center text-gray-400 animate-pulse">
                  Querying SQL Server database records...
                </div>
              ) : !orderData || orderData.restricted ? (
                <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-8 text-center space-y-2">
                  <p className="text-white font-bold">{orderData?.message || `No order found with ID "${searchQuery}"`}</p>
                  <p className="text-gray-400">
                    Verify order number from database or try sample: <span className="text-[#00F59B] font-bold cursor-pointer" onClick={() => performSearch('FC-TEST-71020')}>FC-TEST-71020</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order Status Card */}
                  <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262B3D] gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-black text-white">{orderData.id}</span>
                          <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded border border-[#00F59B]/20 uppercase">
                            {orderData.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">{orderData.serviceName}</span>
                      </div>

                      <div className="text-right sm:text-right">
                        <span className="text-lg font-black text-[#00F59B]">
                          {formatPrice(orderData.price, true)}
                        </span>
                        <span className="text-[10px] text-gray-400 block">{orderData.paymentStatus || 'Payment Verified'}</span>
                      </div>
                    </div>

                    {/* Progress Visual Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">Live Match Progress:</span>
                        <span className="font-black text-[#00F59B]">{orderData.currentScore || 'In Queue'}</span>
                      </div>
                      <div className="w-full bg-[#1C2234] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00F59B] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#00F59B]"
                          style={{ width: `${orderData.progress || 35}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Pro Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#141824] p-3 rounded-xl border border-[#262B3D] space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned Pro Booster</span>
                        <span className="text-xs font-black text-white flex items-center space-x-1.5">
                          <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                          <span>{orderData.boosterName || 'Awaiting Assignment'}</span>
                        </span>
                      </div>

                      <div className="bg-[#141824] p-3 rounded-xl border border-[#262B3D] space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Residential VPN Route</span>
                        <span className="text-xs font-black text-[#00F59B] flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{orderData.boosterVpn || 'Dedicated Residential NordVPN'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Match Logs History from Pro Booster */}
                    {orderData.matchLogs && orderData.matchLogs.length > 0 && (
                      <div className="pt-2 border-t border-[#262B3D]/70 space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Pro Booster Match Results</span>
                          <span className="text-[#00F59B]">{orderData.matchLogs.length} Matches Logged</span>
                        </span>
                        <div className="bg-[#141824] rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
                          {orderData.matchLogs.map((m, idx) => (
                            <div key={idx} className="border-b border-[#262B3D] pb-1.5 last:border-b-0 last:pb-0 text-[11px]">
                              <div className="flex justify-between items-center text-white font-bold">
                                <span className="text-[#00F59B]">Match #{m.matchNumber || idx + 1}: {m.scoreLabel}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{(m.loggedAt || '').substring(11, 16)}</span>
                              </div>
                              {m.comment && <div className="text-gray-400 text-[10px] mt-0.5">{m.comment}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#262B3D] flex items-center justify-between text-xs text-gray-400">
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Operations Privileged Mode</span>
              </span>
              <button
                onClick={() => setIsTrackerOpen(false)}
                className="text-xs text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
