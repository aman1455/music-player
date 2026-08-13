import React, { useState } from 'react';
import { Sliders, Truck, CloudRain, Coffee, Volume2, Wind } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';


export const AmbientMixer: React.FC = () => {
  const [levels, setLevels] = useState({
    truck: 0.0,
    crickets: 0.0,
    chai: 0.0,
    rain: 0.0,
    static: 0.0
  });


  const handleSliderChange = (key: keyof typeof levels, val: number) => {
    const next = { ...levels, [key]: val };
    setLevels(next);
    soundEngine.setAmbientVolume(key, val);
  };

  const applyPreset = (name: 'night' | 'chaiBreak' | 'monsoon' | 'party') => {
    let preset = { truck: 0.6, crickets: 0.5, chai: 0.4, rain: 0.0, static: 0.2 };
    if (name === 'night') {
      preset = { truck: 0.8, crickets: 0.7, chai: 0.2, rain: 0.0, static: 0.1 };
    } else if (name === 'chaiBreak') {
      preset = { truck: 0.3, crickets: 0.4, chai: 0.9, rain: 0.0, static: 0.2 };
    } else if (name === 'monsoon') {
      preset = { truck: 0.4, crickets: 0.2, chai: 0.5, rain: 0.9, static: 0.1 };
    } else if (name === 'party') {
      preset = { truck: 0.9, crickets: 0.1, chai: 0.6, rain: 0.0, static: 0.4 };
    }

    setLevels(preset);
    soundEngine.setAmbientVolume('truck', preset.truck);
    soundEngine.setAmbientVolume('crickets', preset.crickets);
    soundEngine.setAmbientVolume('chai', preset.chai);
    soundEngine.setAmbientVolume('rain', preset.rain);
    soundEngine.setAmbientVolume('static', preset.static);
  };

  return (
    <div className="w-full bg-slate-950/90 border border-amber-500/20 rounded-2xl p-4 lg:p-6 shadow-xl my-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-yatra text-xl text-amber-300 tracking-wide neon-text-orange">
              DHABA AMBIANCE SOUNDSCAPE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-kalam mt-0.5">
            Tune the background sound layers of NH 44 to create your ultimate late-night vibe.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('night')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-amber-300 transition-colors"
          >
            🌙 Late Night Drive
          </button>
          <button
            onClick={() => applyPreset('chaiBreak')}
            className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-300 transition-colors"
          >
            ☕ 3 AM Chai Break
          </button>
          <button
            onClick={() => applyPreset('monsoon')}
            className="px-2.5 py-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-300 transition-colors"
          >
            🌧️ Monsoon Dhaba
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Truck Engine Idle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
            <span className="flex items-center gap-1.5 font-digital tracking-wider">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>TRUCK IDLE</span>
            </span>
            <span className="font-mono">{Math.round(levels.truck * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={levels.truck}
            onChange={(e) => handleSliderChange('truck', parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Night Crickets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
            <span className="flex items-center gap-1.5 font-digital tracking-wider">
              <Wind className="w-4 h-4 text-emerald-500" />
              <span>CRICKETS & WIND</span>
            </span>
            <span className="font-mono">{Math.round(levels.crickets * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={levels.crickets}
            onChange={(e) => handleSliderChange('crickets', parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Chai Boiling */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
            <span className="flex items-center gap-1.5 font-digital tracking-wider">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>CHAI SAMOVAR</span>
            </span>
            <span className="font-mono">{Math.round(levels.chai * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={levels.chai}
            onChange={(e) => handleSliderChange('chai', parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Rain on Roof */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-blue-400 mb-2">
            <span className="flex items-center gap-1.5 font-digital tracking-wider">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>TIN ROOF RAIN</span>
            </span>
            <span className="font-mono">{Math.round(levels.rain * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={levels.rain}
            onChange={(e) => handleSliderChange('rain', parseFloat(e.target.value))}
            className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Static Noise */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-2">
            <span className="flex items-center gap-1.5 font-digital tracking-wider">
              <Volume2 className="w-4 h-4 text-red-400" />
              <span>RADIO STATIC</span>
            </span>
            <span className="font-mono">{Math.round(levels.static * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={levels.static}
            onChange={(e) => handleSliderChange('static', parseFloat(e.target.value))}
            className="w-full accent-red-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

      </div>

    </div>
  );
};
