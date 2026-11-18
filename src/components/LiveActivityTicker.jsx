import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Star } from 'lucide-react';

export default function LiveActivityTicker() {
  const liveTickerItems = [
    { id: 1, user: 'K*** (Germany)', service: 'UT Champions 15-0 Rank 1', platform: 'PS5', pro: 'Alex Kaiser', time: 'Just now', price: '$119.99' },
    { id: 2, user: 'M*** (UK)', service: 'Div 4 → Elite Promotion', platform: 'PC', pro: 'Maestro FC', time: '2m ago', price: '$49.99' },
    { id: 3, user: 'L*** (France)', service: '1-on-1 Pro Masterclass (2h)', platform: 'XBOX', pro: 'Vortex Pro', time: '5m ago', price: '$59.99' },
    { id: 4, user: 'D*** (Spain)', service: '1,000,000 Coins Comfort Trade', platform: 'PS5', pro: 'CoinDesk #3', time: '8m ago', price: '$118.00' },
    { id: 5, user: 'S*** (USA)', service: 'UT Champions Rank 2 (14-1)', platform: 'PS5', pro: 'Flash_EA', time: '12m ago', price: '$89.99' },
    { id: 6, user: 'A*** (Italy)', service: '30 Rivals Points Upgraded', platform: 'PC', pro: 'ItalianStallion', time: '15m ago', price: '$59.99' },
    { id: 7, user: 'R*** (Netherlands)', service: 'Champions Play-Offs 5-0', platform: 'PS5', pro: 'Kaiser Pro', time: '19m ago', price: '$29.99' },
    { id: 8, user: 'T*** (Canada)', service: 'Elite Division 2,300+ SR', platform: 'PC', pro: 'Vortex', time: '24m ago', price: '$79.99' },
  ];

  return (
    <div className="w-full bg-[#080A0F] border-y border-[#262B3D]/70 py-3.5 select-none font-sans overflow-hidden relative z-20">
      <div className="flex items-center space-x-3 px-4 sm:px-8 mb-2">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F59B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F59B]"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-white">
            LIVE COMPLETED ORDERS
          </span>
        </div>
        <span className="text-gray-500 text-xs">•</span>
        <span className="text-[10px] text-[#00F59B] font-bold uppercase tracking-wider hidden sm:inline">
          100% Regional VPN Ban-Free Stealth
        </span>
      </div>

      {/* Infinite Scrolling Running Marquee */}
      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex space-x-4 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...liveTickerItems, ...liveTickerItems].map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-[#141824]/90 border border-[#262B3D] text-xs shadow-md hover:border-[#00F59B]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[#00F59B]/15 text-[#00F59B] flex items-center justify-center font-black text-[10px] shrink-0">
                {item.platform}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{item.service}</span>
                <span className="text-gray-500 text-[11px]">•</span>
                <span className="text-gray-400 text-[11px]">{item.user}</span>
                <span className="text-gray-600 text-[11px]">by {item.pro}</span>
              </div>
              <div className="flex items-center space-x-1.5 pl-2 border-l border-[#262B3D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F59B]" />
                <span className="font-black text-[#00F59B] text-[11px]">{item.price}</span>
                <span className="text-[10px] text-gray-500 font-medium">({item.time})</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
