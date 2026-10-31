import { useState } from 'react';
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
} from 'lucide-react';

export default function QuickCalculator() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  // Active quick tab
  const [activeTab, setActiveTab] = useState('champions'); // 'champions' | 'rivals' | 'coins'

  // Platform
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');

  // Champions State
  const [selectedRank, setSelectedRank] = useState(UT_CHAMPIONS_RANKS[0]);

  // Rivals State
  const [currentDiv, setCurrentDiv] = useState(5);
  const [targetDiv, setTargetDiv] = useState(1);
  const [isWeekly7Wins, setIsWeekly7Wins] = useState(false);

  // Coins State
  const [coinAmountK, setCoinAmountK] = useState(500); // 500k coins

  // Addons State (Express start active by default as shown in image)
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
      if (isWeekly7Wins) {
        base = 34.99;
      } else {
        const currentMult = DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.multiplier || 0;
        const targetMult = DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.multiplier || 100;
        const diff = Math.max(1, targetMult - currentMult);
        base = Math.max(19.99, diff * 0.95);
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
      serviceName = isWeekly7Wins
        ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
        : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;
      details = `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
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
      serviceName = isWeekly7Wins
        ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
        : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;
      details = `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
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
    <section className="w-full py-10 sm:py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            INTERACTIVE CALCULATOR
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Customize & Calculate Your Boost
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Select your service parameters below for transparent, real-time pricing in USD ($).
          </p>
        </div>

        {/* Calculator Main Container */}
        <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          
          {/* Top Service Tabs */}
          <div className="flex overflow-x-auto pb-4 sm:pb-6 border-b border-[#262B3D] gap-2.5 sm:flex-wrap scrollbar-none">
            <button
              onClick={() => setActiveTab('champions')}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'champions'
                  ? 'bg-[#00F59B] text-[#0B0D13] font-black shadow-lg shadow-[#00F59B]/20'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>UT CHAMPIONS FINALS</span>
            </button>

            <button
              onClick={() => setActiveTab('rivals')}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'rivals'
                  ? 'bg-[#00F59B] text-[#0B0D13] font-black shadow-lg shadow-[#00F59B]/20'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>DIVISION RIVALS BOOST</span>
            </button>

            <button
              onClick={() => setActiveTab('coins')}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'coins'
                  ? 'bg-[#00F59B] text-[#0B0D13] font-black shadow-lg shadow-[#00F59B]/20'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span>BUY EAFC COINS</span>
            </button>
          </div>

          {/* Main Grid: Parameters on Left, Price Summary on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* LEFT 8 COLS: CONFIGURATOR CONTROLS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: Platform Selector */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
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
                      <button
                        key={plat.id}
                        onClick={() => setSelectedPlatform(plat.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 relative transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md shadow-[#00F59B]/10 ring-1 ring-[#00F59B]/40'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                        }`}
                      >
                        {plat.id === 'ps5' && <Gamepad2 className="w-4 h-4 text-white shrink-0" />}
                        {plat.id === 'xbox' && <Gamepad className="w-4 h-4 text-white shrink-0" />}
                        {plat.id === 'pc' && <Monitor className="w-4 h-4 text-white shrink-0" />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {plat.shortName}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00F59B] text-[#0B0D13] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Service Specific Controls */}
              {activeTab === 'champions' && (
                <div>
                  <div className="flex items-center space-x-2 mb-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-white">
                      STEP 2: CHOOSE TARGET WEEKEND LEAGUE RANK
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                    {UT_CHAMPIONS_RANKS.map((rank) => {
                      const isSelected = selectedRank.id === rank.id;
                      return (
                        <button
                          key={rank.id}
                          onClick={() => setSelectedRank(rank)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md shadow-[#00F59B]/20 ring-1 ring-[#00F59B]'
                              : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white hover:border-gray-500'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00F59B] text-[#0B0D13] flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                          <div className="text-xs font-black text-white">Rank {rank.rankNumber}</div>
                          <div className="text-[11px] text-gray-300 font-semibold">{rank.wins}</div>
                          <div className="text-[11px] text-[#00F59B] font-black mt-2">
                            ${rank.basePrice.toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'rivals' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#00F59B] text-[#0B0D13] text-[11px] font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-white">
                      STEP 2: CHOOSE RIVALS BOOST MODE
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 pb-2">
                    <button
                      onClick={() => setIsWeekly7Wins(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        !isWeekly7Wins
                          ? 'bg-[#00F59B] text-[#0B0D13]'
                          : 'bg-[#1C2234] text-gray-300'
                      }`}
                    >
                      Division Promotion
                    </button>
                    <button
                      onClick={() => setIsWeekly7Wins(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        isWeekly7Wins
                          ? 'bg-[#00F59B] text-[#0B0D13]'
                          : 'bg-[#1C2234] text-gray-300'
                      }`}
                    >
                      Weekly 7 Wins Boost ($34.99)
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'coins' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-1">
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
                      <span className="text-white text-sm font-black">
                        {coinAmountK >= 1000 ? (coinAmountK / 1000).toFixed(1) + 'M' : coinAmountK + 'K'} Coins
                      </span>
                    </label>
                    <span className="text-xs font-bold text-[#00F59B]">100% EA 5% Tax Covered</span>
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
                      <button
                        key={amt}
                        onClick={() => setCoinAmountK(amt)}
                        className={`py-1.5 rounded-lg border text-xs font-bold ${
                          coinAmountK === amt
                            ? 'bg-[#00F59B] text-[#0B0D13] border-[#00F59B]'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-300'
                        }`}
                      >
                        {amt >= 1000 ? `${amt / 1000}M Coins` : `${amt}K Coins`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Current & Target Division */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
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
                      className="w-full bg-[#1C2234] border border-[#262B3D] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
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
                      className="w-full bg-[#1C2234] border border-[#262B3D] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
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
                <div className="flex items-center space-x-2 mb-2.5">
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
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#0B0D13] border-[#00F59B] shadow-md shadow-[#00F59B]/10 ring-1 ring-[#00F59B]/40'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#262B3D] flex items-center justify-center text-[#00F59B]">
                              {addon.id === 'express' && <Zap className="w-4 h-4 text-[#00F59B]" />}
                              {addon.id === 'tactics' && <Crosshair className="w-4 h-4 text-[#00F59B]" />}
                              {addon.id === 'duo' && <Gamepad2 className="w-4 h-4 text-[#00F59B]" />}
                            </div>

                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isChecked
                                  ? 'bg-[#00F59B] border-[#00F59B] text-[#0B0D13]'
                                  : 'border-[#262B3D]'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-white">{addon.name}</div>
                            <div className="text-[10px] text-gray-400 mt-1 leading-snug">
                              {addon.description}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-black text-[#00F59B] pt-2 mt-2 border-t border-[#262B3D]/60">
                          + ${addon.price.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT 4 COLS: ORDER SUMMARY CARD (MATCHES IMAGE 5) */}
            <div className="lg:col-span-4 bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#262B3D]">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#141824] border border-[#262B3D] flex items-center justify-center text-[#00F59B]">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      ORDER SUMMARY
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00F59B] font-bold border border-[#00F59B]/30 px-2 py-0.5 rounded inline-flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>SAFE & SECURE</span>
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-xs">
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

                  <div className="pt-2 border-t border-[#262B3D]/70">
                    <span className="text-gray-400 block mb-1.5 font-medium">Active Add-ons:</span>
                    {selectedAddons.length === 0 ? (
                      <span className="text-gray-500 italic text-[11px]">None</span>
                    ) : (
                      <div className="space-y-1">
                        {selectedAddons.map((addonId) => {
                          const a = ADDONS_DATA.find((item) => item.id === addonId);
                          if (!a) return null;
                          return (
                            <div key={addonId} className="flex justify-between text-[11px]">
                              <span className="text-gray-300">1 × {a.name}</span>
                              <span className="text-[#00F59B] font-bold">+ ${a.price.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="pt-4 border-t border-[#262B3D]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Price</span>
                  <div className="text-3xl font-black text-[#00F59B] tracking-tight mt-0.5">
                    ${currentPrice} <span className="text-sm font-bold text-gray-400">USD</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleOrderWithWhatsAppDiscord}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#25D366] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ORDER NOW (WHATSAPP / DISCORD)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </button>
                  <button
                    onClick={handleInstantCheckout}
                    className="py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-md shadow-[#00F59B]/10"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>INSTANT PAY</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#262B3D]/70 text-[10px] text-gray-400 text-center">
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>100% Safe & Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Headphones className="w-3.5 h-3.5 text-[#00F59B] mb-0.5" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
