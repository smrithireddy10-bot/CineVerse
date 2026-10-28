import React from 'react';
import { Film, ImageOff } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';

const MovieCard = ({
  movie,
  onSelect,
  onWatchlistToggle,
  isInWatchlist,
  size = 'normal',
}) => {
  if (!movie) return null;

  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
    vote_count,
    original_language,
  } = movie;

  const year = release_date ? release_date.substring(0, 4) : '—';
  const rating = vote_average ? vote_average.toFixed(1) : null;
  const posterUrl = getImageUrl(poster_path, 'w342');
  const inList = isInWatchlist(id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    onWatchlistToggle(movie);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(movie);
    }
  };

  return (
    <article
      className="movie-card"
      onClick={() => onSelect(movie)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} (${year})`}
      id={`movie-card-${id}`}
    >
      {/* Poster */}
      <div className="movie-card-poster">
        {posterUrl ? (
          <>
            <img
              src={posterUrl}
              alt={`${title} poster`}
              loading="lazy"
              width="342"
              height="513"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentNode.querySelector('.poster-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="poster-fallback" style={{ display: 'none', position: 'absolute', inset: 0 }}>
              <ImageOff size={32} style={{ opacity: 0.3 }} />
              <span style={{ opacity: 0.5 }}>{title}</span>
            </div>
          </>
        ) : (
          <div className="poster-fallback">
            <ImageOff size={32} style={{ opacity: 0.3 }} />
            <span style={{ opacity: 0.5 }}>{title}</span>
          </div>
        )}
        <div className="movie-card-overlay" aria-hidden="true" />

        {/* Rating Badge */}
        {rating && parseFloat(rating) > 0 && (
          <div className="movie-card-rating" aria-label={`Rating: ${rating}`}>
            <span>★</span>
            <span>{rating}</span>
          </div>
        )}

        {/* Watchlist Button */}
        <button
          className={`movie-card-watchlist-btn ${inList ? 'saved' : ''}`}
          onClick={handleWatchlistClick}
          aria-label={inList ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
          id={`watchlist-btn-${id}`}
          title={inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">{year}</span>
          {original_language && (
            <span className="movie-card-lang">{original_language}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
