// Web Audio API & Audio Stream Engine for Truckers Dhaba

export interface Track {
  id: string;
  title: string;
  artist: string;
  route: string;
  genre: string;
  bpm: number;
  duration: number; // in seconds
  description: string;
  audioUrl?: string;
  spotifyUrl: string;
  youtubeUrl: string;
}

export const YOUTUBE_PLAYLIST_URL = 'https://music.youtube.com/playlist?list=RDCLAK5uy_lnm4v4arFrmL63NUzIdoXJe-E7G4_sriU';
export const YOUTUBE_EMBED_URL = 'https://www.youtube-nocookie.com/embed/videoseries?list=RDCLAK5uy_lnm4v4arFrmL63NUzIdoXJe-E7G4_sriU';

export const PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Highway Beats — Hot Punjabi Hits',
    artist: 'YouTube Music Playlist',
    route: 'Delhi ➔ Ambala (NH 44)',
    genre: 'Punjabi Highway Beats',
    bpm: 95,
    duration: 210,
    description: 'Official YouTube Music highway playlist for long night drives.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    spotifyUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG',
    youtubeUrl: YOUTUBE_PLAYLIST_URL
  },
  {
    id: 'track-2',
    title: 'Desi Trucker Anthems',
    artist: 'Punjabi Beats Lounge',
    route: 'Ludhiana ➔ Jalandhar',
    genre: 'Folk Fusion',
    bpm: 102,
    duration: 215,
    description: 'Upbeat rhythm and acoustic vibes for highway cruising.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-chill-medium-version-159456.mp3',
    spotifyUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG',
    youtubeUrl: YOUTUBE_PLAYLIST_URL
  },
  {
    id: 'track-3',
    title: 'Grand Trunk Road Chill',
    artist: 'Sarangi & Synth Project',
    route: 'Kolkata ➔ Varanasi (NH 19)',
    genre: 'Ambient Sufi Lounge',
    bpm: 76,
    duration: 240,
    description: 'Soulful string melodies as dusk settles over the highway.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-lofi-song-8444.mp3',
    spotifyUrl: 'https://open.spotify.com/playlist/0iT5gTODhpUFGSwqGZUpdG',
    youtubeUrl: YOUTUBE_PLAYLIST_URL
  }
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private mainGain: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  
  // Ambient Gains (All default to 0)
  private truckIdleGain: GainNode | null = null;
  private cricketsGain: GainNode | null = null;
  private chaiGain: GainNode | null = null;
  private rainGain: GainNode | null = null;

  // Visualizer interval
  private spectrumInterval: number | null = null;
  private currentProgress: number = 0;
  
  // Callbacks
  private onTrackChangeCallback: ((track: Track) => void) | null = null;
  private onProgressCallback: ((progress: number, currentTime: number) => void) | null = null;
  private onSpectrumCallback: ((data: number[]) => void) | null = null;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);

      this.setupAmbientNodes();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupAmbientNodes() {
    if (!this.ctx || !this.mainGain) return;

    this.truckIdleGain = this.ctx.createGain();
    this.truckIdleGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.truckIdleGain.connect(this.mainGain);

    this.cricketsGain = this.ctx.createGain();
    this.cricketsGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.cricketsGain.connect(this.mainGain);

    this.chaiGain = this.ctx.createGain();
    this.chaiGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.chaiGain.connect(this.mainGain);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.rainGain.connect(this.mainGain);
  }

  /* --- Interactive Sound Effects (Chai Pouring Sound Only) --- */
  public playChaiPouringSound() {
    this.initCtx();
    if (!this.ctx || !this.mainGain) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.linearRampToValueAtTime(1000, now + 1.0);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.2);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);

    source.start(now);
  }

  /* --- Audio Stream Playback --- */
  private playAudioStreamTrack() {
    const track = PLAYLIST[this.currentTrackIndex];
    if (!track.audioUrl) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
    }

    this.audioElement.src = track.audioUrl;
    this.audioElement.volume = 0.8;
    this.audioElement.play().catch(() => {});

    this.audioElement.ontimeupdate = () => {
      if (this.audioElement && this.audioElement.duration) {
        this.currentProgress = this.audioElement.currentTime;
        const progressFrac = this.audioElement.currentTime / this.audioElement.duration;
        if (this.onProgressCallback) {
          this.onProgressCallback(progressFrac, this.currentProgress);
        }
      }
    };

    this.audioElement.onended = () => {
      this.nextTrack();
    };

    this.startSpectrumVisualizer();
  }

  private stopAudioStreamTrack() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSpectrumVisualizer();
  }

  private startSpectrumVisualizer() {
    this.stopSpectrumVisualizer();
    this.spectrumInterval = window.setInterval(() => {
      if (this.onSpectrumCallback && this.isPlaying) {
        const spectrum = Array.from({ length: 16 }, () => Math.floor(Math.random() * 60 + 20));
        this.onSpectrumCallback(spectrum);
      }
    }, 120);
  }

  private stopSpectrumVisualizer() {
    if (this.spectrumInterval) {
      clearInterval(this.spectrumInterval);
      this.spectrumInterval = null;
    }
  }

  /* --- Public Player Controls --- */
  public togglePlay(): boolean {
    this.initCtx();
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.playAudioStreamTrack();
    } else {
      this.stopAudioStreamTrack();
    }

    return this.isPlaying;
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % PLAYLIST.length;
    this.currentProgress = 0;
    const track = PLAYLIST[this.currentTrackIndex];
    if (this.onTrackChangeCallback) this.onTrackChangeCallback(track);
    if (this.isPlaying) {
      this.playAudioStreamTrack();
    }
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    this.currentProgress = 0;
    const track = PLAYLIST[this.currentTrackIndex];
    if (this.onTrackChangeCallback) this.onTrackChangeCallback(track);
    if (this.isPlaying) {
      this.playAudioStreamTrack();
    }
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < PLAYLIST.length) {
      this.currentTrackIndex = index;
      this.currentProgress = 0;
      const track = PLAYLIST[this.currentTrackIndex];
      if (this.onTrackChangeCallback) this.onTrackChangeCallback(track);
      if (this.isPlaying) {
        this.playAudioStreamTrack();
      }
    }
  }

  public setMasterVolume(vol: number) {
    this.initCtx();
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = vol;
    }
  }

  public setAmbientVolume(type: string, val: number) {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (type === 'truck' && this.truckIdleGain) this.truckIdleGain.gain.setValueAtTime(val * 0.2, t);
    if (type === 'crickets' && this.cricketsGain) this.cricketsGain.gain.setValueAtTime(val * 0.15, t);
    if (type === 'chai' && this.chaiGain) this.chaiGain.gain.setValueAtTime(val * 0.15, t);
    if (type === 'rain' && this.rainGain) this.rainGain.gain.setValueAtTime(val * 0.25, t);
  }

  public setCallbacks(
    onTrackChange: (t: Track) => void,
    onProgress: (p: number, currTime: number) => void,
    onSpectrum: (data: number[]) => void
  ) {
    this.onTrackChangeCallback = onTrackChange;
    this.onProgressCallback = onProgress;
    this.onSpectrumCallback = onSpectrum;
  }

  public getCurrentTrack(): Track {
    return PLAYLIST[this.currentTrackIndex];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const soundEngine = new SoundEngine();

