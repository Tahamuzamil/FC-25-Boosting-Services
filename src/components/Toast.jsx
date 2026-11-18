import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
          className="fixed bottom-24 left-1/2 z-[100] max-w-md w-[90%] sm:w-auto"
        >
          <div
            className={`px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center space-x-3 text-sm font-bold backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-[#141824]/95 border-[#00F59B]/50 text-white shadow-lg shadow-[#00F59B]/20'
                : toast.type === 'error'
                ? 'bg-[#141824]/95 border-[#FF3B30]/50 text-white shadow-lg shadow-[#FF3B30]/20'
                : 'bg-[#141824]/95 border-[#262B3D] text-gray-200 shadow-xl'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00F59B] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
