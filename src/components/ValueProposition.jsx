import { Trophy, Clock, ShieldCheck, DollarSign, Headphones, Check } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const headerVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const guaranteedVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.3 },
  },
};

export default function ValueProposition() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const valueItems = [
    {
      icon: Trophy,
      title: 'Pro FC Players',
      highlight: 'Top 200 Verified Only',
      desc: 'Our boosters are verified FIFA Global Series competitors, elite division veterans, and top 200 leaderboard players.',
      color: 'text-[#FFB800]',
      bgColor: 'bg-[#FFB800]/10',
      borderColor: 'border-[#FFB800]/20',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      highlight: 'Starts in 15–30 Mins',
      desc: 'No waiting days for your boost. Orders are matched with available pro boosters immediately after payment confirmation.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: ShieldCheck,
      title: 'Maximum Security',
      highlight: '100% Ban-Free Record',
      desc: 'Every session runs through dedicated, platform-specific premium VPNs matching your exact country, city, and IP subnet.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      highlight: 'Zero Hidden Fees',
      desc: 'Transparent pricing with tax covered, volume discounts, and guaranteed rewards. We match or beat any verified competitor price.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      highlight: 'Instant Live Chat',
      desc: 'Direct communication with our operations desk and your assigned booster. Real-time updates every match with screenshots.',
      color: 'text-[#FF3B30]',
      bgColor: 'bg-[#FF3B30]/10',
      borderColor: 'border-[#FF3B30]/20',
    },
  ];

  return (
    <section id="why-us" className="relative w-full py-16 sm:py-24 bg-[#0B0D13] select-none font-sans overflow-hidden" ref={sectionRef}>
      
      {/* Dynamic Animated Background: Tactical Pitch Blueprint, Floating Neon Orbs & Stadium Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* 1. Tactical Soccer Pitch Blueprint Line Art (Animated Center Circle & Passing Arcs) */}
        <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center">
          <svg className="w-[1400px] h-[700px] max-w-none text-[#00F59B]" viewBox="0 0 1200 600" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Center Circle & Line */}
            <circle cx="600" cy="300" r="110" strokeDasharray="6 6" className="animate-[spin_90s_linear_infinite]" />
            <circle cx="600" cy="300" r="4" fill="currentColor" />
            <line x1="600" y1="20" x2="600" y2="580" strokeDasharray="8 8" />
            
            {/* Outer Boundary */}
            <rect x="40" y="20" width="1120" height="560" rx="16" />
            
            {/* Left Penalty Box & Goal Area */}
            <rect x="40" y="140" width="190" height="320" />
            <rect x="40" y="210" width="70" height="180" />
            <path d="M 230 240 A 80 80 0 0 1 230 360" />
            <circle cx="170" cy="300" r="3" fill="currentColor" />
            
            {/* Right Penalty Box & Goal Area */}
            <rect x="970" y="140" width="190" height="320" />
            <rect x="1090" y="210" width="70" height="180" />
            <path d="M 970 240 A 80 80 0 0 0 970 360" />
            <circle cx="1030" cy="300" r="3" fill="currentColor" />

            {/* Tactical Curved Passing Trajectory Line */}
            <path d="M 230 200 Q 600 80 970 200" strokeDasharray="6 6" stroke="#00D6FF" strokeWidth="2" opacity="0.4" />
            <path d="M 230 400 Q 600 520 970 400" strokeDasharray="6 6" stroke="#FFB800" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>

        {/* 2. Floating Animated Neon Plasma Orbs (Continuous Multi-Directional Motion) */}
        <motion.div
          animate={{
            x: [-60, 60, -60],
            y: [-30, 40, -30],
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/6 w-[550px] h-[450px] bg-[#00F59B]/12 rounded-full blur-[140px]"
        />

        <motion.div
          animate={{
            x: [50, -50, 50],
            y: [30, -40, 30],
            scale: [1.2, 0.9, 1.2],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-24 right-1/6 w-[600px] h-[500px] bg-[#00D6FF]/12 rounded-full blur-[150px]"
        />

        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -30, 30, 0],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#5865F2]/10 rounded-full blur-[160px]"
        />

        {/* 3. Subtle Cyber Dot Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#00F59B 1px, transparent 1px), radial-gradient(#00D6FF 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
          }}
        />

        {/* 4. Drifting Stadium Particle Sparks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-[#00F59B] to-white"
            style={{
              width: i % 2 === 0 ? '3px' : '4px',
              height: i % 2 === 0 ? '3px' : '4px',
              left: `${12 + i * 11}%`,
              top: `${20 + (i % 4) * 20}%`,
              boxShadow: '0 0 10px #00F59B',
            }}
            animate={{
              y: [-20, -120],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1.2, 0.4],
            }}
            transition={{
              duration: 4.5 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
          />
        ))}

        {/* 5. Smooth Section Boundary Blends */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13] via-transparent to-[#0B0D13]" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            WHY CHOOSE BOOSTING HAVEN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Built For Serious Ultimate Team Players
          </h2>
          <p className="text-sm text-gray-400">
            We deliver the safest, highest-win-rate boosting experience with zero compromises on security.
          </p>
        </motion.div>

        {/* 5-Item Value Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {valueItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="bg-[#141824]/80 backdrop-blur-xl hover:bg-[#1C2234]/90 border border-[#262B3D] hover:border-[#00F59B]/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xl hover:shadow-2xl hover:shadow-[#00F59B]/10"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: '0 20px 40px rgba(0,245,155,0.15)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="space-y-4">
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center shrink-0`}
                    whileHover={{
                      boxShadow: [
                        '0 0 0px rgba(0,245,155,0)',
                        '0 0 15px rgba(0,245,155,0.3)',
                        '0 0 0px rgba(0,245,155,0)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                    </motion.div>
                  </motion.div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5">
                      {item.highlight}
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <motion.div
                  className="pt-4 mt-4 border-t border-[#262B3D]/70 flex items-center space-x-1.5 text-[11px] font-bold text-[#00F59B]"
                  variants={guaranteedVariants}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed Included</span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
