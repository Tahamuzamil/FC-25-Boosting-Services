import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { UT_CHAMPIONS_RANKS, DIVISION_RIVALS_TIERS, PLATFORMS, ADDONS_DATA } from '../data/mockData';
import {
  Trophy,
  Zap,
  Coins,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  Gamepad2,
  Gamepad,
  Monitor,
  Crosshair,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  Headphones,
  Sparkles,
} from 'lucide-react';

export default function QuickCalculator() {
  const { addToCart, setIsCartOpen, openContactModal, formatPrice, currentCurrency } = useApp();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Active quick tab
  const [activeTab, setActiveTab] = useState('champions'); // 'champions' | 'rivals' | 'coins'

  // Platform
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');

  // Champions State
  const [selectedRank, setSelectedRank] = useState(UT_CHAMPIONS_RANKS[0]);

  // Rivals State
  const [currentDiv, setCurrentDiv] = useState(5);
  const [targetDiv, setTargetDiv] = useState(1);
  const [rivalsObjective, setRivalsObjective] = useState('points15'); // 'points15' | 'promotion' | 'points30'

  // Coins State
  const [coinAmountK, setCoinAmountK] = useState(500); // 500k coins

  // Addons State
  const [selectedAddons, setSelectedAddons] = useState(['express']);

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Price Calculation Logic
  const calculatePrice = () => {
    let base = 0;

    if (activeTab === 'champions') {
      base = selectedRank.basePrice;
    } else if (activeTab === 'rivals') {
      const currentMult = DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.multiplier || 0;
      const targetMult = DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.multiplier || 125;
      const diff = Math.max(0, targetMult - currentMult);

      if (diff > 0) {
        base = diff * 1.14;
      } else {
        if (rivalsObjective === 'points15') base = 34.99;
        else if (rivalsObjective === 'points30') base = 59.99;
        else base = 24.99;
      }

      if (rivalsObjective === 'points30' && diff > 0) {
        base += 20.0;
      }
    } else if (activeTab === 'coins') {
      base = (coinAmountK / 100) * 11.8;
    }

    // Addons
    let addonsTotal = 0;
    selectedAddons.forEach((addonId) => {
      const addon = ADDONS_DATA.find((a) => a.id === addonId);
      if (addon) {
        if (addon.type === 'percentage') {
          addonsTotal += base * addon.rate;
        } else if (addon.type === 'fixed') {
          addonsTotal += addon.price;
        }
      }
    });

    return (base + addonsTotal).toFixed(2);
  };

  const currentPrice = calculatePrice();

  const handleAddToCart = () => {
    let serviceName = '';
    let details = '';

    if (activeTab === 'champions') {
      serviceName = `FUT Champions Finals`;
      details = `Rank ${selectedRank.rankNumber} (${selectedRank.wins}) • Div ${currentDiv} → Div ${targetDiv} • Platform: ${selectedPlatform.toUpperCase()}`;
    } else if (activeTab === 'rivals') {
      const objLabel = rivalsObjective === 'points15' ? '15 Base Points' : rivalsObjective === 'points30' ? '30 Points (Upgraded)' : 'Division Promotion';
      serviceName = `Division Rivals Boost (${objLabel})`;
      details = `Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv} • Objective: ${objLabel} • Platform: ${selectedPlatform.toUpperCase()}`;
    } else {
      serviceName = `EAFC Coins: ${(coinAmountK / 1000).toFixed(1)}M (${coinAmountK}K Coins)`;
      details = `Comfort Trade (Tax Covered) • Platform: ${selectedPlatform.toUpperCase()}`;
    }

    addToCart({
      serviceId: `${activeTab}-${Date.now()}`,
      serviceName,
      details,
      price: currentPrice,
      platform: selectedPlatform,
      addons: selectedAddons,
    });
  };

  const handleInstantCheckout = () => {
    handleAddToCart();
    setIsCartOpen(true);
  };

  const handleOrderWithWhatsAppDiscord = () => {
    let serviceName = '';
    let details = '';

    if (activeTab === 'champions') {
      serviceName = `FUT Champions Finals`;
      details = `Target Rank: Rank ${selectedRank.rankNumber} (${selectedRank.wins}) • Current Div: ${currentDiv} • Target Div: ${targetDiv} • Platform: ${selectedPlatform.toUpperCase()}`;
    } else if (activeTab === 'rivals') {
      const objLabel = rivalsObjective === 'points15' ? '15 Base Points' : rivalsObjective === 'points30' ? '30 Points (Upgraded)' : 'Division Promotion';
      serviceName = `Division Rivals Boost (${objLabel})`;
      details = `Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv} • Objective: ${objLabel} • Platform: ${selectedPlatform.toUpperCase()}`;
    } else {
      serviceName = `EAFC Coins: ${(coinAmountK / 1000).toFixed(1)}M (${coinAmountK}K Coins)`;
      details = `Comfort Trade (Tax Covered) • Platform: ${selectedPlatform.toUpperCase()}`;
    }

    openContactModal({
      serviceName,
      details,
      price: currentPrice,
      platform: selectedPlatform,
    });
  };

  return (
    <section id="quick-calculator" ref={sectionRef} className="w-full py-12 sm:py-20 bg-[#0B0D13] select-none font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[300px] bg-[#00F59B]/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-[#FFB800]/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        
        {/* Section Title with Animated Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-2.5"
        >
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F59B] animate-pulse" />
            <span>INTERACTIVE REAL-TIME CALCULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Customize & Calculate Your Boost
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Instant transparent pricing with no hidden charges. Choose your mode, rank, and platform.
          </p>
        </motion.div>

        {/* Calculator Main Container with Subtle 3D Depth */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="bg-[#141824]/90 backdrop-blur-xl border border-[#262B3D] rounded-3xl p-5 sm:p-7 md:p-9 shadow-2xl relative"
        >
          
          {/* Top Service Tabs */}
          <div className="flex overflow-x-auto pb-4 sm:pb-6 border-b border-[#262B3D] gap-3 sm:flex-wrap scrollbar-none">
            {[
              { id: 'champions', label: 'UT CHAMPIONS FINALS', icon: Trophy, activeColor: 'bg-[#00F59B] text-[#0B0D13]' },
              { id: 'rivals', label: 'DIVISION RIVALS BOOST', icon: Zap, activeColor: 'bg-[#FFB800] text-[#0B0D13]' },
              { id: 'coins', label: 'BUY EAFC COINS', icon: Coins, activeColor: 'bg-[#00D6FF] text-[#0B0D13]' },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider inline-flex items-center space-x-2.5 transition-colors cursor-pointer shrink-0 min-h-[46px] shadow-sm relative ${
                    isActive
                      ? `${tab.activeColor} shadow-lg shadow-white/5`
                      : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="tabPill"
                      className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Main Grid: Parameters on Left, Price Summary on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* LEFT 8 COLS: CONFIGURATOR CONTROLS */}
            <div className="lg:col-span-8 space-y-7">
              
              {/* STEP 1: Platform Selector */}
              <div>
                <div className="flex items-center space-x-2.5 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-white">
                    STEP 1: SELECT YOUR PLATFORM
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {PLATFORMS.map((plat) => {
                    const isSelected = selectedPlatform === plat.id;
                    return (
                      <motion.button
                        key={plat.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedPlatform(plat.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-center space-x-2 relative transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/15 ring-1 ring-[#00F59B]'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white hover:border-[#373F5A]'
                        }`}
                      >
                        {plat.id === 'ps5' && <Gamepad2 className="w-4 h-4 text-[#00F59B] shrink-0" />}
                        {plat.id === 'xbox' && <Gamepad className="w-4 h-4 text-[#00F59B] shrink-0" />}
                        {plat.id === 'pc' && <Monitor className="w-4 h-4 text-[#00F59B] shrink-0" />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {plat.shortName}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#00F59B] text-[#0B0D13] flex items-center justify-center"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Service Specific Controls with AnimatePresence */}
              <AnimatePresence mode="wait">
                {activeTab === 'champions' && (
                  <motion.div
                    key="champions-step2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2.5 mb-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <label className="text-xs font-black uppercase tracking-wider text-white">
                        STEP 2: CHOOSE TARGET WEEKEND LEAGUE RANK
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {UT_CHAMPIONS_RANKS.map((rank) => {
                        const isSelected = selectedRank.id === rank.id;
                        return (
                          <motion.button
                            key={rank.id}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedRank(rank)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/20 ring-1 ring-[#00F59B]'
                                : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white hover:border-[#373F5A]'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00F59B] text-[#0B0D13] flex items-center justify-center"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </motion.div>
                            )}
                            <div className="text-xs font-black text-white">Rank {rank.rankNumber}</div>
                            <div className="text-[11px] text-gray-300 font-semibold">{rank.wins}</div>
                            <div className="text-[11px] text-[#00F59B] font-black mt-2">
                              {formatPrice(rank.basePrice)}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'rivals' && (
                  <motion.div
                    key="rivals-step2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <label className="text-xs font-black uppercase tracking-wider text-white">
                        STEP 2: CHOOSE YOUR OBJECTIVE
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'points15', title: '15 Base Points', desc: 'Get 15 base points for weekly rewards.' },
                        { id: 'promotion', title: 'Division Promotion', desc: 'Climb to next division & unlock rewards.' },
                        { id: 'points30', title: '30 Points (Upgraded)', desc: 'Go all the way with 30 points max rewards.' },
                      ].map((item) => {
                        const isSelected = rivalsObjective === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setRivalsObjective(item.id)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/15 ring-1 ring-[#00F59B]'
                                : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'coins' && (
                  <motion.div
                    key="coins-step2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <label className="text-xs font-black uppercase tracking-wider text-white">
                        STEP 2: SELECT COIN QUANTITY
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Coin Quantity:{' '}
                        <span className="text-white text-base font-black">
                          {coinAmountK >= 1000 ? (coinAmountK / 1000).toFixed(1) + 'M' : coinAmountK + 'K'} Coins
                        </span>
                      </label>
                      <span className="text-xs font-bold text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/30 px-2.5 py-1 rounded-full">
                        100% EA 5% Tax Covered
                      </span>
                    </div>

                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={coinAmountK}
                      onChange={(e) => setCoinAmountK(Number(e.target.value))}
                      className="w-full accent-[#00F59B] cursor-pointer h-2 bg-[#1C2234] rounded-lg"
                    />

                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      {[250, 500, 1000, 2000].map((amt) => (
                        <motion.button
                          key={amt}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCoinAmountK(amt)}
                          className={`py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            coinAmountK === amt
                              ? 'bg-[#00F59B] text-[#0B0D13] border-[#00F59B] shadow-md shadow-[#00F59B]/20'
                              : 'bg-[#1C2234] border-[#262B3D] text-gray-300 hover:text-white'
                          }`}
                        >
                          {amt >= 1000 ? `${amt / 1000}M Coins` : `${amt}K Coins`}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STEP 3: Current & Target Division */}
              <div>
                <div className="flex items-center space-x-2.5 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-white">
                    STEP 3: SELECT CURRENT & TARGET DIVISION
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">
                      CURRENT DIVISION
                    </label>
                    <select
                      value={currentDiv}
                      onChange={(e) => setCurrentDiv(Number(e.target.value))}
                      className="w-full bg-[#1C2234] border border-[#262B3D] rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B] transition-colors"
                    >
                      {DIVISION_RIVALS_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#141824]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">
                      TARGET DIVISION
                    </label>
                    <select
                      value={targetDiv}
                      onChange={(e) => setTargetDiv(Number(e.target.value))}
                      className="w-full bg-[#1C2234] border border-[#262B3D] rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B] transition-colors"
                    >
                      {DIVISION_RIVALS_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#141824]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 4: Optional Add-ons */}
              <div>
                <div className="flex items-center space-x-2.5 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                    4
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-white">
                    STEP 4: OPTIONAL ADD-ONS
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ADDONS_DATA.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <motion.div
                        key={addon.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#0B0D13] border-[#00F59B] shadow-lg shadow-[#00F59B]/10 ring-1 ring-[#00F59B]'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-xl bg-[#141824] border border-[#262B3D] flex items-center justify-center text-[#00F59B]">
                              {addon.id === 'express' && <Zap className="w-4 h-4 text-[#00F59B]" />}
                              {addon.id === 'tactics' && <Crosshair className="w-4 h-4 text-[#00F59B]" />}
                              {addon.id === 'duo' && <Gamepad2 className="w-4 h-4 text-[#00F59B]" />}
                            </div>

                            <motion.div
                              animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isChecked
                                  ? 'bg-[#00F59B] border-[#00F59B] text-[#0B0D13]'
                                  : 'border-[#262B3D]'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </motion.div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-white">{addon.name}</div>
                            <div className="text-[10px] text-gray-400 mt-1 leading-snug">
                              {addon.description}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-black text-[#00F59B] pt-2.5 mt-2.5 border-t border-[#262B3D]/60">
                          + {formatPrice(addon.price)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT 4 COLS: ORDER SUMMARY CARD WITH FLOATING AURA */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-4 bg-[#0B0D13]/95 border border-[#262B3D] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Top ambient card glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F59B]/10 blur-3xl pointer-events-none rounded-full" />

              <div className="space-y-4 relative z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#262B3D]">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#141824] border border-[#262B3D] flex items-center justify-center text-[#00F59B]">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      LIVE ORDER SUMMARY
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00F59B] font-bold border border-[#00F59B]/30 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>VPN SAFE</span>
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Service:</span>
                    <span className="font-bold text-white text-right">
                      {activeTab === 'champions'
                        ? 'FUT Champions Finals'
                        : activeTab === 'rivals'
                        ? 'Division Rivals Boost'
                        : 'Buy EAFC Coins'}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Platform:</span>
                    <span className="font-bold text-white uppercase">
                      {PLATFORMS.find((p) => p.id === selectedPlatform)?.shortName || selectedPlatform}
                    </span>
                  </div>

                  {activeTab === 'champions' && (
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">Target Rank:</span>
                      <span className="font-bold text-white">
                        Rank {selectedRank.rankNumber} ({selectedRank.wins})
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Current Division:</span>
                    <span className="font-bold text-white">Division {currentDiv}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Target Division:</span>
                    <span className="font-bold text-white">Division {targetDiv}</span>
                  </div>

                  <div className="pt-2.5 border-t border-[#262B3D]/70">
                    <span className="text-gray-400 block mb-1.5 font-medium">Active Add-ons:</span>
                    {selectedAddons.length === 0 ? (
                      <span className="text-gray-500 italic text-[11px]">None</span>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedAddons.map((addonId) => {
                          const a = ADDONS_DATA.find((item) => item.id === addonId);
                          if (!a) return null;
                          return (
                            <div key={addonId} className="flex justify-between text-[11px]">
                              <span className="text-gray-300">1 × {a.name}</span>
                              <span className="text-[#00F59B] font-bold">+ {formatPrice(a.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price Display with Animated Value */}
                <div className="pt-4 border-t border-[#262B3D]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                    TOTAL CALCULATED PRICE
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPrice + currentCurrency.code}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="text-4xl font-black text-[#00F59B] tracking-tight"
                      >
                        {formatPrice(currentPrice)}
                      </motion.div>
                    </AnimatePresence>
                    <span className="text-xs font-bold text-gray-400 uppercase">{currentCurrency.code}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOrderWithWhatsAppDiscord}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#25D366] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#00F59B]/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>ORDER ON WHATSAPP / DISCORD</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </motion.button>

                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAddToCart}
                    className="py-3 rounded-2xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleInstantCheckout}
                    className="py-3 rounded-2xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-[#00F59B]/15"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>INSTANT PAY</span>
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#262B3D]/70 text-[10px] text-gray-400 text-center">
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>100% Safe VPN</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>15m Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Headphones className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

            </motion.div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
