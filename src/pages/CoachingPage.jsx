import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Trophy,
  Zap,
  Check,
  Star,
  Shield,
  ArrowRight,
  Headphones,
  Video,
  Target,
  Sparkles,
  Layers,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function CoachingPage() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState('ps5');
  const [selectedPackageId, setSelectedPackageId] = useState('package-2');

  const platforms = [
    { id: 'ps5', name: 'PlayStation 5 / 4' },
    { id: 'xbox', name: 'Xbox Series X/S' },
    { id: 'pc', name: 'PC (EA App / Steam)' },
  ];

  const packages = [
    {
      id: 'package-1',
      title: 'Tactical Audit & Setup',
      duration: '1 Hour Session',
      price: 29.99,
      badge: 'STARTER',
      badgeColor: 'bg-gray-800 text-gray-300 border-gray-700',
      description: 'Ideal for players looking to fix their formation, camera settings, and fundamentals.',
      features: [
        'Custom tactics & formation tailored to your team',
        'Camera, controller & right-stick switching setup',
        'Attacking & defending basics audit',
        '1 live gameplay match with live commentary',
        'Discord voice + HD 1080p screen share',
      ],
      popular: false,
    },
    {
      id: 'package-2',
      title: 'Weekend League Masterclass',
      duration: '2 Hours Session',
      price: 49.99,
      badge: 'MOST POPULAR',
      badgeColor: 'bg-[#00F59B] text-[#0B0D13]',
      description: 'The definitive competitive bootcamp. Learn to win tight games and climb 2-4 ranks in Champions.',
      features: [
        'Complete tactical blueprint (4-3-2-1 / 4-4-2 meta)',
        'Defending clinic: jockeying & second-man press',
        'Attacking clinic: controlled sprint & driven passes',
        '3 live coached matches in Rivals or Champions',
        'Comprehensive post-session written feedback & guide',
        'Discord voice + HD 1080p screen share',
      ],
      popular: true,
    },
    {
      id: 'package-3',
      title: 'Elite Division Intensive',
      duration: '5 Hours Bootcamp',
      price: 99.99,
      badge: 'BEST VALUE',
      badgeColor: 'bg-[#FFB800] text-[#0B0D13]',
      description: 'Transform into an Elite Division caliber player with multi-day 1-on-1 sparring and deep analysis.',
      features: [
        'Can be split across 2 or 3 separate days',
        'Deep-dive VOD review of your past losses',
        '1v1 sparring games directly against pro coach',
        'Advanced skill cancels & timed finishing mechanics',
        'Squad building & coin optimization advice',
        '7-day direct WhatsApp access to your pro coach',
      ],
      popular: false,
    },
    {
      id: 'package-4',
      title: 'Esports Road to Pro Mentorship',
      duration: '10 Hours Season Pass',
      price: 179.99,
      badge: 'TOP TIER',
      badgeColor: 'bg-[#FF3B30] text-white',
      description: 'Comprehensive seasonal mentorship with guaranteed rank improvement and weekly scheduled check-ins.',
      features: [
        'Full 10 hours flexible scheduling across the month',
        'Guaranteed Rank 1-3 Champions milestone progression',
        'Unlimited replay / VOD reviews between sessions',
        'Priority booking with Top 50 Global esports coach',
        'Private 1-on-1 Discord channel with 24/7 coach hotline',
        'Free bonus session if rank milestone is not achieved',
      ],
      popular: false,
    },
  ];

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];

  const handleAddToCart = (directCheckout = false) => {
    addToCart({
      serviceId: `coaching-${selectedPkg.id}-${Date.now()}`,
      serviceName: `Pro Coaching: ${selectedPkg.title} (${selectedPkg.duration})`,
      details: `${selectedPkg.duration} • Platform: ${selectedPlatform.toUpperCase()} • 1-on-1 Discord Screen Share`,
      price: selectedPkg.price,
      platform: selectedPlatform,
    });

    if (directCheckout) {
      setIsCartOpen(true);
    }
  };

  const handleOrderDirect = () => {
    openContactModal({
      serviceName: `Pro Coaching: ${selectedPkg.title} (${selectedPkg.duration})`,
      details: `${selectedPkg.description} • Platform: ${selectedPlatform.toUpperCase()}`,
      price: selectedPkg.price,
      platform: selectedPlatform,
    });
  };

  const studentReviews = [
    {
      name: 'Harvey R.',
      rankImprovement: 'Rank 5 (11 Wins) → Rank 2 (14 Wins)',
      comment: 'Coaching changed how I defend completely. Learned right-stick switching and controlled sprint properly. Went from struggling in Div 3 to hitting 14 wins in Weekend League!',
      coach: 'Coach Kaiser',
      platform: 'PS5',
    },
    {
      name: 'Daniel M.',
      rankImprovement: 'Div 4 → Elite Division',
      comment: 'Did the 5-hour bootcamp with Flash. His breakdown of the 4-3-2-1 formation and how to beat counter-press was unbelievable. Best investment in gaming I’ve made.',
      coach: 'Coach Flash',
      platform: 'PC',
    },
    {
      name: 'Sami K.',
      rankImprovement: '9 Wins → 15-0 Flawless',
      comment: 'I thought I was just getting unlucky with 90th minute goals until Maestro showed me how to control the tempo. Screen share on Discord was super clear and easy.',
      coach: 'Coach Maestro',
      platform: 'Xbox',
    },
  ];

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none opacity-25 overflow-hidden">
            <img
              src={getAssetUrl('images/rivals-action.jpg')}
              alt="FC 25 Competitive Gameplay"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/80 to-transparent" />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#C084FC] text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>1-ON-1 PRO COACHING MASTERCLASS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              Stop Conceding Cheap Goals. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#85FFBD] to-white">
                Learn to Play Like a Pro.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl">
              Get personalized 1-on-1 coaching from Top 200 esports competitors over private Discord voice & 1080p screen share. Fix your mistakes, master the meta tactics, and unlock your true potential.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleOrderDirect}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-[#00F59B]/20"
              >
                <span>Book Instant Coaching Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('pricing-packages');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer hover:border-[#00F59B]/40"
              >
                <span>View Packages & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* What You Will Learn - 4 Feature Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// COACHING CURRICULUM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Four Areas Where We Will Transform Your Game
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Every session is customized to your exact skill level, from Division 5 casuals to Elite Division contenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-3 hover:border-[#00F59B]/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#00F59B]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase">Attacking Meta</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Master controlled sprint triggers, precision driven ground passes, stepover acceleration bursts, and timed finishing.
              </p>
            </div>

            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-3 hover:border-[#00F59B]/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#FFB800]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase">Defensive Wall</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Fix over-committing with CBs, right-stick switching discipline, second-man press activation, and manual jockey positioning.
              </p>
            </div>

            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-3 hover:border-[#00F59B]/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#00D6FF]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase">Custom Tactics Blueprint</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive the exact 4-3-2-1 and 4-4-2 tactics used by Top 64 global players, tailored specifically to your club's players.
              </p>
            </div>

            <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-3 hover:border-[#00F59B]/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#FF3B30]">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase">Live Match VOD Review</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Screen share on Discord while our coach pauses key sequences to highlight your mistakes and show alternative winning plays.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Packages Grid */}
        <div id="pricing-packages" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// PACKAGES & PRICING
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Select Your 1-on-1 Coaching Program
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              All sessions include private 1-on-1 Discord voice, HD screen sharing, and post-session tactical homework.
            </p>
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#141824] border border-[#262B3D] gap-1">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPlatform === p.id
                      ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`bg-[#141824] rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative cursor-pointer border shadow-xl ${
                    isSelected
                      ? 'border-[#00F59B] ring-2 ring-[#00F59B]/30 -translate-y-1'
                      : 'border-[#262B3D] hover:border-[#262B3D]/80 hover:border-gray-500'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-bold text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#00F59B]" />
                      <span>{pkg.duration}</span>
                    </span>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 min-h-[36px]">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-black text-[#00F59B]">${pkg.price}</span>
                        <span className="text-xs text-gray-400 font-bold">USD</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-4 border-t border-[#262B3D]/80 text-xs text-gray-300">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#00F59B] shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-4 border-t border-[#262B3D] space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackageId(pkg.id);
                        handleOrderDirect();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1 shadow-md shadow-[#00F59B]/10 cursor-pointer"
                    >
                      <span>ORDER VIA WHATSAPP / DISCORD</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackageId(pkg.id);
                          handleAddToCart(false);
                        }}
                        className="py-2 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer text-center"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackageId(pkg.id);
                          handleAddToCart(true);
                        }}
                        className="py-2 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Testimonials */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// VERIFIED RESULTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Real Improvements from Real Students
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Read how players elevated their rank within their first session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#141824] border border-[#262B3D] rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{rev.name}</span>
                    <div className="flex items-center space-x-1 text-[#FFB800]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                      ))}
                    </div>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-bold">
                    🚀 {rev.rankImprovement}
                  </div>

                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262B3D]/70 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Coach: <strong className="text-white">{rev.coach}</strong></span>
                  <span className="bg-[#0B0D13] px-2 py-0.5 rounded border border-[#262B3D] text-[10px] font-bold text-gray-300">
                    {rev.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching FAQ */}
        <div className="bg-[#141824]/60 border border-[#262B3D] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// FREQUENTLY ASKED
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Coaching Questions & Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5 p-4 rounded-xl bg-[#0B0D13] border border-[#262B3D]">
              <h4 className="font-bold text-white text-sm">How does the coaching session take place?</h4>
              <p className="text-gray-400 leading-relaxed">
                Sessions take place 1-on-1 on Discord. You share your screen in 1080p 60FPS while speaking with your coach. You can play live online matches while the coach guides your decision making in real time.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#0B0D13] border border-[#262B3D]">
              <h4 className="font-bold text-white text-sm">Can I split the hours across multiple days?</h4>
              <p className="text-gray-400 leading-relaxed">
                Yes! For the 5-hour and 10-hour packages, you can split sessions across multiple days or weekends whenever fits your schedule best.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#0B0D13] border border-[#262B3D]">
              <h4 className="font-bold text-white text-sm">What if I don't have an expensive squad?</h4>
              <p className="text-gray-400 leading-relaxed">
                That’s totally fine. Our coaches will audit your team, teach you cheap meta alternatives, and design custom tactics that maximize your budget.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#0B0D13] border border-[#262B3D]">
              <h4 className="font-bold text-white text-sm">How soon can we start after ordering?</h4>
              <p className="text-gray-400 leading-relaxed">
                Coaches are online 24/7. Most sessions can be scheduled within 30 minutes of payment, or pre-booked for any specific evening or weekend.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}