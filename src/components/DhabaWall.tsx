import React, { useState, useEffect } from 'react';
import { MessageSquareText, Send, X, Sparkles } from 'lucide-react';


export interface DhabaMessage {
  id: string;
  name: string;
  vehicle: string;
  message: string;
  badge: string;
  timestamp: string;
}

const INITIAL_MESSAGES: DhabaMessage[] = [
  {
    id: 'msg-1',
    name: 'Gurpreet Singh "Paaji"',
    vehicle: 'Tata 1613 • Punjab (PB 08)',
    message: 'Buri nazar wale tera muah kala! Reached Murthal at 2:30 AM. Fresh cutting chai + paratha with white butter = pure heaven!',
    badge: '🚚 Heavy Driver',
    timestamp: '10 mins ago'
  },
  {
    id: 'msg-2',
    name: 'Rajesh Driver Saab',
    vehicle: 'Leyland Goods • Rajasthan (RJ 14)',
    message: 'Playing Highway Beats 108.4 FM on full volume while cruising through NH 48. Salute to all highway wanderers!',
    badge: '📻 Radio Fan',
    timestamp: '28 mins ago'
  },
  {
    id: 'msg-3',
    name: 'Aniket & Friends',
    vehicle: 'Night Roadtrip Car',
    message: 'Stopped for a quick 3 AM chai break on our Delhi-Manali trip. This place is legendary!',
    badge: '☕ Chai Lover',
    timestamp: '1 hour ago'
  },
  {
    id: 'msg-4',
    name: 'Sardarji Express',
    vehicle: 'NH 44 Regular',
    message: 'Horn OK Please! Use night lamp at night. Keep driving safely brothers.',
    badge: '👑 Highway King',
    timestamp: '3 hours ago'
  }
];

interface DhabaWallProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DhabaWall: React.FC<DhabaWallProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<DhabaMessage[]>(() => {
    const saved = localStorage.getItem('truckers_dhaba_wall');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [text, setText] = useState('');
  const [badge, setBadge] = useState('☕ Chai Lover');

  useEffect(() => {
    localStorage.setItem('truckers_dhaba_wall', JSON.stringify(messages));
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg: DhabaMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim() || 'Anonymous Driver',
      vehicle: vehicle.trim() || 'NH 44 Traveler',
      message: text.trim(),
      badge: badge,
      timestamp: 'Just now'
    };

    setMessages([newMsg, ...messages]);
    setText('');
  };

  const badgeOptions = ['☕ Chai Lover', '🚚 Heavy Driver', '📻 Radio Fan', '👑 Highway King', '🌶️ Mirchi Special'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dhaba-wood border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-500/30 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <MessageSquareText className="w-5 h-5 text-amber-400" />
            <h3 className="font-yatra text-xl text-amber-300 neon-text-orange">
              DHABA WALL OF MEMORIES
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* Post Message Form */}
          <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest font-digital flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LEAVE YOUR MARK ON THE HIGHWAY WALL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name / Handle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Vehicle / Route (e.g. Tata 1613 • NH44)"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Badge Picker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Select Badge:</span>
              {badgeOptions.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(b)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                    badge === b
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a message, quote, or highway story..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>POST TO WALL</span>
              </button>
            </div>
          </form>

          {/* Wall Messages List */}
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="bg-slate-950/90 border border-amber-500/20 rounded-xl p-3.5 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-amber-300 font-yatra">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.vehicle}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                      {m.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 font-kalam leading-relaxed">
                  "{m.message}"
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
