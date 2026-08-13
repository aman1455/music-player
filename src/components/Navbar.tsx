import React, { useState, useEffect } from 'react';
import { Radio, Coffee, Truck, MessageSquareText, Moon, Sun, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, YOUTUBE_PLAYLIST_URL } from '../audio/soundEngine';

interface NavbarProps {
  chaiCount: number;
  onOrderChai: () => void;
  onOpenWall: () => void;
  onOpenMenu: () => void;
  atmosphere: 'dusk' | 'midnight' | 'dawn';
  setAtmosphere: (atm: 'dusk' | 'midnight' | 'dawn') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  chaiCount,
  onOrderChai,
  onOpenWall,
  onOpenMenu,
  atmosphere,
  setAtmosphere
}) => {
  const [truckerCount, setTruckerCount] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setTruckerCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(38, Math.min(54, prev + delta));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleChaiClick = () => {
    soundEngine.playChaiPouringSound();
    onOrderChai();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.15 },
      colors: ['#ff8800', '#ffaa00', '#00a896']
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Truck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-yatra text-xl lg:text-2xl text-amber-400 tracking-wide neon-text-orange">
                TRUCKERS DHABA
              </h1>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full font-digital tracking-widest">
                24/7 YOUTUBE RADIO
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-kalam">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              <span>NH 44 Roadside Lounge & Live YouTube Playlist</span>
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="hidden md:flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">
              <strong className="text-emerald-400 font-digital text-sm">{truckerCount}</strong> Truckers Parked
            </span>
          </div>

          <button
            onClick={handleChaiClick}
            className="flex items-center space-x-2 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full transition-all group"
            title="Click to order cutting chai!"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>
              <strong className="text-amber-400 font-digital text-sm">{chaiCount.toLocaleString()}</strong> Chais Served
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
              +1
            </span>
          </button>
        </div>

        {/* Actions & Links */}
        <div className="flex items-center space-x-2">
          
          {/* Menu Button */}
          <button
            onClick={onOpenMenu}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dhaba Menu</span>
          </button>

          {/* Guestbook Wall */}
          <button
            onClick={onOpenWall}
            className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-amber-400" />
            <span>Dhaba Wall</span>
          </button>

          {/* YouTube Music Playlist Link */}
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-red-500/20"
            title="Open YouTube Music Playlist"
          >
            <span className="text-sm font-bold">▶ YT Music</span>
          </a>

          {/* Atmosphere Toggle */}
          <button
            onClick={() => {
              const next = atmosphere === 'dusk' ? 'midnight' : atmosphere === 'midnight' ? 'dawn' : 'dusk';
              setAtmosphere(next);
            }}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-amber-400 transition-colors"
            title={`Atmosphere: ${atmosphere.toUpperCase()}`}
          >
            {atmosphere === 'dusk' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </header>
  );
};
