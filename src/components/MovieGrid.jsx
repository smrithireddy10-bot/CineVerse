import React from 'react';
import MovieCard from './MovieCard';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-poster" />
    <div className="skeleton-info">
      <div className="skeleton skeleton-line full" />
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton skeleton-line short" />
    </div>
  </div>
);

const MovieGrid = ({
  movies,
  loading,
  onSelect,
  onWatchlistToggle,
  isInWatchlist,
  skeletonCount = 12,
  emptyMessage = 'No movies found.',
}) => {
  if (loading) {
    return (
      <div className="movie-grid" aria-busy="true" aria-label="Loading movies">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><path d="M8 2v16" /><path d="M16 6v16" />
          </svg>
        </div>
        <p className="empty-state-title">Nothing to show</p>
        <p className="empty-state-desc">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid" role="list" aria-label="Movie grid">
      {movies.map(movie => (
        <div key={movie.id} role="listitem">
          <MovieCard
            movie={movie}
            onSelect={onSelect}
            onWatchlistToggle={onWatchlistToggle}
            isInWatchlist={isInWatchlist}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
