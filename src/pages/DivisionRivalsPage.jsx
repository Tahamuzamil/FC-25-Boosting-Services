import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DIVISION_RIVALS_TIERS } from '../data/mockData';
import {
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Headphones,
  Users,
  Monitor,
  User,
  ShoppingCart,
  CreditCard,
  ChevronDown,
  Star,
  Lock,
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

// PlayStation Brand Icon
const PlayStationIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 2C5.5 2 4.2 3.8 4.2 5.5c0 3.3 4.4 4.5 4.4 4.5v-2.3s-1.8-.4-1.8-1.5c0-.9.6-1.5 1.7-1.5 1.2 0 1.9.6 1.9 1.6v15.7l3.8 2V2H8.5zm5.7 6.4c-2.3 0-4.2.8-5.7 2v2.6c1.2-.9 2.7-1.4 4.2-1.4 2.2 0 3.7 1.1 3.7 2.8 0 1.9-1.6 2.7-4 2.7H9.2v2.5h3.2c4.4 0 7.8-1.7 7.8-5.3 0-3.6-2.9-5.9-6-5.9z" />
  </svg>
);

// Xbox Brand Icon
const XboxIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4.3 3.7c1.3.8 2.8 2 4.3 3.5 1.5-1.5 3-2.7 4.3-3.5 2.1 1.4 3.7 3.5 4.4 6-.8-.8-2-1.4-3.3-1.6-1.5-.2-2.7.2-4.1 1.7-.5.5-.9 1-1.3 1.5-.4-.5-.8-1-1.3-1.5-1.4-1.5-2.6-1.9-4.1-1.7-1.3.2-2.5.8-3.3 1.6.7-2.5 2.3-4.6 4.4-6zM4.1 12.8c.8-.8 1.9-1.3 3.1-1.5 1.2-.2 2.3.1 3.5 1.3.4.4.8.8 1.3 1.3-1.8 2.2-3.8 4.6-5.9 5.8-1.4-1.8-2-4.2-2-6.9zm15.8 0c0 2.7-.6 5.1-2 6.9-2.1-1.2-4.1-3.6-5.9-5.8.5-.5.9-.9 1.3-1.3 1.2-1.2 2.3-1.5 3.5-1.3 1.2.2 2.3.7 3.1 1.5z" />
  </svg>
);

// WhatsApp Icon
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.13 7.39C8.94 7.39 8.64 7.46 8.38 7.74C8.12 8.02 7.39 8.71 7.39 10.1C7.39 11.49 8.41 12.83 8.55 13.02C8.69 13.21 10.52 16.03 13.34 17.25C14.01 17.54 14.53 17.71 14.94 17.84C15.61 18.06 16.23 18.03 16.71 17.96C17.24 17.88 18.35 17.29 18.58 16.64C18.82 15.99 18.82 15.43 18.75 15.32C18.68 15.2 18.49 15.13 18.21 14.99C17.93 14.85 16.55 14.17 16.29 14.08C16.03 13.99 15.85 13.94 15.66 14.22C15.48 14.5 14.97 15.13 14.81 15.32C14.65 15.5 14.49 15.53 14.21 15.39C13.93 15.25 13.04 14.96 11.98 14.02C11.16 13.29 10.6 12.39 10.44 12.11C10.28 11.83 10.42 11.68 10.56 11.54C10.69 11.41 10.85 11.2 10.99 11.04C11.13 10.88 11.18 10.76 11.27 10.58C11.36 10.4 11.32 10.24 11.25 10.1C11.18 9.96 10.63 8.62 10.4 8.06C10.18 7.53 9.95 7.6 9.77 7.59C9.6 7.59 9.38 7.39 9.13 7.39Z" />
  </svg>
);

export default function DivisionRivalsPage() {
  const { addToCart, setIsCartOpen, openContactModal, formatPrice, currentCurrency } = useApp();

  // Objectives: 'points15' | 'promotion' | 'points30'
  const [objective, setObjective] = useState('points15');
  const [platform, setPlatform] = useState('ps5'); // 'ps5' | 'xbox' | 'pc'
  const [currentDiv, setCurrentDiv] = useState(5);
  const [targetDiv, setTargetDiv] = useState(1);

  // Price Calculation Logic
  // Div 5 (multiplier: 45) to Div 1 (multiplier: 125) => diff = 80 => 80 * 1.14 = $91.20 USD
  const calculatePrice = () => {
    const currentMult = DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.multiplier || 0;
    const targetMult = DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.multiplier || 125;
    const diff = Math.max(0, targetMult - currentMult);

    let price = 0;
    if (diff > 0) {
      price = diff * 1.14;
    } else {
      if (objective === 'points15') price = 34.99;
      else if (objective === 'points30') price = 59.99;
      else price = 24.99;
    }

    // Additional premium for upgraded 30 points if also promoting
    if (objective === 'points30' && diff > 0) {
      price += 20.0;
    }

    return price.toFixed(2);
  };

  const totalPrice = calculatePrice();

  const getObjectiveLabel = () => {
    if (objective === 'points15') return '15 Points';
    if (objective === 'points30') return '30 Points (Upgraded)';
    return `Promotion (Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv})`;
  };

  const getPlatformLabel = () => {
    if (platform === 'ps5') return 'PS5 / PS4';
    if (platform === 'xbox') return 'XBOX';
    return 'PC';
  };

  const handleAddToCart = (directCheckout = false) => {
    const serviceName = 'Division Rivals Boost';
    const details = `Objective: ${getObjectiveLabel()} • Platform: ${getPlatformLabel()} • Current Div: ${currentDiv} • Target Div: ${targetDiv === 0 ? 'Elite' : targetDiv}`;

    addToCart({
      serviceId: `rivals-${objective}-${Date.now()}`,
      serviceName,
      details,
      price: totalPrice,
      platform,
    });

    if (directCheckout) {
      setIsCartOpen(true);
    }
  };

  const handleOrderWithWhatsAppDiscord = () => {
    const serviceName = 'Division Rivals Boost';
    const details = `Objective: ${getObjectiveLabel()} • Platform: ${getPlatformLabel()} • Current Div: ${currentDiv} • Target Div: ${targetDiv === 0 ? 'Elite' : targetDiv}`;

    openContactModal({
      serviceName,
      details,
      price: totalPrice,
      platform,
    });
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-[#080B11] select-none font-sans text-white">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        
        {/* ========================================================= */}
        {/* HERO BANNER: EXACT MATCH TO IMAGE                         */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#1C2433] bg-[#0E131E] shadow-2xl"
        >
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={getAssetUrl('images/stadium-bg.jpg')}
              alt="Stadium"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E131E] via-[#0E131E]/90 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00F59B]/15 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/40 text-[#00F59B] text-xs font-black uppercase tracking-wider shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#00F59B] fill-[#00F59B]" />
                <span>DIVISION RIVALS BOOST</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                DIVISION RIVALS <span className="text-[#00F59B]">BOOST</span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm md:text-[15px] text-gray-300 leading-relaxed max-w-2xl font-medium">
                Climb the ranks and secure better rewards! We'll help you reach your target division, or lock in your weekly{' '}
                <span className="text-[#00F59B] font-semibold">15 base points</span> or go all the way with{' '}
                <span className="text-[#00F59B] font-semibold">30 points, and</span> get the best rewards before the Thursday reset.
              </p>

              {/* Four Feature Badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-bold text-gray-300">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#00F59B]" />
                  <span>Rank Progression</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                  <span>Safe & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#00F59B]" />
                  <span>Pro Players</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones className="w-4 h-4 text-[#00F59B]" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Graphic: Chevrons + Div R Crest + Slogan + EA FC */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-end space-x-4 xl:space-x-6">
              
              {/* Left Green Double Chevrons */}
              <div className="flex flex-col items-center justify-center text-[#00F59B] opacity-90 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                <svg className="w-10 h-10 -mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="w-10 h-10 -mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Gold Division R Shield Crest */}
              <div className="relative filter drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]">
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gradient-to-b from-[#2A2312] via-[#14161C] to-[#0A0D14] border-2 border-[#D4AF37] rounded-b-[2rem] flex flex-col items-center justify-center p-3 relative shadow-2xl">
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-1 border border-[#D4AF37]/30 rounded-b-[1.75rem] pointer-events-none" />
                  <span className="text-[12px] font-black tracking-[0.2em] text-[#D4AF37] uppercase border-b border-[#D4AF37]/40 pb-1 mb-1">
                    DIV
                  </span>
                  <span className="text-4xl sm:text-5xl font-black italic text-[#E8C252] tracking-tighter filter drop-shadow">
                    R
                  </span>
                </div>
              </div>

              {/* Right Green Double Chevrons */}
              <div className="flex flex-col items-center justify-center text-[#00F59B] opacity-90 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                <svg className="w-10 h-10 -mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="w-10 h-10 -mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M4 16l8-8 8 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Slogan Text: HIGHER DIVISIONS BETTER REWARDS */}
              <div className="flex flex-col text-right leading-none select-none pl-2">
                <span className="text-xl xl:text-2xl font-black tracking-tight text-white uppercase italic">
                  HIGHER
                </span>
                <span className="text-xl xl:text-2xl font-black tracking-tight text-[#00F59B] uppercase italic">
                  DIVISIONS
                </span>
                <span className="text-xl xl:text-2xl font-black tracking-tight text-white uppercase italic mt-1">
                  BETTER
                </span>
                <span className="text-xl xl:text-2xl font-black tracking-tight text-[#00F59B] uppercase italic">
                  REWARDS
                </span>
                
                {/* EA FC Logo */}
                <div className="flex items-center justify-end space-x-1.5 mt-3 pt-1 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">EA SPORTS</span>
                  <span className="text-sm font-black italic tracking-tighter text-[#00F59B]">FC</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* MAIN CONFIGURATOR + ORDER SUMMARY GRID                    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================= */}
          {/* LEFT 8 COLUMNS: STEPS 1, 2, 3                           */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ----------------------------------------------------- */}
            {/* STEP 1: CHOOSE YOUR OBJECTIVE                         */}
            {/* ----------------------------------------------------- */}
            <div className="bg-[#0D121B] border border-[#1C2433] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#00F59B] text-[#080B11] text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    STEP 1: CHOOSE YOUR OBJECTIVE
                  </h3>
                </div>
                <p className="text-xs text-gray-400 pl-9">
                  Select how far you want to progress and what rewards you want to unlock.
                </p>
              </div>

              {/* 3 Objective Cards in a Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: 15 Base Points */}
                <div
                  onClick={() => setObjective('points15')}
                  className={`p-5 rounded-2xl border relative cursor-pointer transition-all flex flex-col justify-between min-h-[170px] ${
                    objective === 'points15'
                      ? 'bg-[#091518] border-[#00F59B] ring-1 ring-[#00F59B]/50 shadow-lg shadow-[#00F59B]/10'
                      : 'bg-[#121722] border-[#1C2433] hover:border-gray-600 text-gray-400'
                  }`}
                >
                  {/* Top-Right Green Checkmark */}
                  {objective === 'points15' && (
                    <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Icon: Shield with R */}
                    <div className="w-10 h-10 rounded-xl bg-[#080B11] border border-[#1C2433] flex items-center justify-center text-[#00F59B] relative">
                      <svg className="w-6 h-6 text-[#00F59B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="absolute text-[11px] font-black text-[#00F59B]">R</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">15 Base Points</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">
                        Get 15 base points for your weekly rewards.
                      </p>
                    </div>
                  </div>

                  {/* Badge: 15 POINTS */}
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-[#00F59B]/50 bg-[#00F59B]/10 text-[#00F59B] text-[11px] font-black">
                      <span>15</span>
                      <span className="text-[10px] tracking-wider uppercase">POINTS</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Division Promotion */}
                <div
                  onClick={() => setObjective('promotion')}
                  className={`p-5 rounded-2xl border relative cursor-pointer transition-all flex flex-col justify-between min-h-[170px] ${
                    objective === 'promotion'
                      ? 'bg-[#091518] border-[#00F59B] ring-1 ring-[#00F59B]/50 shadow-lg shadow-[#00F59B]/10'
                      : 'bg-[#121722] border-[#1C2433] hover:border-gray-600 text-gray-400'
                  }`}
                >
                  {/* Top-Right Green Checkmark */}
                  {objective === 'promotion' && (
                    <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Icon: Upward Arrow in Octagon/Circle */}
                    <div className="w-10 h-10 rounded-xl bg-[#080B11] border border-[#1C2433] flex items-center justify-center text-[#00F59B]">
                      <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">Division Promotion</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">
                        Climb to the next division and unlock better rewards.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    {/* Empty spacing to align with other cards */}
                    <div className="h-6" />
                  </div>
                </div>

                {/* Card 3: 30 Points (Upgraded Rewards) */}
                <div
                  onClick={() => setObjective('points30')}
                  className={`p-5 rounded-2xl border relative cursor-pointer transition-all flex flex-col justify-between min-h-[170px] ${
                    objective === 'points30'
                      ? 'bg-[#091518] border-[#00F59B] ring-1 ring-[#00F59B]/50 shadow-lg shadow-[#00F59B]/10'
                      : 'bg-[#121722] border-[#1C2433] hover:border-gray-600 text-gray-400'
                  }`}
                >
                  {/* Top-Right Green Checkmark */}
                  {objective === 'points30' && (
                    <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Icon: Crown in Hexagon */}
                    <div className="w-10 h-10 rounded-xl bg-[#080B11] border border-[#1C2433] flex items-center justify-center text-[#00F59B]">
                      <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">30 Points (Upgraded Rewards)</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">
                        Go all the way with 30 points for the best rewards.
                      </p>
                    </div>
                  </div>

                  {/* Badge: 30 POINTS */}
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-[#00F59B]/50 bg-[#00F59B]/10 text-[#00F59B] text-[11px] font-black">
                      <span>30</span>
                      <span className="text-[10px] tracking-wider uppercase">POINTS</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------- */}
            {/* STEP 2: PLATFORM                                      */}
            {/* ----------------------------------------------------- */}
            <div className="bg-[#0D121B] border border-[#1C2433] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#00F59B] text-[#080B11] text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    STEP 2: PLATFORM
                  </h3>
                </div>
                <p className="text-xs text-gray-400 pl-9">
                  Choose your platform and we'll handle the rest.
                </p>
              </div>

              {/* 3 Platform Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* PS5 / PS4 */}
                <button
                  type="button"
                  onClick={() => setPlatform('ps5')}
                  className={`p-4 rounded-2xl border relative flex items-center justify-center space-x-3 transition-all cursor-pointer ${
                    platform === 'ps5'
                      ? 'bg-[#091518] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/10 ring-1 ring-[#00F59B]/50'
                      : 'bg-[#121722] border-[#1C2433] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <PlayStationIcon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">PS5 / PS4</span>

                  {platform === 'ps5' && (
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* XBOX */}
                <button
                  type="button"
                  onClick={() => setPlatform('xbox')}
                  className={`p-4 rounded-2xl border relative flex items-center justify-center space-x-3 transition-all cursor-pointer ${
                    platform === 'xbox'
                      ? 'bg-[#091518] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/10 ring-1 ring-[#00F59B]/50'
                      : 'bg-[#121722] border-[#1C2433] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <XboxIcon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">XBOX</span>

                  {platform === 'xbox' && (
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* PC */}
                <button
                  type="button"
                  onClick={() => setPlatform('pc')}
                  className={`p-4 rounded-2xl border relative flex items-center justify-center space-x-3 transition-all cursor-pointer ${
                    platform === 'pc'
                      ? 'bg-[#091518] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/10 ring-1 ring-[#00F59B]/50'
                      : 'bg-[#121722] border-[#1C2433] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">PC</span>

                  {platform === 'pc' && (
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#00F59B] text-[#080B11] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>

              </div>
            </div>

            {/* ----------------------------------------------------- */}
            {/* STEP 3: SELECT CURRENT & TARGET DIVISION             */}
            {/* ----------------------------------------------------- */}
            <div className="bg-[#0D121B] border border-[#1C2433] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#00F59B] text-[#080B11] text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    STEP 3: SELECT CURRENT & TARGET DIVISION
                  </h3>
                </div>
                <p className="text-xs text-gray-400 pl-9">
                  Tell us your current division and the division you want to reach.
                </p>
              </div>

              {/* Two Dropdown Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                {/* Current Division */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                    CURRENT DIVISION
                  </label>
                  <div className="relative">
                    <select
                      value={currentDiv}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentDiv(val);
                        if (targetDiv > val) setTargetDiv(val === 0 ? 0 : val - 1);
                      }}
                      className="w-full bg-[#080B11] border border-[#1C2433] rounded-xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B] appearance-none cursor-pointer"
                    >
                      {DIVISION_RIVALS_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#0D121B]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Target Division */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                    TARGET DIVISION
                  </label>
                  <div className="relative">
                    <select
                      value={targetDiv}
                      onChange={(e) => setTargetDiv(Number(e.target.value))}
                      className="w-full bg-[#080B11] border border-[#1C2433] rounded-xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B] appearance-none cursor-pointer"
                    >
                      {DIVISION_RIVALS_TIERS.filter((t) => t.id <= currentDiv).map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#0D121B]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT 4 COLUMNS: ORDER SUMMARY                          */}
          {/* ======================================================= */}
          <div className="lg:col-span-4 bg-[#0D121B] border border-[#1C2433] rounded-3xl p-6 sm:p-7 space-y-6 sticky top-24 shadow-2xl">
            
            {/* Header: User Icon + ORDER SUMMARY + SAFE & SECURE Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1C2433]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  ORDER SUMMARY
                </span>
              </div>

              <div className="px-3 py-1 rounded-full border border-[#00F59B]/50 bg-[#00F59B]/10 text-[#00F59B] text-[10px] font-black uppercase tracking-wider">
                SAFE & SECURE
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Service</span>
                <span className="font-bold text-white">Division Rivals Boost</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Platform</span>
                <span className="font-bold text-white">{getPlatformLabel()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Division</span>
                <span className="font-bold text-white">
                  {DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.name || `Division ${currentDiv}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Target Division</span>
                <span className="font-bold text-white">
                  {DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.name || `Division ${targetDiv}`}
                </span>
              </div>

              {/* Thin Divider */}
              <div className="border-t border-[#1C2433] my-2" />

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Base Points</span>
                <span className="font-bold text-white">{getObjectiveLabel()}</span>
              </div>

              {/* Thin Divider */}
              <div className="border-t border-[#1C2433] my-2" />
            </div>

            {/* Price Block: TOTAL PRICE */}
            <div className="pt-2">
              <span className="text-[11px] text-gray-400 uppercase font-black tracking-wider block mb-1">
                TOTAL PRICE
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#00F59B] tracking-tight">
                {formatPrice(totalPrice)} <span className="text-xl sm:text-2xl text-[#00F59B] font-bold font-mono">{currentCurrency.code}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              
              {/* ORDER NOW (WHATSAPP / DISCORD) -> */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOrderWithWhatsAppDiscord}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F59B] via-[#00E590] to-[#00D682] hover:opacity-95 text-[#080B11] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/25 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>ORDER NOW (WHATSAPP / DISCORD)</span>
                <ArrowRight className="w-4 h-4 shrink-0 stroke-[3]" />
              </motion.button>

              {/* ADD TO CART + INSTANT PAY */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAddToCart(false)}
                  className="py-3.5 px-3 rounded-2xl bg-[#080B11] hover:bg-[#141B26] border border-[#1C2433] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span>ADD TO CART</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAddToCart(true)}
                  className="py-3.5 px-3 rounded-2xl bg-[#00F59B] hover:bg-[#00E590] text-[#080B11] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-[#00F59B]/15"
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>INSTANT PAY</span>
                </motion.button>
              </div>

            </div>

            {/* Bottom Trust Row */}
            <div className="pt-4 border-t border-[#1C2433] grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 font-bold">
              <div className="flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                <span className="leading-tight">100% Safe & Secure</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <Zap className="w-4 h-4 text-[#00F59B]" />
                <span className="leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <Headphones className="w-4 h-4 text-[#00F59B]" />
                <span className="leading-tight">24/7 Support</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
