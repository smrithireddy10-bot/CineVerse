import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cineverse_watchlist';

const safeRead = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const safeWrite = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    console.warn('CineVerse: Failed to save watchlist to localStorage');
  }
};

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(safeRead);

  useEffect(() => {
    safeWrite(watchlist);
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  };

  const toggleWatchlist = (movie) => {
    const inList = watchlist.some(m => m.id === movie.id);
    if (inList) {
      removeFromWatchlist(movie.id);
      return false;
    } else {
      addToWatchlist(movie);
      return true;
    }
  };

  const isInWatchlist = (movieId) => watchlist.some(m => m.id === movieId);

  return { watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist };
};
