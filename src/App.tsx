import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Sparkles, ChevronUp, X } from 'lucide-react';
import { db } from './firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface RadioStation {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  playlistId: string;
  description: string;
  bgType?: 'video' | 'image';
  bgUrl?: string;
}

export const STATIONS: RadioStation[] = [
  {
    id: '90s',
    name: '90s Retro Bollywood',
    hindiName: '90s बॉलीवुड हिट्स',
    icon: '📻',
    playlistId: 'PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy',
    description: 'Nostalgic 90s highway driver classics',
    bgType: 'video',
    bgUrl: '/dhaba_bg.mp4'
  },
  {
    id: 'haryanvi',
    name: 'Haryanvi Highway Beats',
    hindiName: 'हरियाणवी सुपरहिट्स',
    icon: '🌾',
    playlistId: 'PLMRKdK25AuPWnf7hbPeAJAQt46-rCK_NO',
    description: 'High energy Haryanvi DJ beats & truck anthems',
    bgType: 'image',
    bgUrl: '/haryanvi_bg.png'
  },
  {
    id: 'garhwali',
    name: 'Garhwali Pahadi Beats',
    hindiName: 'गढ़वाली पहाड़ी गीत',
    icon: '🏔️',
    playlistId: 'PLeQnRhly9c6RPdM0cp0lxK5QjBlkglPz5',
    description: 'Soulful Uttarakhand hills & Narendra Singh Negi classics',
    bgType: 'video',
    bgUrl: '/dhaba_bg.mp4'
  },
  {
    id: 'himachali',
    name: 'Himachali Folk Radio',
    hindiName: 'हिमाचली लोक संगीत',
    icon: '🌲',
    playlistId: 'PL1NiXqvwiwb8m20OMRal9pex9gNAffd9e',
    description: 'Traditional Devbhoomi Himachal pahadi folk tunes',
    bgType: 'video',
    bgUrl: '/dhaba_bg.mp4'
  },
  {
    id: 'rap',
    name: 'Desi Rap & Hip-Hop',
    hindiName: 'देसी रैप और हिप-हॉप',
    icon: '🎤',
    playlistId: 'PL-_HauNKjNPu2dxYiqJaJBwSu0jheV6hv',
    description: 'Hardhitting Indian underground rap & street bass',
    bgType: 'video',
    bgUrl: '/dhaba_bg.mp4'
  }
];

const SLOGANS = [
  { hi: "बुरी नज़र वाले तेरा मुँह काला", en: "Evil-eyed one, may your face turn black" },
  { hi: "हॉर्न ओके प्लीज़", en: "Honk before overtaking" },
  { hi: "देखो मगर प्यार से", en: "Look, but with love" },
  { hi: "माँ की दुआ साथ सदा", en: "A mother's blessing rides along" },
  { hi: "नज़र हटी दुर्घटना घटी", en: "One glance away, one accident closer" },
  { hi: "फिर मिलेंगे", en: "We'll meet again" },
  { hi: "चलती का नाम गाड़ी", en: "A truck is only alive when it moves" },
];

export function App() {
  // State
  const [clockText, setClockText] = useState('');
  const [onlineCount, setOnlineCount] = useState(145);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [showSlogan, setShowSlogan] = useState(true);

  // Station State
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [showStationModal, setShowStationModal] = useState(false);
  const currentStationRef = useRef<RadioStation>(STATIONS[0]);

  // Track & Switch Refs
  const lastVideoIdRef = useRef<string>('');
  const isSwitchingStationRef = useRef<boolean>(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [trackTitle, setTrackTitle] = useState('Loading playlist…');
  const [trackArtist, setTrackArtist] = useState('YouTube Music');
  const [coverUrl, setCoverUrl] = useState('/media/hf-6d5827b3-42e5-4209-9177-89ba1db9c09c.webp');
  const [timeText, setTimeText] = useState('0:00 / 0:00');
  const [progressWidth, setProgressWidth] = useState(0);

  const playerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const currentStation = STATIONS[currentStationIndex];
  currentStationRef.current = currentStation;

  // 1. Clock
  useEffect(() => {
    function tick() {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h %= 12;
      if (h === 0) h = 12;
      setClockText(`${h}:${m}:${s} ${ampm}`);
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Real-time Firebase Online Counter with Fallback
  useEffect(() => {
    let interval: any = null;

    if (db) {
      try {
        const sessionId = Math.random().toString(36).substring(2, 10);
        const sessionRef = ref(db, `presence/${sessionId}`);
        const connectedRef = ref(db, '.info/connected');
        const allPresenceRef = ref(db, 'presence');

        const unsubConnected = onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === true) {
            onDisconnect(sessionRef).remove();
            set(sessionRef, {
              online: true,
              ts: serverTimestamp()
            });
          }
        });

        const unsubPresence = onValue(allPresenceRef, (snapshot) => {
          if (snapshot.exists()) {
            const activeCount = Object.keys(snapshot.val()).length;
            setOnlineCount(activeCount);
          }
        });

        return () => {
          unsubConnected();
          unsubPresence();
        };
      } catch (err) {
        console.warn('Firebase presence fallback:', err);
      }
    }

    // Fallback simulation if Firebase DB URL is not connected
    let count = 120 + Math.floor(Math.random() * 60);
    setOnlineCount(count);
    interval = setInterval(() => {
      count = Math.max(38, Math.min(311, count + Math.floor(Math.random() * 9) - 4));
      setOnlineCount(count);
    }, 2800);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // 3. Slogan Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSlogan(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
        setShowSlogan(true);
      }, 550);
    }, 4600);
    return () => clearInterval(interval);
  }, []);

  // 4. Time Formatter
  function fmt(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const whole = Math.floor(seconds);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
  }

  // 5. Update Metadata with Video ID Stale Prevention
  const updateTrackMetadata = () => {
    if (!playerRef.current || typeof playerRef.current.getVideoData !== 'function') return;
    const data = playerRef.current.getVideoData() || {};
    
    // Ignore stale metadata from previous playlist while loading new station
    if (isSwitchingStationRef.current && data.video_id && data.video_id === lastVideoIdRef.current) {
      return;
    }

    if (data.video_id && data.video_id !== lastVideoIdRef.current) {
      lastVideoIdRef.current = data.video_id;
      isSwitchingStationRef.current = false;
    }

    if (data.title) setTrackTitle(data.title);
    if (data.author) setTrackArtist(data.author || currentStationRef.current.hindiName);
    if (data.video_id) {
      setCoverUrl(`https://i.ytimg.com/vi/${data.video_id}/hqdefault.jpg`);
    }
  };

  // 6. YouTube Player Initialization
  useEffect(() => {
    let isMounted = true;

    const youtubeApiReady = new Promise<void>((resolve) => {
      if (window.YT?.Player) {
        resolve();
      } else {
        const prevOnReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevOnReady) prevOnReady();
          resolve();
        };
      }
    });

    async function createPlayer() {
      try {
        await Promise.race([
          youtubeApiReady,
          new Promise((_, reject) => setTimeout(() => reject(new Error("YouTube player timed out")), 12000)),
        ]);

        if (!isMounted) return;

        playerRef.current = new window.YT.Player("youtube-player", {
          width: "1",
          height: "1",
          playerVars: {
            listType: "playlist",
            list: currentStationRef.current.playlistId,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!isMounted) return;
              setIsReady(true);
              setTrackTitle(`${currentStationRef.current.name}`);
              setTrackArtist("Press play to start radio");
              updateTrackMetadata();
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                updateTrackMetadata();
              } else if (state === window.YT.PlayerState.CUED) {
                if (isSwitchingStationRef.current && playerRef.current) {
                  isSwitchingStationRef.current = false;
                  if (typeof playerRef.current.playVideo === 'function') {
                    playerRef.current.playVideo();
                  }
                } else {
                  setIsPlaying(false);
                  updateTrackMetadata();
                }
              } else if (
                state === window.YT.PlayerState.PAUSED ||
                state === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
                updateTrackMetadata();
              }
            },
            onError: (event: any) => {
              if (!isMounted) return;
              const messages: Record<number, string> = {
                2: "Invalid YouTube video",
                5: "Video cannot play in HTML5",
                100: "Video is unavailable",
                101: "Video owner disabled embedding",
                150: "Video owner disabled embedding",
              };
              setTrackTitle("Track unavailable");
              setTrackArtist(messages[event.data] || "Skipping to next track");
              setIsPlaying(false);
              setTimeout(() => playerRef.current?.nextVideo(), 800);
            },
          },
        });
      } catch (error: any) {
        if (!isMounted) return;
        setTrackTitle("YouTube unavailable");
        setTrackArtist(error.message || "Failed to load player");
      }
    }

    createPlayer();

    return () => {
      isMounted = false;
    };
  }, []);

  // 7. Station Switching: Clean Playlist Switcher
  const handleSelectStation = (index: number) => {
    const targetStation = STATIONS[index];
    setCurrentStationIndex(index);
    currentStationRef.current = targetStation;
    isSwitchingStationRef.current = true;
    setShowStationModal(false);

    setTrackTitle(`Loading ${targetStation.name}…`);
    setTrackArtist(targetStation.hindiName);

    if (playerRef.current) {
      // 1. Stop current audio immediately so old playlist video stops playing
      if (typeof playerRef.current.stopVideo === 'function') {
        playerRef.current.stopVideo();
      }

      // 2. Cue the target playlist (triggers YT.PlayerState.CUED when ready)
      if (typeof playerRef.current.cuePlaylist === 'function') {
        playerRef.current.cuePlaylist({
          listType: 'playlist',
          list: targetStation.playlistId,
          index: 0,
          startSeconds: 0
        });
      } else if (typeof playerRef.current.loadPlaylist === 'function') {
        playerRef.current.loadPlaylist({
          listType: 'playlist',
          list: targetStation.playlistId,
          index: 0,
          startSeconds: 0
        });
      }
    }
  };

  // 8. Time Update Interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isReady || !playerRef.current) return;
      if (typeof playerRef.current.getCurrentTime !== 'function') return;

      const current = playerRef.current.getCurrentTime() || 0;
      const duration = playerRef.current.getDuration() || 0;

      const widthPercent = duration ? (current / duration) * 100 : 0;
      setProgressWidth(widthPercent);
      setTimeText(`${fmt(current)} / ${fmt(duration)}`);
      updateTrackMetadata();
    }, 500);

    return () => clearInterval(timer);
  }, [isReady]);

  // Controls Handlers
  const handlePlayPause = () => {
    if (!isReady || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handlePrev = () => {
    if (isReady && playerRef.current) {
      playerRef.current.previousVideo();
    }
  };

  const handleNext = () => {
    if (isReady && playerRef.current) {
      playerRef.current.nextVideo();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isReady || !playerRef.current || !progressBarRef.current) return;
    const duration = playerRef.current.getDuration();
    if (!duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    playerRef.current.seekTo(duration * ratio, true);
  };

  const currentSlogan = SLOGANS[sloganIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none text-slate-100">
      
      {/* Hidden YouTube Player IFrame Container */}
      <div id="youtube-player" className="absolute top-0 left-0 opacity-0 pointer-events-none w-1 h-1" />

      {/* 1. Dynamic Fullscreen Background (Image or Video) */}
      {currentStation.bgType === 'image' && currentStation.bgUrl ? (
        <img
          key={currentStation.id}
          src={currentStation.bgUrl}
          alt={currentStation.name}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 scale-105 transition-opacity duration-700 animate-in fade-in"
        />
      ) : (
        <video
          key={currentStation.bgUrl || 'default-video'}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0 scale-105"
          src={currentStation.bgUrl || "/dhaba_bg.mp4"}
        />
      )}

      {/* Liquid Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 z-10 pointer-events-none" />

      {/* 2. Liquid Glass Top Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 p-2.5 sm:p-4 lg:p-6 flex items-center justify-between gap-1.5 sm:gap-4 pointer-events-auto">
        
        {/* Top Left: Clock */}
        <div id="clock" className="liquid-glass-card px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-slate-100 tracking-wider font-mono shadow-xl flex-shrink-0">
          {clockText || "3:18:54 PM"}
        </div>

        {/* Top Center: Station Switcher Button */}
        <button
          onClick={() => setShowStationModal(!showStationModal)}
          className="liquid-glass-button px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-amber-300 flex items-center space-x-1.5 sm:space-x-2 shadow-xl hover:scale-105 transition-all max-w-[140px] xs:max-w-[190px] sm:max-w-none min-w-0"
        >
          <span>{currentStation.icon}</span>
          <span className="font-bold truncate">{currentStation.name}</span>
          <span className="text-[9px] sm:text-[10px] text-amber-400 font-mono hidden md:inline">({currentStation.hindiName})</span>
          <ChevronUp className={`w-3.5 h-3.5 text-amber-400 flex-shrink-0 transition-transform ${showStationModal ? 'rotate-180' : ''}`} />
        </button>

        {/* Top Right: Live Online & Playlist Links */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
          <div className="liquid-glass-card px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-slate-100 flex items-center space-x-1.5 sm:space-x-2 shadow-xl">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]"></span>
            <span>
              <strong id="online-count" className="text-emerald-300 font-bold font-mono">{onlineCount}</strong> <span className="hidden xs:inline">online</span>
            </span>
          </div>

          <a
            href={`https://music.youtube.com/playlist?list=${currentStation.playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-button px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-slate-100 flex items-center space-x-1.5"
          >
            <span>▶ <span className="hidden xs:inline">YT Music</span></span>
          </a>
        </div>

      </header>

      {/* 3. Center Hero Slogans */}
      <main className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div
          id="slogan-wrap"
          className={`transition-all duration-700 transform ${
            showSlogan ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
          }`}
        >
          <h1
            id="slogan-hi"
            className="font-yatra text-3xl sm:text-6xl md:text-7xl lg:text-8xl text-amber-200/95 tracking-wide drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]"
          >
            {currentSlogan.hi}
          </h1>

          <p
            id="slogan-en"
            className="mt-2 sm:mt-3 text-[10px] sm:text-xs lg:text-base font-semibold text-amber-300/85 tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
          >
            {currentSlogan.en}
          </p>
        </div>
      </main>

      {/* 4. Liquid Glass Player Pill (Bottom Floating Console) */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-[94%] max-w-xl pointer-events-auto">
        
        {/* Station Selector Drawer Modal */}
        {showStationModal && (
          <div className="mb-2 sm:mb-3 liquid-glass-pill rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2.5">
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>SELECT HIGHWAY RADIO CHANNEL</span>
              </div>
              <button
                onClick={() => setShowStationModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {STATIONS.map((st, idx) => {
                const isActive = idx === currentStationIndex;
                return (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStation(idx)}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_20px_rgba(255,170,0,0.4)]'
                        : 'liquid-glass-button hover:border-white/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-100">
                        <span>{st.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-300/80 truncate mt-0.5 font-kalam">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="liquid-glass-pill rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Liquid Glass Album Artwork */}
          <div className="relative flex-shrink-0">
            <img
              id="disc"
              src={coverUrl}
              alt="Track Thumbnail"
              className={`w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl object-cover border border-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all ${
                isPlaying ? 'shadow-[0_0_25px_rgba(255,170,0,0.5)] scale-105 ring-2 ring-amber-400/40 animate-spin-tape' : ''
              }`}
            />
          </div>

          {/* Track Meta & Liquid Progress Bar */}
          <div className="flex-1 min-w-0 px-0.5 sm:px-1">
            <div className="flex items-center justify-between">
              <h4 id="track-title" className="font-bold text-white truncate text-xs sm:text-sm tracking-tight drop-shadow-sm">
                {trackTitle}
              </h4>
            </div>
            <p id="track-artist" className="text-[10px] sm:text-[11px] text-slate-300/90 truncate font-medium flex items-center gap-1.5">
              <span className="truncate">{trackArtist}</span>
              <span className="text-amber-400 font-mono text-[9px] sm:text-[10px] hidden xs:inline flex-shrink-0">({currentStation.name})</span>
            </p>

            {/* Liquid Progress Track */}
            <div
              id="progress-bar"
              ref={progressBarRef}
              onClick={handleSeek}
              className="mt-1.5 sm:mt-2 flex items-center space-x-2 sm:space-x-2.5 cursor-pointer group"
            >
              <div className="flex-1 h-1.5 sm:h-2 liquid-progress-track rounded-full overflow-hidden relative">
                <div
                  id="progress-fill"
                  className="h-full liquid-progress-fill rounded-full transition-all duration-150"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <span id="track-time" className="text-[9px] sm:text-[10px] font-mono text-slate-200/90 flex-shrink-0 font-medium drop-shadow-sm">
                {timeText}
              </span>
            </div>
          </div>

          {/* Apple Music Style Tactile Control Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              id="prev-btn"
              onClick={handlePrev}
              disabled={!isReady}
              className="apple-control-btn p-2 sm:p-2.5 rounded-full text-slate-100 hover:text-white disabled:opacity-40"
              title="Previous Track"
            >
              <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>

            <button
              id="play-pause"
              onClick={handlePlayPause}
              disabled={!isReady}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full apple-play-button flex items-center justify-center disabled:opacity-40"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause id="icon-pause" className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-slate-900 text-slate-900" />
              ) : (
                <Play id="icon-play" className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-slate-900 text-slate-900 ml-0.5" />
              )}
            </button>

            <button
              id="next-btn"
              onClick={handleNext}
              disabled={!isReady}
              className="apple-control-btn p-2 sm:p-2.5 rounded-full text-slate-100 hover:text-white disabled:opacity-40"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
