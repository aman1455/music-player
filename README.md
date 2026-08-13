# 🚚 Highway Beats — 24/7 Highway Radio & Dhaba Audio Lounge

Highway Beats is a modern, immersive web application that recreates the nostalgic ambiance of late-night Indian highway drives and roadside dhabas (NH 44). Powered by YouTube Music playlists, interactive ambient audio, an Apple Music-inspired Liquid Glass UI, and real-time Firebase listener tracking.

---

## ✨ Key Features

- 📻 **24/7 Curated Highway Radio**: 5 distinct channels including 90s Retro Bollywood, Garhwali Pahadi Beats, Himachali Folk, Haryanvi DJ Hits, and Desi Underground Hip-Hop.
- 🍏 **Apple Music-Inspired Liquid Glass UI**: Ultra-transparent frosted glass design system with fluid micro-interactions, responsive progress bars, and tactile play/pause controls.
- 🟢 **Real-Time Live Listener Counter**: Powered by **Firebase Realtime Database** client-side presence (`onDisconnect` tracking) to display live concurrent listeners without custom server code.
- ☕ **Interactive Dhaba Ambience**: Built-in Web Audio API sound engine playing interactive cutting chai pouring sounds, highway ambience, and interactive dhaba guestbook messages.
- ⚡ **Lightning Fast Stack**: Built with React 19, Vite, TypeScript, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Liquid Glass CSS System
- **Icons**: Lucide React
- **Audio & Media**: YouTube IFrame Player API + Web Audio API Engine
- **Database & Presence**: Firebase Realtime Database (`firebase/database`)

---

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aman1455/music-player.git
   cd music-player
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
