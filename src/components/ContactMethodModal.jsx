import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { X, MessageSquare, ArrowRight, Check, ExternalLink, ShieldCheck, Sparkles, Copy, AlertCircle } from 'lucide-react';

export default function ContactMethodModal() {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    activeOrderForContact,
    createOrder,
    openTrackerWithId,
    showToast,
    user,
    formatPrice,
    currentCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'discord'
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState(null);

  const WHATSAPP_BUSINESS_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '1234567890';
  const DISCORD_COMMUNITY_INVITE_URL = import.meta.env.VITE_DISCORD_COMMUNITY_INVITE_URL || 'https://discord.gg/boostinghaven';
  const DISCORD_BOT_CHANNEL_URL = import.meta.env.VITE_DISCORD_BOT_CHANNEL_URL || 'https://discord.com/channels/@me';

  // Generate unique order reference code
  const orderRef = createdOrderRef || `BH-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  const serviceName = activeOrderForContact?.serviceName || 'EA Sports FC Boost';
  const platform = (activeOrderForContact?.platform || 'PS5').toUpperCase();
  const formattedPriceString = formatPrice(activeOrderForContact?.price || 0, true);

  // Construct WhatsApp Prefilled Message
  const prefilledWhatsAppMessage = `Hello Boosting Haven team! 🎮

I would like to place an order:
• Service: ${serviceName}
• Platform: ${platform}
• Price: ${formattedPriceString}
• Order Reference: ${orderRef}
• Client: ${user ? user.name : 'Guest Customer'}

Please confirm booster availability and let's proceed with payment & setup. Thank you!`;

  const encodedWhatsAppUrl = `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(prefilledWhatsAppMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledWhatsAppMessage);
    setIsCopied(true);
    showToast('Order details copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleContinueWithWhatsApp = async () => {
    if (!activeOrderForContact) return;
    setIsSubmitting(true);
    try {
      // 1. Create order in persistent storage / SQL Server backend
      const orderPayload = {
        id: orderRef,
        userId: user ? user.id : 'guest',
        customerName: user ? user.name : 'WhatsApp Customer',
        customerEmail: user ? user.email : 'whatsapp_order@customer.com',
        gamerTag: 'Pending via WhatsApp Chat',
        serviceName: activeOrderForContact.serviceName,
        details: activeOrderForContact.details || 'Initiated via Official WhatsApp',
        price: Number(activeOrderForContact.price),
        platform: activeOrderForContact.platform || 'ps5',
        paymentMethod: 'WhatsApp Direct Pay',
        contactMethod: 'WhatsApp',
        whatsAppReference: orderRef,
      };

      await createOrder(orderPayload);
      setCreatedOrderRef(orderRef);
      showToast(`Order #${orderRef} created! Opening WhatsApp...`, 'success');

      // 2. Open official WhatsApp conversation in new window/tab
      window.open(encodedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Error registering order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithDiscord = async (actionType = 'bot') => {
    if (!activeOrderForContact) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        id: orderRef,
        userId: user ? user.id : 'guest',
        customerName: user ? user.name : 'Discord Customer',
        customerEmail: user ? user.email : 'discord_order@customer.com',
        gamerTag: user?.discordTag || 'Pending via Discord Ticket',
        serviceName: activeOrderForContact.serviceName,
        details: activeOrderForContact.details || 'Initiated via Discord Community Bot',
        price: Number(activeOrderForContact.price),
        platform: activeOrderForContact.platform || 'ps5',
        paymentMethod: 'Discord Ticket / Crypto / Card',
        contactMethod: 'Discord',
        discordTicketId: orderRef,
      };

      await createOrder(orderPayload);
      setCreatedOrderRef(orderRef);

      if (actionType === 'invite') {
        window.open(DISCORD_COMMUNITY_INVITE_URL, '_blank', 'noopener,noreferrer');
        showToast(`Joined Discord? Use Order #${orderRef} in the #order-here channel`, 'info');
      } else {
        // Direct to Discord Bot channel / Webhook
        window.open(DISCORD_BOT_CHANNEL_URL, '_blank', 'noopener,noreferrer');
        showToast(`Opening Discord Bot with Order #${orderRef}...`, 'success');
      }
    } catch {
      showToast('Error registering Discord order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isContactModalOpen && activeOrderForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none font-sans overflow-y-auto">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-7 shadow-2xl relative z-10 flex flex-col space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-[10px] sm:text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Select Preferred Contact Method</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Order Confirmation & Support
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Choose how you would like to communicate with our verified boosting managers.
              </p>
            </div>

            {/* Selected Service Recap Card */}
            <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00F59B]">
                  Selected Service
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white">{serviceName}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-1">{activeOrderForContact?.details || 'Standard Configuration'}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Total</span>
                <span className="text-lg sm:text-xl font-black text-[#00F59B]">
                  {formatPrice(activeOrderForContact?.price || 0)} <span className="text-[10px] text-gray-300 font-mono">{currentCurrency.code}</span>
                </span>
              </div>
            </div>

            {/* Contact Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* WhatsApp Tab Button */}
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[44px] ${
                  activeTab === 'whatsapp'
                    ? 'bg-[#0B0D13] border-[#25D366] text-white shadow-lg shadow-[#25D366]/10'
                    : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    WhatsApp
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug line-clamp-2">
                  Instant 1-on-1 direct chat with our desk.
                </p>
                {activeTab === 'whatsapp' && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
                )}
              </button>

              {/* Discord Tab Button */}
              <button
                onClick={() => setActiveTab('discord')}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[44px] ${
                  activeTab === 'discord'
                    ? 'bg-[#0B0D13] border-[#5865F2] text-white shadow-lg shadow-[#5865F2]/10'
                    : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    Discord
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug line-clamp-2">
                  Private ticketing & live match stream.
                </p>
                {activeTab === 'discord' && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#5865F2] shadow-[0_0_8px_#5865F2]" />
                )}
              </button>
            </div>

            {/* TAB CONTENT: WHATSAPP */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-3.5 bg-[#0B0D13] p-4 sm:p-5 rounded-2xl border border-[#262B3D]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    <span>WhatsApp Support Desk</span>
                  </div>
                  <span className="text-[11px] text-[#25D366] font-bold">Online 24/7</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Clicking below will automatically create your order and open a verified WhatsApp conversation with our 24/7 operations team with all your details pre-filled.
                </p>

                {/* Prefilled message preview box */}
                <div className="relative">
                  <div className="bg-[#141824] border border-[#262B3D] rounded-xl p-3 text-[11px] font-mono text-gray-300 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-line select-text">
                    {prefilledWhatsAppMessage}
                  </div>
                  <button
                    onClick={handleCopyMessage}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-[10px] font-bold text-gray-300 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#00F59B]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* WhatsApp Action Button */}
                <button
                  onClick={handleContinueWithWhatsApp}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Registering Order...' : 'Continue to WhatsApp Chat →'}</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Official Verified Business Number</span>
                  </span>
                  <span>Avg reply: 45 sec</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DISCORD */}
            {activeTab === 'discord' && (
              <div className="space-y-3.5 bg-[#0B0D13] p-4 sm:p-5 rounded-2xl border border-[#262B3D]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#5865F2] animate-pulse" />
                    <span>Discord Community & Ticketing</span>
                  </div>
                  <span className="text-[11px] text-[#5865F2] font-bold">12,500+ Members</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Join our official Discord server to get an automated private ticket channel created for your order with live screen-share stream of your matches.
                </p>

                {/* Order ID banner for reference */}
                <div className="bg-[#141824] border border-[#262B3D] p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Your Order Reference</span>
                    <span className="text-xs font-mono font-black text-[#00F59B]">{orderRef}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orderRef);
                      showToast('Order reference copied!', 'success');
                    }}
                    className="p-1.5 rounded-lg bg-[#1C2234] hover:bg-[#262B3D] text-gray-300 text-xs font-bold"
                  >
                    Copy Ref
                  </button>
                </div>

                {/* 2 Discord Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleContinueWithDiscord('bot')}
                    disabled={isSubmitting}
                    className="py-3 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-[#5865F2]/20 cursor-pointer disabled:opacity-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Bot Channel</span>
                  </button>

                  <button
                    onClick={() => handleContinueWithDiscord('invite')}
                    disabled={isSubmitting}
                    className="py-3 px-3 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#5865F2]" />
                    <span>Join Server Invite</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#5865F2] shrink-0" />
                  <span>Once in Discord, paste your Order Reference in the #order-here channel to automatically claim your private booster ticket.</span>
                </div>
              </div>
            )}

            {/* Bottom Status / Tracker Shortcut */}
            <div className="pt-2 border-t border-[#262B3D] flex items-center justify-between text-xs text-gray-400">
              <span className="text-[11px]">
                Order Reference: <strong className="text-white font-mono">{orderRef}</strong>
              </span>

              {user?.category === 'Admin' || user?.category === 'A' ? (
                <button
                  onClick={() => {
                    setIsContactModalOpen(false);
                    openTrackerWithId(orderRef);
                  }}
                  className="text-red-400 font-bold hover:underline cursor-pointer text-xs"
                >
                  Admin Tracker →
                </button>
              ) : (
                <span className="text-[#00F59B] font-bold">
                  ✓ Priority Pro Queue Assigned
                </span>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
