# CineVerse 🎬
### Dynamic Movie Discovery & API Integration Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TMDB API](https://img.shields.io/badge/TMDB_API-v3-01D277?logo=themoviedb&logoColor=white)](https://developer.themoviedb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cinematic, modern movie discovery platform powered by TMDB (The Movie Database). Explore thousands of trending films, world cinema, regional Indian industries, watch trailers, find streaming availability, spin the movie roulette, and curate your personalized watchlist.

---

## ✨ Features

- **🔥 Dynamic Hero Section**: Real-time trending movie banner with high-resolution cinematic backdrop, overview teaser, genre badges, and direct trailer & watchlist actions.
- **🔍 Multi-Filter Discovery Engine**: Filter films across 19 genres, 25+ global languages, release years (1985–present), minimum ratings, and multiple sorting algorithms.
- **🇮🇳 Regional Indian Cinema**: Dedicated spotlight hubs for Bollywood (Hindi), Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), Sandalwood (Kannada), Punjabi, Bengali, and Marathi cinema.
- **🌍 International World Cinema**: Explore curated selections of Korean, Japanese, French, Spanish, Italian, German, Turkish, and Scandinavian films.
- **⚡ Global Instant Search**: Debounced keystroke search (`300ms`) with `AbortController` cancellation for fast queries without redundant network requests.
- **📺 "Where to Watch" Streaming Availability**: Live JustWatch streaming provider integration. View subscription platforms (Netflix, Prime Video, JioHotstar, Disney+, Apple TV) and rent/buy options with regional toggles (India, US, UK, Canada, Australia).
- **🎲 Movie Roulette ("Surprise Me")**: An animated spinning wheel that picks a movie based on your mood (Action, Comedy, Sci-Fi, Horror, Romance, Indian Cinema, Korean, or 8.0+ Masterpieces).
- **📌 Persistent Watchlist**: LocalStorage-backed watchlist with statistical dashboard (total saved, average rating, top language breakdown).
- **🌓 Dark & Light Mode**: Seamless theme switcher with anti-flash script initialization.
- **🔔 Toast Notifications**: Interactive user feedback for list operations and system events.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Vanilla Modern CSS Design System (Custom tokens, glassmorphism, responsive grid, micro-interactions)
- **Icons**: Lucide React
- **Data Source**: TMDB API v3 (The Movie Database)
- **Streaming Intelligence**: JustWatch via TMDB Watch Providers API
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`) + LocalStorage

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or later)
- npm or pnpm
- A free TMDB API Read Access Token or API Key from [themoviedb.org](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/smrithireddy10-bot/CineVerse.git
   cd CineVerse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   *(You can also use `.env.example` as a template)*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
CineVerse/
├── public/
│   └── favicon.svg           # Brand favicon
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Navigation footer & TMDB attribution
│   │   ├── HeroSection.jsx   # Dynamic hero showcase
│   │   ├── MovieCard.jsx     # Reusable movie card with poster fallback
│   │   ├── MovieDetails.jsx  # Detailed modal with streaming providers & trailers
│   │   ├── MovieGrid.jsx     # Responsive grid with skeletons
│   │   ├── Navbar.jsx        # Navigation bar, search, theme & roulette triggers
│   │   ├── SearchOverlay.jsx # Debounced instant search overlay
│   │   ├── SurpriseModal.jsx # Movie roulette / Surprise Me picker
│   │   └── Toast.jsx         # Floating toast notifications
│   ├── hooks/
│   │   ├── useTheme.js       # Dark/Light mode hook
│   │   ├── useToast.js       # Toast notification manager
│   │   └── useWatchlist.js   # LocalStorage watchlist sync
│   ├── pages/
│   │   ├── Discover.jsx      # Filter engine
│   │   ├── Home.jsx          # Curated rows & personalized recommendations
│   │   ├── IndianCinema.jsx  # Regional Indian cinema tabs
│   │   ├── International.jsx # Global cinema tabs
│   │   ├── TopRated.jsx      # All-time top rated
│   │   ├── Trending.jsx      # Today & This Week trending
│   │   ├── Upcoming.jsx      # Upcoming releases
│   │   └── Watchlist.jsx     # Saved films dashboard
│   ├── services/
│   │   └── tmdb.js           # Centralized TMDB API service & cache
│   ├── styles/
│   │   ├── index.css         # Component styles & layout
│   │   └── theme.css         # CSS design tokens & themes
│   ├── App.jsx               # Root application component
│   └── main.jsx              # Entry point with anti-flash theme script
├── .env.example              # Environment variables template
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License & Attribution

- Released under the [MIT License](LICENSE).
- Movie metadata and imagery provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Streaming provider data powered by [JustWatch](https://www.justwatch.com/).
