import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiContract';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  RefreshCw,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  Award,
  Zap,
  Lock,
  Copy,
  ChevronRight,
  Check,
  Crosshair,
  Gamepad2,
} from 'lucide-react';

export default function AdminOrderDashboard() {
  const { orders: localOrders, showToast } = useApp();

  // Active Main Tab: 'orders' | 'booster-portal' | 'analytics'
  const [mainTab, setMainTab] = useState('orders');

  // Orders View State
  const [serverOrders, setServerOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterContact, setFilterContact] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Boosters State
  const [boosters, setBoosters] = useState([]);
  const [selectedBoosterId, setSelectedBoosterId] = useState('');

  // Admin Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Pro Player / Booster Portal State
  const [activeBoosterUser, setActiveBoosterUser] = useState('usr-booster-kaiser');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [boosterEarnings, setBoosterEarnings] = useState(null);
  const [matchScoreInput, setMatchScoreInput] = useState('Champions: 5 Wins - 0 Losses');
  const [matchesWonInput, setMatchesWonInput] = useState(5);
  const [matchesLostInput, setMatchesLostInput] = useState(0);
  const [progressInput, setProgressInput] = useState(35);
  const [boosterCommentInput, setBoosterCommentInput] = useState('Solid matches, 4-3-2-1 formation. Opponents rage quit.');
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const statuses = ['All', 'Pending', 'InProgress', 'UnderReview', 'Completed', 'Cancelled'];
  const contactMethods = ['All', 'WhatsApp', 'Discord', 'Card', 'Stripe', 'PayPal'];

  // Load Initial Data
  const loadInitialData = async () => {
    setIsLoadingOrders(true);
    try {
      const [liveOrders, liveAnalytics, liveBoosters] = await Promise.all([
        apiClient.fetchAdminOrders(),
        apiClient.fetchAdminAnalytics(),
        apiClient.fetchBoosters(),
      ]);

      if (liveOrders && liveOrders.length > 0) {
        setServerOrders(liveOrders);
        if (!selectedOrder) setSelectedOrder(liveOrders[0]);
      } else if (localOrders && localOrders.length > 0) {
        setServerOrders(localOrders);
        if (!selectedOrder) setSelectedOrder(localOrders[0]);
      }

      if (liveAnalytics) setAnalytics(liveAnalytics);
      if (liveBoosters) {
        setBoosters(liveBoosters);
        if (liveBoosters.length > 0 && !selectedBoosterId) {
          setSelectedBoosterId(liveBoosters[0].userId);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch Order Audit Trail when selected order changes
  useEffect(() => {
    if (selectedOrder?.id || selectedOrder?.orderNumber) {
      const orderId = selectedOrder.id || selectedOrder.orderNumber;
      setIsLoadingAudit(true);
      apiClient.fetchOrderAudit(orderId)
        .then((logs) => {
          if (logs && logs.length > 0) setAuditLogs(logs);
          else setAuditLogs([]);
        })
        .finally(() => setIsLoadingAudit(false));
    }
  }, [selectedOrder]);

  // Load Booster Portal Data
  const loadBoosterData = async () => {
    try {
      const [avail, earn] = await Promise.all([
        apiClient.fetchAvailableOrders(),
        apiClient.fetchBoosterEarnings(activeBoosterUser),
      ]);
      if (avail) setAvailableOrders(avail);
      if (earn) setBoosterEarnings(earn);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (mainTab === 'booster-portal') {
      loadBoosterData();
    }
  }, [mainTab, activeBoosterUser]);

  // Filtered Orders
  const displayOrders = serverOrders.length > 0 ? serverOrders : localOrders;
  const filteredOrders = displayOrders.filter((o) => {
    const statusVal = o.status || 'Pending';
    const contactVal = o.contactMethod || o.paymentMethod || '';
    const idVal = o.orderNumber || o.id || '';
    const nameVal = o.customerName || '';
    const serviceVal = o.serviceName || '';

    const matchesStatus = filterStatus === 'All' || statusVal.toLowerCase() === filterStatus.toLowerCase();
    const matchesContact = filterContact === 'All' || contactVal.toLowerCase().includes(filterContact.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      idVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nameVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceVal.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesContact && matchesSearch;
  });

  // Admin Actions
  const handleAssignBooster = async () => {
    if (!selectedOrder || !selectedBoosterId) return;
    setIsSubmittingAction(true);
    const orderId = selectedOrder.id || selectedOrder.orderNumber;
    try {
      const res = await apiClient.adminAssignBooster(orderId, selectedBoosterId, statusNote);
      showToast(`Booster assigned to order #${selectedOrder.orderNumber || selectedOrder.id}!`, 'success');
      await loadInitialData();
    } catch {
      showToast('Error assigning booster.', 'error');
    } finally {
      setIsSubmittingAction(false);
      setStatusNote('');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setIsSubmittingAction(true);
    const orderId = selectedOrder.id || selectedOrder.orderNumber;
    try {
      await apiClient.adminUpdateStatus(orderId, newStatus, statusNote || `Status changed to ${newStatus} by Admin.`);
      showToast(`Order status updated to ${newStatus}!`, 'success');
      await loadInitialData();
    } catch {
      showToast('Error updating status.', 'error');
    } finally {
      setIsSubmittingAction(false);
      setStatusNote('');
    }
  };

  const handleApproveOrder = async () => {
    if (!selectedOrder) return;
    setIsSubmittingAction(true);
    const orderId = selectedOrder.id || selectedOrder.orderNumber;
    try {
      await apiClient.adminApproveOrder(orderId, statusNote || 'Approved by Admin. All targets ban-free verified.');
      showToast(`Order #${selectedOrder.orderNumber || selectedOrder.id} verified & payout approved!`, 'success');
      await loadInitialData();
    } catch {
      showToast('Error approving order.', 'error');
    } finally {
      setIsSubmittingAction(false);
      setStatusNote('');
    }
  };

  // Booster Actions
  const handleBoosterClaim = async (orderId) => {
    setIsSubmittingAction(true);
    try {
      const res = await apiClient.boosterClaimOrder(orderId, activeBoosterUser, 'United Kingdom (Residential VPN)');
      showToast(res.message || 'Order claimed successfully!', 'success');
      await loadBoosterData();
      await loadInitialData();
    } catch {
      showToast('Error claiming order.', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleBoosterUpdateProgress = async (orderId) => {
    setIsSubmittingAction(true);
    try {
      await apiClient.boosterUpdateProgress({
        orderId,
        playerId: activeBoosterUser,
        matchScoreLabel: matchScoreInput,
        progressPercentage: Number(progressInput),
        matchesWon: Number(matchesWonInput),
        matchesLost: Number(matchesLostInput),
        boosterComment: boosterCommentInput,
        vpnCity: 'London',
      });
      showToast('Match progress and score logged in SQL Server!', 'success');
      await loadBoosterData();
      await loadInitialData();
    } catch {
      showToast('Error updating progress.', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleBoosterComplete = async (orderId) => {
    if (!proofUrlInput) {
      showToast('Please enter proof image URL or screenshot link.', 'error');
      return;
    }
    setIsSubmittingAction(true);
    try {
      await apiClient.boosterCompleteOrder({
        orderId,
        playerId: activeBoosterUser,
        proofFileName: 'booster_match_verification.png',
        proofFileUrl: proofUrlInput,
        proofNotes: 'All match targets secured ban-free on residential VPN.',
      });
      showToast('Order completed & proof submitted for Admin verification!', 'success');
      setProofUrlInput('');
      await loadBoosterData();
      await loadInitialData();
    } catch {
      showToast('Error completing order.', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const copyCredentials = (creds) => {
    if (!creds) return;
    navigator.clipboard.writeText(creds);
    setCopiedKey(true);
    showToast('Encrypted client credentials copied to secure clipboard.', 'info');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="w-full py-8 bg-[#0B0D13] select-none font-sans text-white min-h-screen">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#262B3D] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#00F59B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ASP.NET CORE & SQL SERVER ENTERPRISE BACKEND
              </span>
              <span className="text-[10px] bg-[#FF3B30] text-white px-2 py-0.5 rounded font-black uppercase">
                ADMIN & BOOSTER SUITE
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
              Order Lifecycle & Fulfillment Management
            </h1>
            <p className="text-xs text-gray-400">
              Live SQL Server tracking: Customer Orders, Pro Booster Match Logging, Admin Audit Trail & Payout Ledger.
            </p>
          </div>

          {/* Tab Selector & Refresh */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#141824] p-1 rounded-xl border border-[#262B3D] flex space-x-1">
              <button
                onClick={() => setMainTab('orders')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                  mainTab === 'orders'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin Orders ({displayOrders.length})
              </button>
              <button
                onClick={() => setMainTab('booster-portal')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                  mainTab === 'booster-portal'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Booster Portal
              </button>
              <button
                onClick={() => setMainTab('analytics')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                  mainTab === 'analytics'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Analytics
              </button>
            </div>

            <button
              onClick={loadInitialData}
              disabled={isLoadingOrders}
              className="p-2.5 bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] rounded-xl text-gray-300 hover:text-white transition-all"
              title="Refresh SQL Server Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-[#00F59B]' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. TAB: ADMIN ORDERS FULFILLMENT */}
        {mainTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Orders List & Filters */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Order ID, GamerTag, Service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#00F59B]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#0B0D13] border border-[#262B3D] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00F59B]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>Status: {s}</option>
                    ))}
                  </select>

                  <select
                    value={filterContact}
                    onChange={(e) => setFilterContact(e.target.value)}
                    className="bg-[#0B0D13] border border-[#262B3D] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00F59B]"
                  >
                    {contactMethods.map((c) => (
                      <option key={c} value={c}>Channel: {c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-[#141824] border border-[#262B3D] rounded-2xl text-gray-400 text-xs">
                    No orders match your filter criteria.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const id = ord.orderNumber || ord.id;
                    const isSelected = (selectedOrder?.orderNumber || selectedOrder?.id) === id;
                    const status = ord.status || 'Pending';

                    let badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
                    if (status === 'InProgress') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                    if (status === 'UnderReview') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                    if (status === 'Completed') badgeColor = 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30';
                    if (status === 'Cancelled') badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';

                    return (
                      <div
                        key={id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C2234] border-[#00F59B] shadow-lg shadow-[#00F59B]/10'
                            : 'bg-[#141824] border-[#262B3D] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-black text-white">#{id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                              {status}
                            </span>
                          </div>
                          <span className="text-xs font-black text-[#00F59B]">
                            ${Number(ord.price || 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-bold text-gray-200 truncate">
                          {ord.serviceName}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                          <span>{ord.customerName || ord.gamerTag || 'Customer'}</span>
                          <span className="uppercase font-mono">{ord.platform || 'PS5'} • {ord.contactMethod || 'Direct'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right 7 Cols: Selected Order Detail, Actions, Audit Trail */}
            <div className="lg:col-span-7 space-y-5">
              {selectedOrder ? (
                <>
                  {/* Order Overview Card */}
                  <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#262B3D] gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-black text-white uppercase font-mono">
                            #{selectedOrder.orderNumber || selectedOrder.id}
                          </h2>
                          <span className="text-xs bg-[#00F59B]/10 text-[#00F59B] px-2.5 py-0.5 rounded-full font-bold">
                            {selectedOrder.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{selectedOrder.serviceName}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-[#00F59B]">
                          ${Number(selectedOrder.price || 0).toFixed(2)} USD
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase font-mono">
                          {selectedOrder.platform} • {selectedOrder.paymentStatus || 'Paid'}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Credentials Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#0B0D13] p-3.5 rounded-xl border border-[#262B3D] space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Customer Info</span>
                        <div className="font-bold text-white">{selectedOrder.customerName || 'Valued Customer'}</div>
                        <div className="text-gray-400 font-mono text-[11px]">{selectedOrder.customerEmail || 'N/A'}</div>
                        <div className="text-[#00F59B] font-mono text-[11px]">GamerTag: {selectedOrder.gamerTag || 'Pending'}</div>
                      </div>

                      <div className="bg-[#0B0D13] p-3.5 rounded-xl border border-[#262B3D] space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center justify-between">
                          <span>EA Credentials (Masked)</span>
                          <button
                            onClick={() => copyCredentials(selectedOrder.customerCredentials || selectedOrder.credentials || 'Encrypted-EA-OAuth-Token')}
                            className="text-[#00F59B] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Secure
                          </button>
                        </span>
                        <div className="font-mono text-gray-300 text-[11px] truncate">
                          {selectedOrder.customerCredentials || selectedOrder.credentials || 'Protected by High-Grade SSL'}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Ban-Free Residential Subnet Enforced
                        </div>
                      </div>
                    </div>

                    {/* Booster Assignment & Score Live State */}
                    <div className="bg-[#0B0D13] p-4 rounded-xl border border-[#262B3D] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                          <Gamepad2 className="w-4 h-4 text-[#00F59B]" /> Booster Assignment & Match Progress
                        </span>
                        <span className="text-xs font-mono font-bold text-[#00F59B]">
                          {selectedOrder.progressPercentage || selectedOrder.progress || 0}% Complete
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#1C2234] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#00F59B] to-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${selectedOrder.progressPercentage || selectedOrder.progress || 0}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase">Assigned Booster:</span>
                          <div className="font-bold text-white">
                            {selectedOrder.assignedPlayerName || selectedOrder.boosterName || 'Unassigned'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase">VPN Location:</span>
                          <div className="font-bold text-gray-300">
                            {selectedOrder.vpnLocation || selectedOrder.boosterVpn || 'United Kingdom (Residential)'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#141824] p-2.5 rounded-lg border border-[#262B3D] text-xs">
                        <span className="text-[10px] text-gray-400 uppercase block">Current Live Score:</span>
                        <span className="font-mono text-white font-bold">{selectedOrder.currentScore || 'Awaiting Booster Assignment'}</span>
                      </div>
                    </div>

                    {/* Operational Action Controls */}
                    <div className="bg-[#1C2234]/60 p-4 rounded-xl border border-[#262B3D] space-y-3">
                      <span className="text-xs font-black uppercase text-gray-300 tracking-wider">
                        Admin Command Center
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Assign Booster Dropdown */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Assign Pro Booster</label>
                          <div className="flex space-x-1.5">
                            <select
                              value={selectedBoosterId}
                              onChange={(e) => setSelectedBoosterId(e.target.value)}
                              className="flex-1 bg-[#0B0D13] border border-[#262B3D] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                            >
                              {boosters.map((b) => (
                                <option key={b.userId} value={b.userId}>
                                  {b.nickname || b.name} ({b.winRate}% WR)
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={handleAssignBooster}
                              disabled={isSubmittingAction}
                              className="px-3 py-1.5 bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] rounded-lg text-xs font-black uppercase transition-all"
                            >
                              Assign
                            </button>
                          </div>
                        </div>

                        {/* Status Transition Buttons */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Quick Transition</label>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus('InProgress')}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-[11px] font-bold border border-blue-500/40"
                            >
                              In Progress
                            </button>
                            <button
                              onClick={handleApproveOrder}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1.5 bg-[#00F59B]/20 hover:bg-[#00F59B]/30 text-[#00F59B] rounded-lg text-[11px] font-bold border border-[#00F59B]/40"
                            >
                              Approve & Payout
                            </button>
                            <button
                              onClick={() => handleUpdateStatus('Cancelled')}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-[11px] font-bold border border-red-500/40"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Admin Note Input */}
                      <div>
                        <input
                          type="text"
                          placeholder="Add confidential internal admin remark / reason..."
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                        />
                      </div>
                    </div>

                    {/* Immutable Audit Trail Section */}
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#00F59B]" /> SQL Server Immutable Audit Trail
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {auditLogs.length} Events Logged
                        </span>
                      </div>

                      <div className="bg-[#0B0D13] border border-[#262B3D] rounded-xl p-3.5 max-h-48 overflow-y-auto space-y-2">
                        {isLoadingAudit ? (
                          <div className="py-6 text-center text-gray-500 text-xs animate-pulse">
                            Loading audit events from SQL Server...
                          </div>
                        ) : auditLogs.length === 0 ? (
                          <div className="py-4 text-center text-gray-500 text-xs">
                            No audit log events recorded yet.
                          </div>
                        ) : (
                          auditLogs.map((log) => (
                            <div key={log.auditId || log.id} className="text-xs border-b border-[#1C2234] pb-2 last:border-b-0 last:pb-0">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                                <span className="font-bold text-[#00F59B]">
                                  [{log.actorRole || log.actor}] {log.actionType || log.action}
                                </span>
                                <span>{(log.timestamp || '').substring(0, 19).replace('T', ' ')}</span>
                              </div>
                              <p className="text-gray-300 mt-0.5 text-[11px]">{log.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-12 text-center text-gray-400 text-xs">
                  Select an order from the left column to view its details, booster assignment, and audit history.
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. TAB: PRO BOOSTER / PLAYER PORTAL */}
        {mainTab === 'booster-portal' && (
          <div className="space-y-6">
            
            {/* Booster Profile Bar & Earnings Ledger */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#262B3D] gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F59B] to-emerald-600 flex items-center justify-center text-[#0B0D13] font-black text-lg">
                    PRO
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-black text-white uppercase">
                        {boosterEarnings?.proNickname || 'Alex "Kaiser" (Top 64 Global)'}
                      </h2>
                      <span className="text-xs bg-[#00F59B]/10 text-[#00F59B] px-2 py-0.5 rounded font-bold">
                        {boosterEarnings?.tier || 'Rank 1 Specialist'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Verified Win Rate: {boosterEarnings?.winRate || '99.2'}% • Commission Rate: {boosterEarnings?.commissionRate || 75}%
                    </p>
                  </div>
                </div>

                {/* Earnings Summary Cards */}
                <div className="flex items-center space-x-4">
                  <div className="bg-[#0B0D13] px-4 py-2.5 rounded-xl border border-[#262B3D] text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Earned</span>
                    <span className="text-lg font-black text-[#00F59B]">
                      ${Number(boosterEarnings?.totalEarned || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-[#0B0D13] px-4 py-2.5 rounded-xl border border-[#262B3D] text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Pending Review</span>
                    <span className="text-lg font-black text-amber-400">
                      ${Number(boosterEarnings?.pendingPayout || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pro Player Switcher (for demonstration of multiple boosters) */}
              <div className="mt-4 flex items-center space-x-2 text-xs">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Switch Active Pro:</span>
                {boosters.map((b) => (
                  <button
                    key={b.userId}
                    onClick={() => setActiveBoosterUser(b.userId)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeBoosterUser === b.userId
                        ? 'bg-[#00F59B] text-[#0B0D13]'
                        : 'bg-[#0B0D13] text-gray-300 hover:text-white border border-[#262B3D]'
                    }`}
                  >
                    {b.nickname || b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Orders Pool to Claim */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#00F59B]" /> Open Orders Available to Claim
                  </h3>
                  <p className="text-xs text-gray-400">
                    Orders waiting for booster pickup. Click "Claim Order" to lock and begin ban-free fulfillment.
                  </p>
                </div>
                <button
                  onClick={loadBoosterData}
                  className="px-3 py-1.5 bg-[#141824] border border-[#262B3D] rounded-lg text-xs text-gray-300 hover:text-white"
                >
                  Refresh Pool
                </button>
              </div>

              {availableOrders.length === 0 ? (
                <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-8 text-center text-gray-400 text-xs">
                  No open orders currently waiting in the pool. When a customer checks out, new orders appear here instantly!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableOrders.map((ord) => (
                    <div
                      key={ord.orderId || ord.orderNumber}
                      className="bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-2xl p-5 space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-white">#{ord.orderNumber}</span>
                        <span className="text-xs font-black text-[#00F59B]">${Number(ord.price || 0).toFixed(2)}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-100">{ord.serviceName}</h4>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          Platform: <span className="text-white uppercase font-bold">{ord.platform}</span> • Channel: {ord.contactMethod}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#262B3D] flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono">
                          {ord.createdAt?.substring(0, 10)}
                        </span>
                        <button
                          onClick={() => handleBoosterClaim(ord.orderId)}
                          disabled={isSubmittingAction}
                          className="px-4 py-2 bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                        >
                          Claim Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Match Progress Logger & Proof Upload for InProgress Orders */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-[#00F59B]" /> Pro Match Progress & Proof Submission
                </h3>
                <p className="text-xs text-gray-400">
                  Update customer live tracker with match-by-match score results, progress %, and final proof screenshot.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score & Progress Logger */}
                <div className="bg-[#0B0D13] p-5 rounded-xl border border-[#262B3D] space-y-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider block">
                    1. Log Live Match Progress
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                        Select In-Progress Order
                      </label>
                      <select
                        onChange={(e) => {
                          const found = serverOrders.find((o) => (o.orderNumber || o.id) === e.target.value);
                          if (found) setSelectedOrder(found);
                        }}
                        className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                      >
                        {serverOrders
                          .filter((o) => o.status === 'InProgress' || o.status === 'UnderReview')
                          .map((o) => (
                            <option key={o.orderNumber || o.id} value={o.orderNumber || o.id}>
                              #{o.orderNumber || o.id} - {o.serviceName} ({o.status})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Wins Logged</label>
                        <input
                          type="number"
                          value={matchesWonInput}
                          onChange={(e) => setMatchesWonInput(e.target.value)}
                          className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Losses</label>
                        <input
                          type="number"
                          value={matchesLostInput}
                          onChange={(e) => setMatchesLostInput(e.target.value)}
                          className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                        Live Score Label (Visible on Customer Tracker)
                      </label>
                      <input
                        type="text"
                        value={matchScoreInput}
                        onChange={(e) => setMatchScoreInput(e.target.value)}
                        className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold mb-1">
                        <span>Progress Percentage</span>
                        <span className="text-[#00F59B]">{progressInput}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progressInput}
                        onChange={(e) => setProgressInput(e.target.value)}
                        className="w-full accent-[#00F59B]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Booster Notes</label>
                      <input
                        type="text"
                        value={boosterCommentInput}
                        onChange={(e) => setBoosterCommentInput(e.target.value)}
                        className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                      />
                    </div>

                    <button
                      onClick={() => handleBoosterUpdateProgress(selectedOrder?.id || selectedOrder?.orderNumber)}
                      disabled={isSubmittingAction || !selectedOrder}
                      className="w-full py-2.5 bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      Update Live Score & Tracker
                    </button>
                  </div>
                </div>

                {/* Proof Submission */}
                <div className="bg-[#0B0D13] p-5 rounded-xl border border-[#262B3D] space-y-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider block">
                    2. Complete Service & Attach Proof
                  </span>

                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">
                      Upload or link final match result screenshot. Once submitted, order moves to <span className="text-purple-400 font-bold">UnderReview</span> and queues your payout.
                    </p>

                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                        Proof Screenshot / VOD Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://fcboosting.com/proofs/final_15_wins.png"
                        value={proofUrlInput}
                        onChange={(e) => setProofUrlInput(e.target.value)}
                        className="w-full bg-[#141824] border border-[#262B3D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                      />
                    </div>

                    <div className="bg-[#141824] p-3 rounded-lg border border-[#262B3D] text-[11px] text-gray-400 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4" /> Ban-Free Proof Verification
                      </div>
                      <div>• Never include full EA credentials or customer email in screenshots.</div>
                      <div>• Residential VPN IP must match client regional country.</div>
                    </div>

                    <button
                      onClick={() => handleBoosterComplete(selectedOrder?.id || selectedOrder?.orderNumber)}
                      disabled={isSubmittingAction || !selectedOrder}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      Submit For Admin Payout Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. TAB: SQL SERVER ANALYTICS & FINANCIALS */}
        {mainTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>Gross Platform Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#00F59B]" />
                </span>
                <div className="text-2xl font-black text-white">
                  ${Number(analytics?.summary?.totalRevenue || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-[#00F59B] font-bold">Total Orders: {analytics?.summary?.totalOrders || 0}</div>
              </div>

              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>Completed Revenue</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </span>
                <div className="text-2xl font-black text-white">
                  ${Number(analytics?.summary?.completedRevenue || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-gray-400 font-mono">Fulfillment Complete</div>
              </div>

              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>Booster Payouts Approved</span>
                  <Award className="w-4 h-4 text-purple-400" />
                </span>
                <div className="text-2xl font-black text-purple-300">
                  ${Number(analytics?.summary?.totalBoosterPayouts || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-gray-400 font-mono">Pro Player Ledger</div>
              </div>

              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>Net Platform Profit</span>
                  <TrendingUp className="w-4 h-4 text-[#00F59B]" />
                </span>
                <div className="text-2xl font-black text-[#00F59B]">
                  ${Number(analytics?.summary?.netPlatformProfit || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">Retained Revenue</div>
              </div>
            </div>

            {/* Platform & Top Services Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Platform Distribution */}
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Revenue by Platform
                </h3>
                <div className="space-y-3">
                  {(analytics?.platforms || []).map((p) => (
                    <div key={p.platform} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white uppercase">{p.platform}</span>
                        <span className="text-[#00F59B] font-mono font-bold">${Number(p.total).toFixed(2)} ({p.count} orders)</span>
                      </div>
                      <div className="w-full bg-[#0B0D13] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00F59B] h-full"
                          style={{ width: `${Math.min(100, (p.total / (analytics?.summary?.totalRevenue || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Services */}
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Top Revenue Services
                </h3>
                <div className="space-y-2.5">
                  {(analytics?.topServices || []).map((s, idx) => (
                    <div key={s.serviceName} className="flex items-center justify-between p-3 bg-[#0B0D13] rounded-xl border border-[#262B3D] text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-[#1C2234] text-gray-400 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white">{s.serviceName}</span>
                      </div>
                      <span className="font-mono text-[#00F59B] font-bold">${Number(s.revenue).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Active Pro Boosters Directory */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00F59B]" /> Verified Pro Boosters Network
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(analytics?.boosters || boosters).map((b) => (
                  <div key={b.userId} className="p-4 bg-[#0B0D13] rounded-xl border border-[#262B3D] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{b.nickname || b.name}</span>
                      <span className="text-[10px] bg-[#00F59B]/10 text-[#00F59B] px-2 py-0.5 rounded font-bold">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">{b.tier}</div>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#1C2234]">
                      <span className="text-gray-400">Win Rate: <span className="text-[#00F59B] font-bold">{b.winRate}%</span></span>
                      <span className="text-gray-400">Completed: <span className="text-white font-bold">{b.totalOrders}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
