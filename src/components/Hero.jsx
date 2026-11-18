import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Headphones, Trophy, ArrowRight, CheckCircle, Sparkles, Zap, GraduationCap, Star, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAssetUrl } from '../utils/assets';

// --- Animation Variants ---

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const badgeContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const badgeItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const headlineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.3, ease: 'easeOut' },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.5, ease: 'easeOut' },
  },
};

const serviceNavContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.6 },
  },
};

const serviceNavItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const ctaContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.7 },
  },
};

const ctaItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const metricsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.9 },
  },
};

const metricCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const heroCardVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' },
  },
};

const previewContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

const pulseGlowKeyframes = {
  scale: [1, 1.5, 1],
  opacity: [1, 0.5, 1],
};

export default function Hero() {
  const { setCurrentPage, openContactModal, formatPrice } = useApp();
  const [activePreview, setActivePreview] = useState('champions');

  const previews = {
    champions: {
      badge: 'RANK 1 (15-0)',
      rating: '★ 91 OVR PRO',
      title: 'FUT Champions Finals (15-0)',
      subtitle: 'Guaranteed Rank 1-15 • Piloted Regional VPN • Live Discord Stream',
      price: '$24.99',
      image: getAssetUrl('images/hero-fc-card.jpg'),
      accent: 'from-[#00F59B] to-[#85FFBD]',
      accentBorder: 'border-[#00F59B]/40',
      actionTitle: 'ORDER RANK 1 BOOST',
      serviceName: 'FUT Champions 15-0 Finals Boost',
      servicePrice: 24.99,
    },
    rivals: {
      badge: 'DIVISION RIVALS BOOST',
      rating: '★ 2,200+ SR',
      title: 'Division Rivals Boost',
      subtitle: 'Target Division • 15 Base Points & 30 Upgraded Points • Safe Regional Proxy',
      price: '$19.99',
      image: getAssetUrl('images/rivals-action.jpg'),
      accent: 'from-[#FFB800] to-[#FFE082]',
      accentBorder: 'border-[#FFB800]/40',
      actionTitle: 'ORDER RIVALS BOOST',
      serviceName: 'Division Rivals Elite Promotion',
      servicePrice: 19.99,
    },
    coaching: {
      badge: '1-ON-1 COACHING',
      rating: '★ TOP 64 PRO',
      title: 'Pro Tactical Masterclass',
      subtitle: '1080p Screen Share • 4-3-2-1 Meta Tactics • Live Replay VOD Review',
      price: '$29.99',
      image: getAssetUrl('images/player-celebration.jpg'),
      accent: 'from-[#C084FC] to-[#E9D5FF]',
      accentBorder: 'border-[#A855F7]/40',
      actionTitle: 'BOOK PRO COACHING',
      serviceName: '1-on-1 Pro Coaching Masterclass',
      servicePrice: 29.99,
    },
  };

  const current = previews[activePreview] || previews.champions;

  return (
    <motion.section
      className="relative w-full pt-8 sm:pt-12 pb-16 sm:pb-24 overflow-hidden select-none"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Background Stadium Atmosphere with High Vibrancy */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={getAssetUrl('images/stadium-bg.jpg')}
          alt="EA Sports FC Stadium"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13]/70 via-[#0B0D13]/85 to-[#0B0D13]" />
      </div>

      {/* Vibrant Neon Ambient Lights */}
      <div className="absolute top-0 left-1/5 w-[500px] lg:w-[800px] h-[350px] lg:h-[500px] bg-[#00F59B]/10 blur-[130px] lg:blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-1/10 w-[400px] lg:w-[700px] h-[300px] lg:h-[450px] bg-[#FF3B30]/10 blur-[140px] lg:blur-[190px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-[#5865F2]/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main Full-Width Container */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Top Guarantee Badges Bar */}
        <motion.div
          className="flex flex-wrap items-center gap-2.5 sm:gap-3"
          variants={badgeContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={badgeItemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824]/90 border border-[#00F59B]/40 text-[#00F59B] text-xs font-black tracking-wide shadow-lg shadow-[#00F59B]/10">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>100% BAN-FREE (RESIDENTIAL VPN)</span>
          </motion.div>
          <motion.div variants={badgeItemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824]/90 border border-[#262B3D] text-gray-200 text-xs font-semibold">
            <Headphones className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
            <span>24/7 WHATSAPP & DISCORD DESK</span>
          </motion.div>
          <motion.div variants={badgeItemVariants} className="hidden md:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824]/90 border border-[#FFB800]/30 text-[#FFB800] text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#FFB800] shrink-0" />
            <span>4.9 / 5.0 VERIFIED TRUSTPILOT</span>
          </motion.div>
          <motion.div variants={badgeItemVariants} className="hidden xl:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824]/90 border border-[#262B3D] text-gray-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#00D6FF] shrink-0" />
            <span>INSTANT 15-MIN PRO QUEUE</span>
          </motion.div>
        </motion.div>

        {/* 2-Column Hero Grid: Expansive & Screen-Filling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column (Grand Headlines + Category Pills + CTAs + Metrics) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
                <span>OFFICIAL BOOSTING HAVEN PLATFORM</span>
              </motion.div>

              <motion.h1
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-[1.15] sm:leading-[1.12]"
                variants={headlineVariants}
                initial="hidden"
                animate="visible"
              >
                EA FC 25 Boosting Service — <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#85FFBD] to-white">
                  FUT Champions, Rivals & Pro Coaching
                </span>
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl font-normal"
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
              >
                Buy safe EA FC 25 boosting from verified Top 200 pros. Guaranteed 15-0 Weekend League wins, Division Rivals rank-ups, and private 1-on-1 coaching — all with residential VPN protection and instant 15-minute queue times.
              </motion.p>
            </div>

            {/* Quick Service Navigator Badges */}
            <div className="space-y-2.5">
              <motion.span
                className="text-[11px] font-black uppercase tracking-wider text-gray-400 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                Popular Competitive Boosts:
              </motion.span>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={serviceNavContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={serviceNavItemVariants}
                  onClick={() => {
                    setCurrentPage('ut-champions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] hover:border-[#00F59B]/50 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#00F59B]" />
                  <span>UT Champions (15-0)</span>
                </motion.button>

                <motion.button
                  variants={serviceNavItemVariants}
                  onClick={() => {
                    setCurrentPage('division-rivals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] hover:border-[#FFB800]/50 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Division Rivals (Elite)</span>
                </motion.button>

                <motion.button
                  variants={serviceNavItemVariants}
                  onClick={() => {
                    setCurrentPage('coaching');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] hover:border-[#A855F7]/50 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>1-on-1 Pro Coaching</span>
                </motion.button>

                <motion.button
                  variants={serviceNavItemVariants}
                  onClick={() => {
                    setCurrentPage('all-services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] hover:border-[#00D6FF]/50 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00D6FF]" />
                  <span>Play-Offs & Milestones</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Main Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3.5 pt-2"
              variants={ctaContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                variants={ctaItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCurrentPage('ut-champions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2.5 transition-all shadow-xl shadow-[#00F59B]/25 hover:scale-[1.02] cursor-pointer min-h-[48px]"
              >
                <span>Select Boost Service</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                variants={ctaItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCurrentPage('coaching');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#A855F7]/20 hover:bg-[#A855F7]/30 border border-[#A855F7]/50 text-white font-black text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer min-h-[48px]"
              >
                <GraduationCap className="w-4 h-4 text-[#C084FC]" />
                <span>Book 1-on-1 Coaching</span>
              </motion.button>

              <motion.button
                variants={ctaItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCurrentPage('all-services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-gray-300 hover:text-white font-bold text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2 transition-all hover:border-[#00F59B]/40 cursor-pointer min-h-[48px]"
              >
                <span>Browse All</span>
              </motion.button>
            </motion.div>

            {/* 4 Performance Metric Cards */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#262B3D]/80"
              variants={metricsContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={metricCardVariants}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-[#141824]/60 border border-[#262B3D] p-3.5 rounded-2xl"
              >
                <span className="text-xl sm:text-2xl font-black text-white block">15-30m</span>
                <p className="text-[11px] text-gray-400 font-medium">Avg Start Time</p>
              </motion.div>
              <motion.div
                variants={metricCardVariants}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-[#141824]/60 border border-[#262B3D] p-3.5 rounded-2xl"
              >
                <span className="text-xl sm:text-2xl font-black text-[#00F59B] block">25,000+</span>
                <p className="text-[11px] text-gray-400 font-medium">Delivered Orders</p>
              </motion.div>
              <motion.div
                variants={metricCardVariants}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-[#141824]/60 border border-[#262B3D] p-3.5 rounded-2xl"
              >
                <span className="text-xl sm:text-2xl font-black text-[#FFB800] block">99.8%</span>
                <p className="text-[11px] text-gray-400 font-medium">Success Rate</p>
              </motion.div>
              <motion.div
                variants={metricCardVariants}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-[#141824]/60 border border-[#262B3D] p-3.5 rounded-2xl"
              >
                <span className="text-xl sm:text-2xl font-black text-[#00D6FF] block">0 Bans</span>
                <p className="text-[11px] text-gray-400 font-medium">100% Safe VPN</p>
              </motion.div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual Showcase Card with Dynamic Previews & Floating Satellite Cards */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 relative mt-6 lg:mt-0"
            variants={heroCardVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top-Left Floating Satellite Fountain Card */}
            <motion.div
              animate={{ y: [-8, 8, -8], x: [-3, 3, -3] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08 }}
              className="hidden sm:flex absolute -top-5 -left-5 z-20 items-center space-x-2.5 bg-[#141824]/95 border border-[#00F59B]/50 px-3.5 py-2 rounded-2xl shadow-xl shadow-[#00F59B]/15 backdrop-blur-md cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-[#00F59B]/20 flex items-center justify-center text-[#00F59B] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] font-black text-white uppercase tracking-wider">INSTANT 15-MIN QUEUE</div>
                <div className="text-[9px] text-[#00F59B] font-bold">Top 200 Pro Assigned</div>
              </div>
            </motion.div>

            {/* Bottom-Right Floating Satellite Fountain Card */}
            <motion.div
              animate={{ y: [8, -8, 8], x: [3, -3, 3] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              whileHover={{ scale: 1.08 }}
              className="hidden sm:flex absolute -bottom-5 -right-5 z-20 items-center space-x-2.5 bg-[#141824]/95 border border-[#FFB800]/50 px-3.5 py-2 rounded-2xl shadow-xl shadow-[#FFB800]/15 backdrop-blur-md cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-[#FFB800]/20 flex items-center justify-center text-[#FFB800] shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] font-black text-white uppercase tracking-wider">99.8% WIN GUARANTEE</div>
                <div className="text-[9px] text-[#FFB800] font-bold">100% Ban-Free VPN</div>
              </div>
            </motion.div>

            <motion.div
              className="relative bg-[#141824]/95 backdrop-blur-2xl border border-[#262B3D] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-hidden group"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(0,245,155,0.5)' }}
            >
              
              {/* Top Queue Status Header with Interactive Preview Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3.5 border-b border-[#262B3D]">
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#00F59B]"
                    animate={pulseGlowKeyframes}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ boxShadow: '0 0 8px rgba(0,245,155,0.6)' }}
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-white">LIVE PRO QUEUE</span>
                  <span className="text-[10px] text-gray-400 font-bold">• 14 ONLINE</span>
                </div>

                {/* Quick Toggle Tabs */}
                <div className="inline-flex p-1 rounded-xl bg-[#0B0D13] border border-[#262B3D] gap-1">
                  <button
                    onClick={() => setActivePreview('champions')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activePreview === 'champions'
                        ? 'bg-[#00F59B] text-[#0B0D13]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Champs
                  </button>
                  <button
                    onClick={() => setActivePreview('rivals')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activePreview === 'rivals'
                        ? 'bg-[#FFB800] text-[#0B0D13]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Rivals
                  </button>
                  <button
                    onClick={() => setActivePreview('coaching')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activePreview === 'coaching'
                        ? 'bg-[#A855F7] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Coach
                  </button>
                </div>
              </div>

              {/* Main Visual Card */}
              <div className="bg-[#0B0D13] rounded-2xl border border-[#262B3D] overflow-hidden group/card relative shadow-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePreview + '-image'}
                      src={current.image}
                      alt={current.title}
                      className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                      loading="eager"
                      variants={previewContentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-transparent to-black/40" />
                  
                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activePreview + '-badge'}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#00F59B]/50 text-[#00F59B] text-[10px] font-black uppercase tracking-wider"
                        variants={previewContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Trophy className="w-3 h-3 text-[#FFB800]" />
                        <span>{current.badge}</span>
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="absolute top-3 right-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activePreview + '-rating'}
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFB800] text-[#0B0D13] text-[10px] font-black uppercase shadow-lg"
                        variants={previewContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {current.rating}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Centered Big Mode Watermark */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePreview + '-watermark'}
                        variants={previewContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col items-center"
                      >
                        <span className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                          {activePreview === 'champions' ? '15-0 WINS' : activePreview === 'rivals' ? 'ELITE DIV' : 'PRO COACH'}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-[#00F59B] tracking-[0.25em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-0.5">
                          {activePreview === 'champions' ? 'WEEKEND LEAGUE' : activePreview === 'rivals' ? 'WEEKLY 7 WINS' : 'DISCORD SCREEN SHARE'}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Card Information & Action */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePreview + '-info'}
                        variants={previewContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#00F59B] block">
                          VERIFIED SERVICE TIER
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white uppercase italic">
                          {current.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {current.subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">From</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={activePreview + '-price'}
                          className="text-xl font-black text-[#00F59B]"
                          variants={previewContentVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {formatPrice(current.servicePrice)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        openContactModal({
                          serviceName: current.serviceName,
                          details: current.subtitle,
                          price: current.servicePrice,
                          platform: 'ps5',
                        });
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-2 shadow-lg shadow-[#00F59B]/20 cursor-pointer"
                    >
                      <span>{current.actionTitle}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Order Completed Feed Ticker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-semibold uppercase tracking-wider">Live Completed Feeds</span>
                  <span className="text-[#00F59B] font-bold">Real-Time</span>
                </div>
                <div className="bg-[#0B0D13] rounded-xl p-3 border border-[#262B3D] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center font-black text-xs shrink-0">
                      PS5
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Rank 1 (15-0) Verified Completed</div>
                      <div className="text-[10px] text-gray-400">Customer: J*** (Germany) • Pro: Alex Kaiser</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#00F59B] shrink-0" />
                </div>
              </div>

              {/* Bottom Security Pill */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#262B3D]/80">
                <span className="flex items-center space-x-1.5 text-gray-300">
                  <Lock className="w-3.5 h-3.5 text-[#00F59B]" />
                  <span>Regional IP VPN Protocol</span>
                </span>
                <span className="text-[#00F59B] font-bold">100% Unopened Packs Kept</span>
              </div>

            </motion.div>
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}
