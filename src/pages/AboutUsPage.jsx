import { useApp } from '../context/AppContext';
import { ShieldCheck, Trophy, Zap, Users, Target, Lock, Award, ArrowRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function AboutUsPage() {
  const { setCurrentPage, openContactModal } = useApp();

  const stats = [
    { label: 'Orders Completed', value: '25,000+', icon: Trophy, color: 'text-[#00F59B]' },
    { label: 'Customer Rating', value: '4.9 / 5.0', icon: Award, color: 'text-[#FFB800]' },
    { label: 'Account Bans', value: '0 (100% Safe)', icon: ShieldCheck, color: 'text-[#00F59B]' },
    { label: 'Avg Assignment', value: '15 Mins', icon: Zap, color: 'text-[#00D6FF]' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Ban-Free VPN Stealth',
      description: 'We developed proprietary regional IP routing that precisely matches your physical country, city, and console hardware ID. Your account never triggers suspicious login flags.',
      badge: 'Zero Risk Protocol',
    },
    {
      icon: Trophy,
      title: 'Top 200 Esports Pro Players',
      description: 'Every booster on our team must pass a rigorous 50-match trial with an 85%+ win rate against Elite Division opponents. No casual players, only tournament-tested competitors.',
      badge: 'Verified Pros Only',
    },
    {
      icon: Lock,
      title: 'Discretion & Pack Safety',
      description: 'We treat your Ultimate Team club like our own. Your players, coins, and consumables are never altered. All match and rank reward packs remain sealed in your store.',
      badge: 'Pack Guarantee',
    },
    {
      icon: Users,
      title: 'Transparent 24/7 Communication',
      description: 'Track your live match progress in real-time. Communicate directly with your assigned booster or management desk via dedicated private Discord tickets and WhatsApp.',
      badge: 'Instant Live Desk',
    },
  ];

  const teamMembers = [
    {
      name: 'Alex "Kaiser"',
      role: 'Head of Operations & Rank 1 Specialist',
      experience: 'Top 64 Global Esports Contender • 15-0 Weekend League Specialist',
      specialty: 'UT Champions & High-Pressure Finishing',
      avatar: 'K',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      name: 'Tariq "Flash"',
      role: 'Lead Coaching Director & Elite Division Pro',
      experience: '7x Consecutive Elite Division Champion • 2,200+ SR Rating',
      specialty: 'Defense Clinics & Right-Stick Switching',
      avatar: 'F',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      name: 'Lucas "Maestro"',
      role: 'Tactical Meta Architect & Squad Analyst',
      experience: 'Pro Analyst for European Esports Rosters • Meta Formation Pioneer',
      specialty: 'Custom Tactics 4-3-2-1 & Controlled Sprint Meta',
      avatar: 'M',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      name: 'David "Vortex"',
      role: 'PC & Console Performance Lead',
      experience: 'Competitive PC Qualifier • Top 100 Global Rankings',
      specialty: 'Cross-Platform Optimization & Anti-Cheat Compliance',
      avatar: 'V',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
  ];

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none opacity-20 overflow-hidden">
            <img
              src={getAssetUrl('images/stadium-bg.jpg')}
              alt="FC Stadium Atmosphere"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/80 to-transparent" />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT FC BOOST PRO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              Built by Pro Competitors, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#85FFBD] to-white">
                Engineered for Your Glory
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl">
              FC BOOST PRO was founded with a singular mission: to provide EA Sports FC players with the safest, fastest, and most transparent boosting and coaching experience in competitive gaming.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setCurrentPage('ut-champions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-[#00F59B]/20"
              >
                <span>Explore Boost Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentPage('coaching');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer hover:border-[#00F59B]/40"
              >
                <span>Book 1-on-1 Coaching</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 sm:p-6 space-y-2 flex flex-col justify-between shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-black ${stat.color} tracking-tight`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Story / Who We Are Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#141824]/40 border border-[#262B3D] rounded-3xl p-6 sm:p-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// THE FC BOOST PRO STORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Why We Revolutionized the Boosting Industry
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              For years, EA Sports FC and FIFA players had to endure risky, unverified boosting services operated on foreign IP addresses with zero account safety guarantees. Too many players faced suspensions or ruined squads from careless providers.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              We decided to do things completely differently. We assembled a core team of verified esports qualifiers, partnered with high-speed residential VPN networks, and created a transparent platform where customers can track match-by-match results in real time or join our pro coaches via private Discord screen shares.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-200 bg-[#0B0D13] p-3 rounded-xl border border-[#262B3D]">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B] shrink-0" />
                <span>Strict Residential VPN Protocol</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-200 bg-[#0B0D13] p-3 rounded-xl border border-[#262B3D]">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B] shrink-0" />
                <span>Zero Pack Opening Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-200 bg-[#0B0D13] p-3 rounded-xl border border-[#262B3D]">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B] shrink-0" />
                <span>Private 1-on-1 Discord Tickets</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-200 bg-[#0B0D13] p-3 rounded-xl border border-[#262B3D]">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B] shrink-0" />
                <span>24/7 Dedicated Support Agents</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#262B3D] shadow-2xl">
              <img
                src={getAssetUrl('images/player-celebration.jpg')}
                alt="Pro Esports Celebration"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-transparent to-black/30" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#141824]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#262B3D]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#00F59B] font-black uppercase">Esports Standards</span>
                    <h4 className="text-xs font-black text-white uppercase">Rank 1 Guaranteed Excellence</h4>
                  </div>
                  <span className="text-xs font-black text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded border border-[#FFB800]/30">
                    TOP 200
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// OUR CORE PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              The Four Pillars of Customer Trust
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Every single order is backed by these non-negotiable security and quality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#00F59B] group-hover:border-[#00F59B]/50 transition-colors">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00F59B] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meet The Pro Roster */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              /// ELITE ROSTER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Meet Our Lead Competitors & Coaches
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Tournament champions and rank 1 regulars dedicated to elevating your game.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-[#141824] border border-[#262B3D] rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#00F59B]/40 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-black text-lg ${member.color}`}>
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">{member.name}</h4>
                      <span className="text-[10px] text-[#00F59B] font-bold block">{member.role}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {member.experience}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262B3D]/70 text-[11px]">
                  <span className="text-gray-500 font-bold block uppercase text-[9px]">Specialty:</span>
                  <span className="text-gray-200 font-medium">{member.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready to Order CTA */}
        <div className="bg-gradient-to-r from-[#181C28] via-[#141824] to-[#181C28] border border-[#00F59B]/30 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Ready to Experience Elite FC Boosting?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Join thousands of satisfied players across PlayStation, Xbox, and PC. Safe, fast, and 100% ban-free.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentPage('ut-champions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
            >
              Order UT Champions Boost
            </button>

            <button
              onClick={() => {
                openContactModal({
                  serviceName: 'Custom Boost Consultation',
                  details: 'Direct consultation with FC BOOST PRO Operations desk',
                  price: 0,
                  platform: 'ps5',
                });
              }}
              className="px-8 py-3.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Contact Support Desk
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}