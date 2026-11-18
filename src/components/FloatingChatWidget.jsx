import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'support', text: 'Hello! Welcome to Boosting Haven. How can we help upgrade your team today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const { openTrackerWithId, user } = useApp();
  const isAdmin = (user?.category || user?.role || '').toLowerCase() === 'admin' || (user?.category || user?.role || '').toLowerCase() === 'a';
  const chatRef = useRef(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');

    // Simulate smart support reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: 'Thank you for reaching out! A pro manager will join this chat in ~30 seconds. For urgent assistance or custom quotes, ping our WhatsApp desk or Discord community.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 sm:z-50 select-none font-sans flex flex-col items-end">
      
      <AnimatePresence mode="wait">
        {/* Floating Chat Box Window (When Open) */}
        {isOpen ? (
          <motion.div
            key="chat-window-open"
            ref={chatRef}
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-[calc(100vw-24px)] max-w-[380px] bg-[#141824] border border-[#262B3D] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[420px] sm:h-[490px]"
          >
            {/* Header */}
            <div className="bg-[#0B0D13] p-4 border-b border-[#262B3D] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] flex items-center justify-center font-black text-sm"
                  >
                    BH
                  </motion.div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00F59B] ring-2 ring-[#0B0D13]" />
                </div>

                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    Boosting Haven Support
                  </h4>
                  <div className="flex items-center space-x-1 text-[10px] text-[#00F59B]">
                    <motion.span
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#00F59B]"
                    />
                    <span>Online • Avg reply &lt; 1 min</span>
                  </div>
                </div>
              </div>

              {/* Single, Sleek Header Close Button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-xl bg-[#1C2234] border border-[#262B3D] hover:border-gray-500 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[#0D101A] px-3.5 py-2 border-b border-[#262B3D] flex items-center justify-between text-[11px]">
              {isAdmin ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openTrackerWithId();
                  }}
                  className="text-red-400 font-bold hover:underline"
                >
                  🔍 Admin Tracker
                </button>
              ) : (
                <span className="text-[#00F59B] font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Online Support Desk</span>
                </span>
              )}
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '923325195882'}`}
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-[#00F59B]" />
                <span>WhatsApp Direct</span>
              </a>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0B0D13]/60 text-xs">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#00F59B] text-[#0B0D13] font-semibold rounded-br-none'
                        : 'bg-[#1C2234] text-gray-200 border border-[#262B3D] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0B0D13] border-t border-[#262B3D] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about prices, VPN, or orders..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-[#141824] border border-[#262B3D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F59B]"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-[#00F59B]/20"
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </form>

          </motion.div>
        ) : (
          /* Floating Action Trigger Button (When Closed) */
          <motion.button
            key="chat-trigger-button"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: 1,
              scale: 1,
              boxShadow: [
                '0 0 20px rgba(0,245,155,0.25)',
                '0 0 35px rgba(0,245,155,0.45)',
                '0 0 20px rgba(0,245,155,0.25)',
              ],
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              duration: 0.2,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] shadow-2xl shadow-[#00F59B]/35 flex items-center justify-center cursor-pointer relative group"
            aria-label="Open Live Chat"
          >
            <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF3B30] rounded-full border-2 border-[#0B0D13] shadow-md animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
