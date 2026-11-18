import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Trophy, Zap, Shield, Sparkles, ArrowRight, Star, Check, Settings, Play } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function FeaturedServicesGrid() {
  const { setCurrentPage, openContactModal, formatPrice } = useApp();

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video autoplay prevented by browser policy:', err);
        });
      }
    }
  }, []);

  const services = [
    {
      id: 'ut-champions',
      page: 'ut-champions',
      title: 'UT CHAMPIONS FINALS BOOST',
      tagline: 'Compete in the highest level. Get your Rank 1-15 and secure the best rewards in UT Champions.',
      image: getAssetUrl('images/hero-fc-card.jpg'),
      badge: 'UT CHAMPIONS FINALS',
      badgeIcon: Trophy,
      badgeColor: 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/40',
      price: '$119.99',
      rawPrice: 119.99,
      rating: 4.9,
      features: [
        'Rank 1 - 15 Wins (or selected rank)',
        '100% Regional Ban-Free VPN',
        'Fast & Secure Delivery',
        'Top 200 Pro Boosters Only',
      ],
    },
    {
      id: 'division-rivals',
      page: 'division-rivals',
      title: 'DIVISION RIVALS BOOST',
      tagline: "Climb the ranks and secure better rewards! Reach your target division, lock in 15 base points, or go all the way with 30 points.",
      image: getAssetUrl('images/rivals-action.jpg'),
      badge: 'DIVISION RIVALS BOOST',
      badgeIcon: Shield,
      badgeColor: 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/40',
      price: '$19.99',
      rawPrice: 19.99,
      rating: 4.9,
      features: [
        '15 Base Points & 30 Upgraded Points',
        'Division Promotion (Div 10 → Elite)',
        '100% Safe & Regional VPN',
        '24/7 Support & Fast Delivery',
      ],
    },
    {
      id: 'objectives-sbc',
      page: 'all-services',
      title: 'OBJECTIVES & SBCs',
      tagline: 'Complete objectives, unlock rewards, and finish SBCs with ease. Get the cards, XP and packs you want.',
      image: getAssetUrl('images/coins-trophy.jpg'),
      badge: 'OBJECTIVES & SBCs',
      badgeIcon: Shield,
      badgeColor: 'bg-[#00D6FF]/15 text-[#00D6FF] border border-[#00D6FF]/40',
      price: '$14.99',
      rawPrice: 14.99,
      rating: 4.8,
      features: [
        'Player Objectives',
        'Evolution Challenges',
        'Seasonal XP & Rewards',
        'SBCs (All Categories)',
        '100% Secure & Reliable',
      ],
    },
    {
      id: 'pro-coaching',
      page: 'coaching',
      title: 'PRO COACHING',
      tagline: 'Learn from top players and level up your skills with personalized coaching sessions.',
      image: getAssetUrl('images/player-celebration.jpg'),
      badge: 'PRO COACHING',
      badgeIcon: Trophy,
      badgeColor: 'bg-[#A855F7]/15 text-[#C084FC] border border-[#A855F7]/40',
      price: '$29.99',
      rawPrice: 29.99,
      rating: 4.9,
      features: [
        '1-on-1 Coaching Sessions',
        'Tactical Analysis & Build',
        'Gameplay Review & Tips',
        'Flexible Schedule',
      ],
    },
  ];

  // Animation variants
  const headerVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 400, damping: 15, delay: 0.3 },
    },
  };

  const priceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, delay: 0.4 },
    },
  };

  return (
    <section ref={sectionRef} className="relative w-full py-16 sm:py-24 bg-[#0B0D13] select-none font-sans overflow-hidden">
      
      {/* Real Football Match Background Video with Subtle Depth Blur & Hooking Stadium Lighting */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105 filter blur-[1.5px] opacity-65 brightness-95 contrast-110 transition-all duration-700"
        >
          <source src={getAssetUrl('videos/football-match.mp4')} type="video/mp4" />
          <source src={getAssetUrl('videos/verified-football-action.mp4')} type="video/mp4" />
          <source src={getAssetUrl('videos/real-soccer-pitch.mp4')} type="video/mp4" />
        </video>

        {/* Cinematic Dual-Tone Overlays: Allows Video & Stadium Action to Shine Clearly Behind Glass Cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13] via-[#0B0D13]/40 to-[#0B0D13]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D13]/50 via-transparent to-[#0B0D13]/50" />

        {/* Stadium Floodlight Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#00F59B]/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-[#00D6FF]/15 blur-[160px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262B3D]/80 pb-6"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824]/90 backdrop-blur-md border border-[#00F59B]/40 text-[#00F59B] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00F59B]/10">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              <span>OFFICIAL EA SPORTS FC 25 PACKAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Featured Pro Boosting Services
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-normal leading-relaxed">
              Choose your competitive mode below. Every service is fulfilled by verified Top 200 esports players with strict regional VPN stealth.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-end">
            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#141824]/90 backdrop-blur-md border border-[#00F59B]/30 text-[11px] font-bold text-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
              <span>LIVE STADIUM ATMOSPHERE</span>
            </div>

            <motion.button
              onClick={() => {
                setCurrentPage('all-services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#141824]/90 backdrop-blur-md hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-white uppercase tracking-wider inline-flex items-center space-x-2 transition-all hover:border-[#00F59B]/40 cursor-pointer shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* 4-Card Picture Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          variants={gridContainerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((srv) => {
            const BadgeIcon = srv.badgeIcon;
            return (
              <motion.div
                key={srv.id}
                className="bg-[#141824]/85 backdrop-blur-xl border border-[#262B3D] hover:border-[#00F59B]/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xl group hover:shadow-2xl hover:shadow-[#00F59B]/15"
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Card Picture Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080A0F]">
                  <motion.img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500"
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-black/40 pointer-events-none" />

                  {/* Top Badge */}
                  <motion.div
                    className="absolute top-3 left-3"
                    variants={badgeVariants}
                  >
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg inline-flex items-center space-x-1 backdrop-blur-md ${srv.badgeColor}`}>
                      <BadgeIcon className="w-3 h-3 shrink-0" />
                      <span>{srv.badge}</span>
                    </span>
                  </motion.div>

                  {/* Rating Badge */}
                  <motion.div
                    className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FFB800] border border-white/10"
                    variants={badgeVariants}
                  >
                    <Star className="w-3 h-3 fill-[#FFB800]" />
                    <span>{srv.rating}</span>
                  </motion.div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-[#00F59B] transition-colors leading-tight">
                      {srv.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed min-h-[36px]">
                      {srv.tagline}
                    </p>

                    {/* Bullet Points */}
                    <div className="pt-2 space-y-1.5 border-t border-[#262B3D]/60">
                      {srv.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-[#262B3D] space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-black block tracking-wider">
                          STARTING AT
                        </span>
                        <motion.span
                          className="text-xl sm:text-2xl font-black text-[#00F59B] tracking-tight inline-block"
                          variants={priceVariants}
                        >
                          {formatPrice(srv.rawPrice)}
                        </motion.span>
                      </div>
                      <div className="flex items-center space-x-1 text-[9px] font-bold text-gray-400">
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">PS5 / PS4</span>
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">XBOX</span>
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">PC</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        onClick={() => {
                          setCurrentPage(srv.page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>CONFIGURE</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          openContactModal({
                            serviceName: srv.title,
                            details: srv.tagline,
                            price: srv.rawPrice,
                            platform: 'ps5',
                          });
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer shadow-md shadow-[#00F59B]/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>ORDER</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
