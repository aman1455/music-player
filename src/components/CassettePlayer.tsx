import React from 'react';
import { ExternalLink, Radio, Tv } from 'lucide-react';
import { YOUTUBE_EMBED_URL, YOUTUBE_PLAYLIST_URL } from '../audio/soundEngine';

export const CassettePlayer: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 border border-amber-500/30 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Top Border Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-yatra text-xl text-amber-300 neon-text-orange">
            HIGHWAY BEATS — YOUTUBE MUSIC RADIO
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 font-digital px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            LIVE PLAYLIST
          </span>
        </div>
      </div>

      {/* YouTube Music Embedded Player */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full h-[360px] lg:h-[480px] bg-slate-900 rounded-xl overflow-hidden border-2 border-red-600/40 shadow-2xl relative">
          <iframe
            src={YOUTUBE_EMBED_URL}
            title="YouTube Music Highway Beats Playlist"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer Info & Link */}
        <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center space-x-2 text-slate-300">
            <Tv className="w-4 h-4 text-red-400" />
            <span className="font-semibold text-amber-300">OFFICIAL PLAYLIST:</span>
            <span className="text-slate-400 font-mono">Highway Beats (YouTube Music)</span>
          </div>

          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-red-600/30 active:scale-95"
          >
            <span>OPEN ON YOUTUBE MUSIC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
