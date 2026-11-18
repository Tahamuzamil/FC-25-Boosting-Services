import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { UT_CHAMPIONS_RANKS, PLATFORMS, ADDONS_DATA } from '../data/mockData';
import { Trophy, ShieldCheck, Check, ArrowRight, Zap, Play, Lock, Sparkles, HelpCircle } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function UTChampionsPage() {
  const { addToCart, setIsCartOpen, openContactModal, formatPrice, currentCurrency } = useApp();

  const [selectedRank, setSelectedRank] = useState(UT_CHAMPIONS_RANKS[0]);
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');
  const [selectedAddons, setSelectedAddons] = useState(['express']);
  const [loginMethod, setLoginMethod] = useState('account'); // 'account' | 'selfplay'
  const [gamerTag, setGamerTag] = useState('');

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate Price
  const basePrice = selectedRank.basePrice;
  let addonsSum = 0;
  selectedAddons.forEach((id) => {
    const addon = ADDONS_DATA.find((a) => a.id === id);
    if (addon) {
      if (addon.type === 'percentage') {
        addonsSum += basePrice * addon.rate;
      } else {
        addonsSum += addon.price;
      }
    }
  });

  const totalPrice = (basePrice + addonsSum).toFixed(2);

  const handleOrder = (directToCheckout = false) => {
    addToCart({
      serviceId: `champions-${selectedRank.id}-${Date.now()}`,
      serviceName: `UT Champions: ${selectedRank.name}`,
      details: `${selectedRank.wins} • ${selectedPlatform.toUpperCase()} • Mode: ${loginMethod === 'account' ? 'Piloted VPN' : 'Self-Play Duo'} • Addons: ${selectedAddons.join(', ') || 'None'}`,
      price: totalPrice,
      platform: selectedPlatform,
      addons: selectedAddons,
    });

    if (directToCheckout) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6 sm:space-y-10">
        
        {/* Page Hero Header with FIFA Champions Imagery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none opacity-20 overflow-hidden">
            <img
              src={getAssetUrl('images/champions-action.jpg')}
              alt="UT Champions"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/70 to-transparent" />
          </div>

          <div className="absolute right-0 top-0 w-96 h-96 bg-[#00F59B]/5 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-black uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>Weekend League Finals Guaranteed Wins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              UT Champions Finals Boost
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Secure guaranteed Rank 1 to Rank 15 finishes in EA Sports FC Ultimate Team Weekend League. Played by verified Top 200 FIFA Global Series pros with dedicated regional VPN stealth protection.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                <span>100% Ban-Free VPN</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-[#FFB800]" />
                <span>Starts in ~15 Mins</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#00F59B]" />
                <span>All Packs & Rewards Kept</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Selector */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 1: Select Platform
                </h3>
                <span className="text-xs text-gray-400">All Platforms Supported</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((plat) => (
                  <motion.button
                    key={plat.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedPlatform === plat.id
                        ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/15 ring-1 ring-[#00F59B]'
                        : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold block">{plat.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase mt-0.5 block">Instant Pro Ready</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Step 2: Rank Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 2: Choose Weekend League Target Rank
                </h3>
                <span className="text-xs text-[#00F59B] font-bold">Guaranteed Rank or Full Refund</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {UT_CHAMPIONS_RANKS.map((rank) => {
                  const isSelected = selectedRank.id === rank.id;
                  return (
                    <motion.div
                      key={rank.id}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedRank(rank)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#0B0D13] border-[#00F59B] shadow-xl shadow-[#00F59B]/15 ring-1 ring-[#00F59B]'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white hover:border-[#373F5A]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#00F59B] text-[#0B0D13] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-black uppercase text-white block">
                          Rank {rank.rankNumber}
                        </span>
                        <span className="text-[11px] font-bold text-gray-300 block mt-0.5">
                          {rank.wins}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#262B3D]/80">
                        <span className="text-sm font-black text-[#00F59B]">
                          {formatPrice(rank.basePrice)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 3: Execution Mode & Add-ons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 3: Execution Mode & Stealth Add-ons
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setLoginMethod('account')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    loginMethod === 'account'
                      ? 'bg-[#0B0D13] border-[#00F59B] shadow-md shadow-[#00F59B]/10'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-[#00F59B]" />
                    <span className="text-sm font-bold text-white">Piloted (Regional VPN)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Our verified pro booster plays on your account safely matching your city/country IP.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setLoginMethod('selfplay')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    loginMethod === 'selfplay'
                      ? 'bg-[#0B0D13] border-[#00F59B] shadow-md shadow-[#00F59B]/10'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-[#00F59B]" />
                    <span className="text-sm font-bold text-white">Self-Play / Screen Share</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Play in duo / co-op lobby or screen share with pro giving live tactical calls.
                  </p>
                </motion.div>
              </div>

              {/* Addons List */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Available Add-ons:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ADDONS_DATA.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <motion.div
                        key={addon.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{addon.name}</div>
                          <div className="text-[10px] text-gray-400">{addon.description}</div>
                        </div>
                        <div className="text-xs font-black text-[#00F59B] shrink-0 pl-2">
                          +{formatPrice(addon.price)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Sticky Summary & Checkout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6 shadow-2xl sticky top-28"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#262B3D]">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Boost Configuration
              </h3>
              <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/30 px-2 py-0.5 rounded">
                100% Guaranteed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Target Rank:</span>
                <span className="font-bold text-white">Rank {selectedRank.rankNumber} ({selectedRank.wins})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="font-bold text-white uppercase">{selectedPlatform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mode:</span>
                <span className="font-bold text-white">{loginMethod === 'account' ? 'Piloted (Regional VPN)' : 'Self-Play Duo'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Add-ons:</span>
                <span className="font-bold text-[#00F59B]">
                  {selectedAddons.length > 0 ? `${selectedAddons.length} Selected` : 'None'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262B3D]">
              <div className="text-[10px] text-gray-400 uppercase font-black">Estimated Total</div>
              <div className="text-3xl font-black text-[#00F59B] tracking-tight mt-0.5">
                {formatPrice(totalPrice)} <span className="text-sm font-normal text-gray-400 font-mono">{currentCurrency.code}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOrder(true)}
                className="w-full py-4 rounded-2xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
              >
                <span>Instant Pay & Start Boost</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  openContactModal({
                    serviceName: `UT Champions Rank ${selectedRank.rankNumber}`,
                    details: `${selectedRank.wins} • ${selectedPlatform.toUpperCase()} • Mode: ${loginMethod}`,
                    price: totalPrice,
                    platform: selectedPlatform,
                  });
                }}
                className="w-full py-3.5 rounded-2xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Order via WhatsApp / Discord</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOrder(false)}
                className="w-full py-2.5 rounded-xl border border-transparent hover:border-[#262B3D] text-gray-400 hover:text-white text-xs font-bold transition-all cursor-pointer text-center"
              >
                + Add to Cart & Continue Shopping
              </motion.button>
            </div>

            {/* VPN Stealth Guarantee Pill */}
            <div className="p-3.5 rounded-2xl bg-[#0B0D13] border border-[#262B3D] flex items-center space-x-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#00F59B] shrink-0" />
              <div className="text-[11px] text-gray-400 leading-tight">
                Protected by strict regional VPN matching your city/ISP. Zero bans guaranteed.
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
