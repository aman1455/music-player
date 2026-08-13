import React from 'react';
import { Truck, Heart, ExternalLink } from 'lucide-react';
import { YOUTUBE_PLAYLIST_URL } from '../audio/soundEngine';

export const FooterTruckArt: React.FC = () => {
  return (
    <footer className="w-full mt-12 bg-slate-950 border-t-2 border-amber-500/40 pt-8 pb-12 px-4 relative overflow-hidden">
      
      {/* Truck Art Decorative Ticker Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-teal-600 p-2.5 mb-8 rounded-xl shadow-lg border-2 border-amber-400">
        <div className="flex items-center justify-around flex-wrap gap-2 text-slate-950 font-bold text-xs lg:text-sm font-yatra tracking-wider text-center">
          <span>❖ BURI NAZAR WALE TERA MUAH KALA ❖</span>
          <span>🚚 HIGHWAY BEATS RADIO 🚚</span>
          <span>❖ USE NIGHT LAMP AT NIGHT ❖</span>
          <span>⭐ SALUTING THE HIGHWAY DRIVERS ⭐</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
        
        {/* Left Side Info */}
        <div className="flex items-center space-x-3 text-center lg:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-yatra text-base text-amber-300 neon-text-orange">
              TRUCKERS DHABA — HIGHWAY BEATS
            </div>
            <p className="font-kalam text-slate-400">
              An ambient digital experience honoring the culture of Indian highway dhabas & truck drivers.
            </p>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex items-center space-x-4">
          <a
            href="https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg font-semibold transition-colors"
          >
            <span>🎧 Spotify Playlist</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 px-3.5 py-1.5 rounded-lg font-semibold transition-colors shadow-lg shadow-red-500/20"
          >
            <span>▶ YouTube Music Playlist</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right Side Copyright */}
        <div className="text-center lg:text-right font-kalam">
          <p className="flex items-center justify-center lg:justify-end gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Late Night Highway Wanderers</span>
          </p>
          <p className="text-[11px] text-amber-400/70 font-mono mt-0.5">
            Inspired by saloon.wtf & Logen.io Concept Brief
          </p>
        </div>

      </div>
    </footer>
  );
};
