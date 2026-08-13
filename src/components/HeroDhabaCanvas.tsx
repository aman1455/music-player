import React, { useState } from 'react';
import { Coffee, Lightbulb, ExternalLink } from 'lucide-react';
import { soundEngine, YOUTUBE_PLAYLIST_URL } from '../audio/soundEngine';

interface HeroDhabaCanvasProps {
  atmosphere: 'dusk' | 'midnight' | 'dawn';
  onOrderChai: () => void;
}

export const HeroDhabaCanvas: React.FC<HeroDhabaCanvasProps> = ({ atmosphere, onOrderChai }) => {
  const [headlightMode, setHeadlightMode] = useState<'off' | 'low' | 'high' | 'hazard'>('high');

  const handleChaiClick = () => {
    soundEngine.playChaiPouringSound();
    onOrderChai();
  };

  const toggleHeadlights = () => {
    const modes: Array<'off' | 'low' | 'high' | 'hazard'> = ['off', 'low', 'high', 'hazard'];
    const next = modes[(modes.indexOf(headlightMode) + 1) % modes.length];
    setHeadlightMode(next);
  };

  // Atmosphere overlay gradient classes
  const atmosphereOverlay = {
    dusk: 'bg-amber-950/20 mix-blend-color-burn',
    midnight: 'bg-indigo-950/40 mix-blend-multiply',
    dawn: 'bg-rose-900/20 mix-blend-screen'
  }[atmosphere];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl bg-slate-950 my-4 min-h-[380px] lg:min-h-[500px] flex flex-col justify-between">
      
      {/* Background Image */}
      <img
        src="/dhaba_hero_bg.jpg"
        alt="Truckers Dhaba Indian Highway Night Scene"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
      />

      {/* Atmosphere Tint Overlay */}
      <div className={`absolute inset-0 ${atmosphereOverlay} transition-colors duration-1000 pointer-events-none`} />

      {/* Subtle Vignette & Gradient Shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Interactive Fairy Lights String (Overhead) */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-around items-center px-4 pointer-events-none z-10">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#ffaa00] animate-twinkle"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}
      </div>

      {/* Top Banner / Ticker */}
      <div className="relative z-20 p-4 lg:p-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Neon Board */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-amber-500/40 rounded-xl p-3 shadow-xl max-w-sm">
          <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-amber-400 font-digital">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>AMRITSAR ➔ DELHI HIGHWAY DHABA</span>
          </div>
          <h2 className="font-yatra text-2xl lg:text-3xl text-amber-300 neon-text-orange mt-0.5">
            नमस्ते ढाबा
          </h2>
          <p className="text-xs text-amber-200/80 font-kalam">
            "Buri Nazar Wale Tera Muah Kala" • 24/7 Pure Veg Punjabi Food & Hot Chai
          </p>
        </div>

        {/* Floating Controls */}
        <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 z-20">
          
          {/* Headlight Toggle */}
          <button
            onClick={toggleHeadlights}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              headlightMode !== 'off'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle Truck Headlights"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{headlightMode} BEAM</span>
          </button>

          {/* YouTube Music Playlist Link */}
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/30"
          >
            <span>▶ PLAYLIST ON YT MUSIC</span>
            <ExternalLink className="w-3 h-3" />
          </a>

        </div>

      </div>

      {/* Headlight Beams Simulation Layer */}
      {headlightMode !== 'off' && (
        <div className="absolute left-[8%] bottom-[20%] w-[45%] h-[35%] pointer-events-none z-10 opacity-75">
          <div
            className={`w-full h-full bg-gradient-to-r from-amber-200/40 via-amber-300/20 to-transparent blur-xl transform -skew-x-12 origin-left ${
              headlightMode === 'high' ? 'animate-headlight-high scale-110' : ''
            } ${headlightMode === 'hazard' ? 'animate-pulse' : ''}`}
          />
        </div>
      )}

      {/* Interactive Bottom Hotspots */}
      <div className="relative z-20 p-4 lg:p-6 flex flex-wrap items-end justify-between gap-4">
        
        {/* Hot Chai Counter Button */}
        <div
          onClick={handleChaiClick}
          className="group cursor-pointer bg-slate-950/80 hover:bg-amber-950/90 border border-amber-500/40 rounded-xl p-3.5 backdrop-blur-md transition-all shadow-xl flex items-center space-x-3 hover:scale-105"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-300 font-bold text-xs animate-steam">
              ♨
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-digital">
              STEAMING SAMOVAR
            </div>
            <div className="text-sm font-semibold text-slate-100 font-kalam">
              Click to Pour Kadak Chai ☕
            </div>
          </div>
        </div>

        {/* Highway Badge */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 text-right hidden sm:block">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">
            SPEED LIMIT: 80 KM/H
          </div>
          <div className="text-xs font-bold text-emerald-400 font-mono">
            NH 44 • GRAND TRUNK ROAD
          </div>
        </div>

      </div>

    </div>
  );
};
