import React, { useState, useEffect } from 'react';
import { Play, Bookmark, ChevronDown, AlertCircle, Sparkles } from 'lucide-react';
import { getTrendingDay, getBackdropUrl, getImageUrl, hasToken } from '../services/tmdb';

const HeroSection = ({ onSelect, onWatchlistToggle, isInWatchlist, onSurpriseOpen, genres = [] }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasToken()) {
      setError('MISSING_TOKEN');
      setLoading(false);
      return;
    }
    getTrendingDay(1)
      .then(data => {
        const results = data.results || [];
        const pick = results.find(m => m.backdrop_path && m.overview) || results[0];
        setMovie(pick || null);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getMovieGenres = (genreIds) => {
    if (!genreIds || !genres.length) return [];
    return genreIds.slice(0, 3).map(id => genres.find(g => g.id === id)?.name).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="hero" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, padding: '80px 0' }}>
            <div className="skeleton" style={{ width: 140, height: 22, borderRadius: 999 }} />
            <div className="skeleton" style={{ width: '80%', height: 64, borderRadius: 12 }} />
            <div className="skeleton" style={{ width: '60%', height: 64, borderRadius: 12 }} />
            <div className="skeleton" style={{ width: '90%', height: 20, borderRadius: 6, marginTop: 8 }} />
            <div className="skeleton" style={{ width: '75%', height: 20, borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div className="skeleton" style={{ width: 160, height: 48, borderRadius: 10 }} />
              <div className="skeleton" style={{ width: 140, height: 48, borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'MISSING_TOKEN' || !movie) {
    return (
      <div className="hero" style={{ background: 'var(--bg-secondary)', alignItems: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: 560 }}>
            <div className="api-warning" style={{ marginBottom: 32 }}>
              <AlertCircle size={22} className="api-warning-icon" />
              <div>
                <div className="api-warning-title">TMDB Token Required</div>
                <div className="api-warning-desc">
                  Add your TMDB Read Access Token to <span className="api-warning-code">.env</span> as{' '}
                  <span className="api-warning-code">VITE_TMDB_ACCESS_TOKEN</span> and restart the dev server to load live movie data.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="https://developer.themoviedb.org/docs/authentication-application"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Get TMDB Token
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id);
  const genreNames = getMovieGenres(movie.genre_ids);
  const year = (movie.release_date || '').substring(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');

  return (
    <section className="hero" aria-label="Featured movie hero" id="hero-section">
      {/* Backdrop */}
      <div className="hero-backdrop">
        <img
          src={backdropUrl}
          alt={`${movie.title} cinematic backdrop`}
          loading="eager"
          fetchpriority="high"
        />
        <div className="hero-backdrop-overlay" aria-hidden="true" />
        <div className="hero-backdrop-bottom" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-content">
          <div className="hero-label" aria-label="Featured content">
            <Sparkles size={10} />
            YOUR NEXT GREAT WATCH
          </div>

          <h1 className="hero-title serif">{movie.title}</h1>

          <div className="hero-meta" role="list" aria-label="Movie details">
            {rating && parseFloat(rating) > 0 && (
              <div className="hero-rating" role="listitem" aria-label={`Rating ${rating}`}>
                <span aria-hidden="true">★</span> {rating}
              </div>
            )}
            {year && (
              <div className="hero-meta-item" role="listitem">
                <span>{year}</span>
              </div>
            )}
            {movie.original_language && (
              <>
                <div className="hero-meta-dot" aria-hidden="true" />
                <div className="hero-meta-item" role="listitem">
                  <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{movie.original_language}</span>
                </div>
              </>
            )}
          </div>

          {genreNames.length > 0 && (
            <div className="hero-genre" role="list" aria-label="Genres">
              {genreNames.map(g => (
                <span key={g} className="genre-pill" role="listitem">{g}</span>
              ))}
            </div>
          )}

          {movie.overview && (
            <p className="hero-overview">{movie.overview}</p>
          )}

          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => onSelect(movie)}
              id="hero-explore-btn"
            >
              <Play size={18} fill="currentColor" /> Explore Movie
            </button>
            <button
              className={`btn btn-secondary ${inList ? 'btn-active' : ''}`}
              onClick={() => onWatchlistToggle(movie)}
              id="hero-watchlist-btn"
              aria-label={inList ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
            >
              <Bookmark size={18} fill={inList ? 'currentColor' : 'none'} />
              {inList ? 'Saved to Watchlist' : 'Add to Watchlist'}
            </button>
            {onSurpriseOpen && (
              <button
                className="btn btn-ghost"
                onClick={onSurpriseOpen}
                id="hero-surprise-btn"
                style={{ color: 'var(--accent)', border: '1px solid var(--border)' }}
              >
                <Sparkles size={18} /> Surprise Me
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
};

export default HeroSection;
