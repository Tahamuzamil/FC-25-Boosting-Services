import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiContract';
import {
  Gamepad2,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Eye,
  Upload,
  RefreshCw,
  LogOut,
  Globe,
  Award,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function PlayerDashboard() {
  const { user, logout, setCurrentPage, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'my-orders' | 'earnings'
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Match Update Form
  const [matchScoreLabel, setMatchScoreLabel] = useState('');
  const [progressPercent, setProgressPercent] = useState(50);
  const [matchesWon, setMatchesWon] = useState(5);
  const [matchesLost, setMatchesLost] = useState(0);
  const [boosterComment, setBoosterComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Proof Upload Form
  const [proofFileName, setProofFileName] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  // Pro Player ID (fallback to user id or known booster)
  const playerId = user?.id || 'usr-booster-flash';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [avail, mine, earn] = await Promise.all([
        apiClient.fetchAvailableOrders(),
        apiClient.fetchMyOrders(playerId),
        apiClient.fetchBoosterEarnings(playerId),
      ]);
      setAvailableOrders(avail || []);
      setMyOrders(mine || []);
      setEarnings(earn || null);
    } catch {
      showToast('Could not load pro booster live data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [playerId]);

  const handleClaim = async (orderId) => {
    try {
      const vpnLocation = 'Frankfurt, Germany (Dedicated Residential NordVPN)';
      const res = await apiClient.boosterClaimOrder(orderId, playerId, vpnLocation);
      showToast(res.message || 'Order claimed successfully!', 'success');
      loadData();
      setActiveTab('my-orders');
    } catch {
      showToast('Error claiming order', 'error');
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const payload = {
        orderId: selectedOrder.orderId,
        playerId: playerId,
        matchScoreLabel: matchScoreLabel || `${matchesWon} Wins - ${matchesLost} Losses In-Progress`,
        progressPercentage: Number(progressPercent),
        matchesWon: Number(matchesWon),
        matchesLost: Number(matchesLost),
        boosterComment: boosterComment || 'Played with high tactical efficiency. Account protected on residential VPN.',
        vpnCity: 'Frankfurt'
      };
      const res = await apiClient.boosterUpdateProgress(payload);
      showToast(res.message || 'Match progress updated and saved to database!', 'success');
      loadData();
      setSelectedOrder(null);
    } catch {
      showToast('Error updating match progress', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setIsSubmittingProof(true);
    try {
      const payload = {
        orderId: orderId,
        playerId: playerId,
        proofFileName: proofFileName || 'champions_verification_proof.png',
        proofFileUrl: proofFileUrl || `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80`,
        proofNotes: proofNotes || 'Flawless run complete. Account disconnected safely. Rewards sealed in store.'
      };
      const res = await apiClient.boosterCompleteOrder(payload);
      showToast(res.message || 'Order completed! Payout sent to admin approval.', 'success');
      loadData();
      setSelectedOrder(null);
      setProofFileName('');
      setProofFileUrl('');
      setProofNotes('');
    } catch {
      showToast('Error submitting order completion', 'error');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#0B0D13] py-8 px-4 sm:px-8 lg:px-12 select-none font-sans">
      <div className="max-w-[1720px] mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00F59B] shadow-lg shadow-[#00F59B]/20 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F59B] to-emerald-600 text-[#0B0D13] flex items-center justify-center font-black text-xl shadow-lg shadow-[#00F59B]/20 shrink-0">
                <Gamepad2 className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                  {user?.name || 'Pro Booster'}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/30 px-2.5 py-0.5 rounded-full">
                  CATEGORY: PLAYER / PRO BOOSTER
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                <span>{earnings?.tier || 'Rank 1 Elite Specialist'}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Frankfurt, Germany (Residential NordVPN)</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00F59B]' : ''}`} />
              <span>Refresh Queue</span>
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2.5 rounded-xl bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Browse Website</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 border border-[#FF3B30]/30 text-xs font-bold text-[#FF3B30] flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Pro Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-1">
              <span>Active Assigned</span>
              <Zap className="w-4 h-4 text-[#00F59B]" />
            </div>
            <div className="text-2xl font-black text-white">{myOrders.length}</div>
            <p className="text-[11px] text-gray-500 mt-0.5">Orders in-progress</p>
          </div>

          <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-1">
              <span>Queue Available</span>
              <Flame className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="text-2xl font-black text-[#FFB800]">{availableOrders.length}</div>
            <p className="text-[11px] text-gray-500 mt-0.5">Ready to claim now</p>
          </div>

          <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-1">
              <span>Win Rate</span>
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">99.2%</div>
            <p className="text-[11px] text-emerald-400 mt-0.5">Verified Elite record</p>
          </div>

          <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-1">
              <span>Total Earned</span>
              <DollarSign className="w-4 h-4 text-[#00F59B]" />
            </div>
            <div className="text-2xl font-black text-[#00F59B]">
              ${earnings ? Number(earnings.totalEarned).toFixed(2) : '1,485.50'}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Commission 75% tier</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#262B3D] pb-3">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'available'
                ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20'
                : 'bg-[#141824] text-gray-400 hover:text-white border border-[#262B3D]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Available Orders ({availableOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'my-orders'
                ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20'
                : 'bg-[#141824] text-gray-400 hover:text-white border border-[#262B3D]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>My Active Boosts ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'earnings'
                ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20'
                : 'bg-[#141824] text-gray-400 hover:text-white border border-[#262B3D]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Payouts & Ledger</span>
          </button>
        </div>

        {/* TAB 1: AVAILABLE ORDERS QUEUE */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Orders placed by customers awaiting pro booster claim:</span>
              <span className="text-[#00F59B] font-bold">1-Click Claim to assign order directly to yourself</span>
            </div>

            {availableOrders.length === 0 ? (
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-12 text-center text-gray-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Queue is Clear</h4>
                <p className="text-xs">No pending orders in the queue right now. New customer orders appear here automatically!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-2xl p-5 space-y-4 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{ord.platform}</span>
                        <h4 className="text-sm font-black text-white">{ord.serviceName}</h4>
                        <span className="text-xs text-[#00F59B] font-mono font-bold">{ord.orderNumber}</span>
                      </div>
                      <span className="text-base font-black text-[#00F59B]">${ord.price}</span>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1 bg-[#0B0D13] p-3 rounded-xl border border-[#262B3D]">
                      <div className="flex justify-between">
                        <span>GamerTag:</span>
                        <span className="font-bold text-white">{ord.gamerTag || 'Confidential'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span>{ord.contactMethod || 'WhatsApp'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Placed:</span>
                        <span>{ord.createdAt?.substring(0, 10) || 'Today'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(ord.orderId)}
                      className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-[#00F59B]/20"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>CLAIM ORDER AS PRO</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVE BOOSTS */}
        {activeTab === 'my-orders' && (
          <div className="space-y-6">
            {myOrders.length === 0 ? (
              <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-12 text-center text-gray-400">
                <Gamepad2 className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Active Orders Claimed</h4>
                <p className="text-xs mb-4">Switch to the "Available Orders" tab above to claim an open booster order.</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-6 py-2.5 rounded-xl bg-[#00F59B] text-[#0B0D13] font-black text-xs uppercase cursor-pointer"
                >
                  View Available Orders
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Orders List */}
                <div className="lg:col-span-6 space-y-4">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      onClick={() => setSelectedOrder(ord)}
                      className={`bg-[#141824] border rounded-2xl p-5 cursor-pointer transition-all ${
                        selectedOrder?.orderId === ord.orderId
                          ? 'border-[#00F59B] shadow-xl shadow-[#00F59B]/10'
                          : 'border-[#262B3D] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#00F59B]">{ord.orderNumber}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#00F59B]/20 text-[#00F59B]'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white">{ord.serviceName}</h4>
                      <p className="text-xs text-gray-400 mt-1">{ord.currentScore || 'Match in progress...'}</p>

                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-white">{ord.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#0B0D13] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00F59B] to-emerald-400 rounded-full"
                            style={{ width: `${ord.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Progress & Completion Panel */}
                <div className="lg:col-span-6">
                  {selectedOrder ? (
                    <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6">
                      <div className="border-b border-[#262B3D] pb-4">
                        <span className="text-[10px] font-bold text-[#00F59B] uppercase">Order Management Panel</span>
                        <h3 className="text-lg font-black text-white">{selectedOrder.serviceName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Order Ref: {selectedOrder.orderNumber} • Platform: {selectedOrder.platform}</p>
                      </div>

                      {/* 1. Update Match Progress Form */}
                      <form onSubmit={handleUpdateProgress} className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                          <Trophy className="w-3.5 h-3.5 text-[#00F59B]" />
                          <span>Update Live Match Score</span>
                        </h4>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Current Match Score Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Champions Finals: 8 Wins - 0 Losses (Flawless)"
                            value={matchScoreLabel}
                            onChange={(e) => setMatchScoreLabel(e.target.value)}
                            className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F59B]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-gray-400 block mb-1">Matches Won</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={matchesWon}
                              onChange={(e) => setMatchesWon(e.target.value)}
                              className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-400 block mb-1">Matches Lost</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={matchesLost}
                              onChange={(e) => setMatchesLost(e.target.value)}
                              className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Progress Percentage: {progressPercent}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressPercent}
                            onChange={(e) => setProgressPercent(e.target.value)}
                            className="w-full accent-[#00F59B]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Booster Tactical Note</label>
                          <input
                            type="text"
                            placeholder="Dominating opponents with 4-3-2-1 formation..."
                            value={boosterComment}
                            onChange={(e) => setBoosterComment(e.target.value)}
                            className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          {isUpdating ? 'Saving Progress...' : 'SAVE MATCH SCORE TO DATABASE'}
                        </button>
                      </form>

                      {/* 2. Upload Completion Proof & Finalize */}
                      <div className="border-t border-[#262B3D] pt-4 space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Finalize Order & Submit Proof</span>
                        </h4>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Proof Screenshot Image / Picture URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-1542751371-adc38448a05e..."
                            value={proofFileUrl}
                            onChange={(e) => setProofFileUrl(e.target.value)}
                            className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                          />
                          {proofFileUrl && (
                            <div className="mt-1.5 flex items-center space-x-2">
                              <img src={proofFileUrl} alt="Proof Screenshot" className="w-14 h-9 rounded object-cover border border-emerald-400" />
                              <span className="text-[10px] text-emerald-400">Proof screenshot attached</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Proof Screenshot File Name</label>
                          <input
                            type="text"
                            placeholder="e.g. 15_0_champions_proof.png"
                            value={proofFileName}
                            onChange={(e) => setProofFileName(e.target.value)}
                            className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1">Completion Notes</label>
                          <input
                            type="text"
                            placeholder="All 15 wins verified. Safe exit on German VPN. Packs untouched in store."
                            value={proofNotes}
                            onChange={(e) => setProofNotes(e.target.value)}
                            className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <button
                          onClick={() => handleCompleteOrder(selectedOrder.orderId)}
                          disabled={isSubmittingProof}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                        >
                          {isSubmittingProof ? 'Submitting...' : 'MARK 100% COMPLETE & SUBMIT PROOF'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-12 text-center text-gray-400">
                      <Eye className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs">Select an order on the left to log match scores or submit completion proofs.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & PAYOUTS */}
        {activeTab === 'earnings' && (
          <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#262B3D] pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase">Pro Booster Financial Ledger</h3>
                <p className="text-xs text-gray-400">Automated payouts distributed every Monday via PayPal, USDT, or Wire Transfer.</p>
              </div>
              <span className="text-sm font-black text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/30 px-3 py-1 rounded-xl">
                75% Commission Tier
              </span>
            </div>

            <div className="space-y-3">
              {(earnings?.recentEarnings || [
                { id: 1, service: 'Champions Finals (Rank 1 - 15 Wins)', gross: 119.99, payout: 89.99, status: 'Paid', date: '2026-10-31' },
                { id: 2, service: 'Division Rivals Weekly 7 Wins', gross: 39.99, payout: 29.99, status: 'Paid', date: '2026-10-30' },
                { id: 3, service: '1-on-1 Pro Coaching Session (2 Hours)', gross: 69.99, payout: 52.49, status: 'Pending Approval', date: '2026-11-01' },
              ]).map((e, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-black text-white">{e.service || e.serviceName}</h5>
                    <p className="text-gray-500 text-[11px]">Gross Order: ${e.gross || e.grossOrderPrice} • Completed: {e.date || e.earnedAt?.substring(0, 10)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="font-black text-sm text-[#00F59B]">+${e.payout || e.amountEarned}</span>
                      <p className="text-[10px] text-gray-500">Booster Share</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                      e.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#FFB800]/20 text-[#FFB800]'
                    }`}>
                      {e.status || (e.isPaidOut ? 'Paid' : 'Pending Approval')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
