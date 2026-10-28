import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchMovies } from '../services/tmdb';
import MovieCard from './MovieCard';

const SearchOverlay = ({ onClose, onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const data = await searchMovies(q.trim(), 1, abortRef.current.signal);
      setResults(data.results || []);
      setSearched(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setResults([]);
        setSearched(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  const handleSelect = (movie) => {
    onClose();
    onSelect(movie);
  };

  return (
    <div className="search-overlay" role="dialog" aria-label="Search movies" aria-modal="true" id="search-overlay">
      <div className="search-header">
        <div className="search-input-wrapper">
          <span className="search-input-icon" aria-hidden="true">
            {loading ? <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Search size={20} />}
          </span>
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder="Search movies, actors, directors…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search movies"
            id="search-input"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button
          className="search-close-btn"
          onClick={onClose}
          aria-label="Close search"
          id="search-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      <div className="search-results" role="region" aria-label="Search results" aria-live="polite">
        {!query && (
          <div className="search-hint">
            <Search size={40} style={{ opacity: 0.15, margin: '0 auto 16px' }} />
            <p>Type to search across thousands of movies</p>
          </div>
        )}

        {query && !loading && searched && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={28} />
            </div>
            <p className="empty-state-title">No results for "{query}"</p>
            <p className="empty-state-desc">Try a different title, actor, or director name.</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 16 }}>
              {results.length} results for "<strong style={{ color: 'var(--text-secondary)' }}>{query}</strong>"
            </p>
            <div className="search-results-grid">
              {results.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={handleSelect}
                  onWatchlistToggle={onWatchlistToggle}
                  isInWatchlist={isInWatchlist}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
