import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, ArrowRight, Star } from 'lucide-react';

interface WhatsAppWidgetProps {
  navigate: (path: string) => void;
}

export default function WhatsAppWidget({ navigate }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const QUICK_ACTIONS = [
    { label: '🙋 Buy Verified Cars', path: '/buy', text: 'Hi! I want to explore certified cars on ManaUsedCars.' },
    { label: '💰 Sell My Car (Evaluation)', path: '/sell', text: 'Hi! I want to sell my car and enquire about the ₹200 evaluation slot booking.' },
    { label: '🔧 Service & Modification', path: '/service', text: 'Hi! I want to book doorstep servicing / modification.' }
  ];

  const handleActionClick = (item: typeof QUICK_ACTIONS[0]) => {
    // Navigate inside app
    navigate(item.path);
    // Send standard redirect
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(item.text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    
    const finalMsg = `Hi ManaUsedCars Support! ${userMsg}`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
    setUserMsg('');
    setIsOpen(false);
  };

  return (
    <div id="whatsapp-widget-container" className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Button Bubble */}
      <motion.button
        id="whatsapp-bubble-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white p-4 rounded-full shadow-2xl cursor-pointer transition-colors relative"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1.5 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>
        
        {/* custom beautiful WhatsApp SVG icon */}
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.017 14.077 1.01 11.993 1.01 6.556 1.01 2.131 5.38 2.128 10.81c-.001 1.697.452 3.35 1.306 4.823l-.999 3.648 3.743-.981-.131.062z" />
        </svg>

        {/* Text helper beside button on desktop */}
        <span className="hidden sm:inline-block max-w-0 overflow-hidden font-bold text-xs pl-0 hover:max-w-xs transition-all duration-300">
          Chat With Us
        </span>
      </motion.button>

      {/* Expanded chat popover block */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="whatsapp-chat-box"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-18 right-0 w-[320px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-left"
          >
            
            {/* Popover Header */}
            <div className="bg-emerald-600 text-white p-5 pr-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-emerald-100 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white/60">
                     🚗
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border border-white"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">ManaUsedCars Support</h4>
                  <p className="text-[10px] text-emerald-100">Typically replies immediately</p>
                </div>
              </div>
            </div>

            {/* Chat message body scroll segment */}
            <div className="p-4 bg-slate-50 space-y-4 max-h-[350px] overflow-y-auto">
              
              {/* Automated initial bubble */}
              <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl text-[11px] text-slate-700 leading-normal max-w-[90%]">
                <span className="font-semibold block text-slate-900 border-b border-slate-100 pb-1.5 mb-1.5">
                  Namaste! 🙏
                </span>
                Welcome to **ManaUsedCars**. We guarantee certified used cars with refundable evaluation options. How can we serve you?
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="space-y-2">
                <p className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider pl-1">
                  Select Quick Action
                </p>
                {QUICK_ACTIONS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleActionClick(item)}
                    className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 transition-all flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

            </div>

            {/* Input typing footer bar */}
            <form onSubmit={handleCustomSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl cursor-pointer transition-colors"
                aria-label="Send WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Verification marker */}
            <div className="bg-slate-100 py-1.5 px-3 text-center text-[9px] text-slate-400 font-mono">
              ★ Guaranteed 100% Secure Chat
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
