import { useApp } from '../context/AppContext';
import { Trophy, Zap, Shield, Sparkles, ArrowRight, Star, Check, Settings } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function FeaturedServicesGrid() {
  const { setCurrentPage, openContactModal } = useApp();

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
      title: 'DIVISION RIVALS PROMOTION',
      tagline: 'Climb from Div 10 all the way to Elite Division. Get the rank you want, fast and safe.',
      image: getAssetUrl('images/rivals-action.jpg'),
      badge: 'DIVISION RIVALS',
      badgeIcon: Shield,
      badgeColor: 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40',
      price: '$19.99',
      rawPrice: 19.99,
      rating: 4.9,
      features: [
        'All Ranks (Div 10 → Elite)',
        '100% Regional Ban-Free VPN',
        'Guaranteed Progression',
        '24/7 Support',
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
      page: 'all-services',
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

  return (
    <section className="w-full py-12 sm:py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262B3D] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#00F59B]">
              <span className="text-[#00F59B] font-mono">///</span>
              <span>OFFICIAL EA SPORTS FC 25 PACKAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Featured Pro Boosting Services
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              Choose your competitive mode below. Every service is fulfilled by verified Top 200 esports players with strict regional VPN stealth.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('all-services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-white uppercase tracking-wider inline-flex items-center space-x-2 transition-all hover:border-[#00F59B]/40 cursor-pointer"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Card Picture Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((srv) => {
            const BadgeIcon = srv.badgeIcon;
            return (
              <div
                key={srv.id}
                className="bg-[#141824] hover:bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-[#00F59B]/5 hover:-translate-y-1"
              >
                {/* Card Picture Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080A0F]">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-black/40" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg inline-flex items-center space-x-1 backdrop-blur-md ${srv.badgeColor}`}>
                      <BadgeIcon className="w-3 h-3 shrink-0" />
                      <span>{srv.badge}</span>
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FFB800] border border-white/10">
                    <Star className="w-3 h-3 fill-[#FFB800]" />
                    <span>{srv.rating}</span>
                  </div>
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
                        <span className="text-xl sm:text-2xl font-black text-[#00F59B] tracking-tight">
                          {srv.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[9px] font-bold text-gray-400">
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">PS5 / PS4</span>
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">XBOX</span>
                        <span className="bg-[#0B0D13] px-1.5 py-0.5 rounded border border-[#262B3D]">PC</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage(srv.page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>CONFIGURE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          openContactModal({
                            serviceName: srv.title,
                            details: srv.tagline,
                            price: srv.rawPrice,
                            platform: 'ps5',
                          });
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer shadow-md shadow-[#00F59B]/10"
                      >
                        <span>ORDER</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
