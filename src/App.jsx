import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import MovieDetails from './components/MovieDetails';
import SurpriseModal from './components/SurpriseModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import Trending from './pages/Trending';
import TopRated from './pages/TopRated';
import Upcoming from './pages/Upcoming';
import IndianCinema from './pages/IndianCinema';
import International from './pages/International';
import Discover from './pages/Discover';
import Watchlist from './pages/Watchlist';
import { useTheme } from './hooks/useTheme';
import { useWatchlist } from './hooks/useWatchlist';
import { useToast } from './hooks/useToast';
import './styles/index.css';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();
  const { toasts, addToast, removeToast } = useToast();

  const [currentPage, setCurrentPage] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleWatchlistToggle = useCallback((movie) => {
    const added = toggleWatchlist(movie);
    if (added) {
      addToast(`"${movie.title}" added to Watchlist`, 'success');
    } else {
      addToast(`"${movie.title}" removed from Watchlist`, 'info');
    }
  }, [toggleWatchlist, addToast]);

  const handleSelectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sharedProps = {
    onSelect: handleSelectMovie,
    onWatchlistToggle: handleWatchlistToggle,
    isInWatchlist,
    onNavigate: handleNavigate,
    onSurpriseOpen: () => setSurpriseOpen(true),
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home {...sharedProps} watchlist={watchlist} />;
      case 'trending':
        return <Trending {...sharedProps} />;
      case 'top-rated':
        return <TopRated {...sharedProps} />;
      case 'upcoming':
        return <Upcoming {...sharedProps} />;
      case 'indian':
        return <IndianCinema {...sharedProps} />;
      case 'international':
        return <International {...sharedProps} />;
      case 'discover':
        return <Discover {...sharedProps} />;
      case 'watchlist':
        return <Watchlist watchlist={watchlist} {...sharedProps} />;
      default:
        return <Home {...sharedProps} watchlist={watchlist} />;
    }
  };

  return (
    <div data-theme={theme} id="app-root">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearchOpen={() => setSearchOpen(true)}
        onSurpriseOpen={() => setSurpriseOpen(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
        watchlistCount={watchlist.length}
      />

      {renderPage()}

      <Footer onNavigate={handleNavigate} />

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onSelect={handleSelectMovie}
          onWatchlistToggle={handleWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      )}

      {surpriseOpen && (
        <SurpriseModal
          onClose={() => setSurpriseOpen(false)}
          onSelect={handleSelectMovie}
          onWatchlistToggle={handleWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelect={handleSelectMovie}
          onWatchlistToggle={handleWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
