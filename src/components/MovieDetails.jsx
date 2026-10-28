import React, { useState, useEffect } from 'react';
import { Star, Clock, Calendar, Bookmark, Play, ExternalLink, X, ImageOff, AlertCircle, Tv } from 'lucide-react';
import { getMovieDetails, getImageUrl, getBackdropUrl, findTrailer, getYouTubeUrl, getYouTubeEmbedUrl } from '../services/tmdb';

const MetaBadge = ({ children, className = '' }) => (
  <span className={`meta-badge ${className}`}>{children}</span>
);

const REGIONS = [
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'US', label: '🇺🇸 US' },
  { code: 'GB', label: '🇬🇧 UK' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'AU', label: '🇦🇺 Australia' },
];

const MovieDetails = ({ movie, onClose, onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [watchRegion, setWatchRegion] = useState('IN');
  const bodyRef = React.useRef(null);

  const inList = isInWatchlist(movie.id);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
    let cancelled = false;
    getMovieDetails(movie.id)
      .then(data => { if (!cancelled) { setDetails(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [movie.id]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') { setShowTrailer(false); onClose(); } };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const d = details || movie;
  const genres = d.genres || [];
  const runtime = d.runtime;
  const cast = d.credits?.cast?.slice(0, 12) || [];
  const trailer = findTrailer(d.videos);
  const trailerUrl = getYouTubeEmbedUrl(trailer?.key);
  const recommendations = d.recommendations?.results?.slice(0, 8) || d.similar?.results?.slice(0, 8) || [];
  const year = (d.release_date || '').substring(0, 4);
  const rating = d.vote_average ? d.vote_average.toFixed(1) : null;
  const posterUrl = getImageUrl(d.poster_path, 'w342');
  const backdropUrl = getBackdropUrl(d.backdrop_path, 'w1280');

  const providersAll = d['watch/providers']?.results || {};
  const currentProviders = providersAll[watchRegion] || {};
  const streamProviders = currentProviders.flatrate || [];
  const rentProviders = currentProviders.rent || [];
  const buyProviders = currentProviders.buy || [];
  const justWatchLink = currentProviders.link;

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div
      className="movie-detail-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`${d.title} details`}
      id="movie-detail-modal-overlay"
    >
      <div className="movie-detail-modal" id="movie-detail-modal" ref={bodyRef}>
        {/* Close */}
        <button
          className="movie-detail-close"
          onClick={onClose}
          aria-label="Close movie details"
          id="movie-detail-close-btn"
        >
          <X size={20} />
        </button>

        {/* Backdrop */}
        <div className="movie-detail-backdrop">
          {backdropUrl ? (
            <img src={backdropUrl} alt={`${d.title} backdrop`} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageOff size={48} style={{ opacity: 0.2 }} />
            </div>
          )}
          <div className="movie-detail-backdrop-overlay" />
        </div>

        {/* Body */}
        <div className="movie-detail-body">
          {loading ? (
            <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div className="spinner" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading details…</span>
            </div>
          ) : error && error === 'MISSING_TOKEN' ? (
            <div className="api-warning">
              <AlertCircle size={20} className="api-warning-icon" />
              <div>
                <div className="api-warning-title">API Token Required</div>
                <div className="api-warning-desc">Add your TMDB token to <span className="api-warning-code">.env</span> to load full details.</div>
              </div>
            </div>
          ) : (
            <>
              <div className="movie-detail-poster-row">
                {/* Poster */}
                <div className="movie-detail-poster">
                  {posterUrl ? (
                    <img src={posterUrl} alt={`${d.title} poster`} />
                  ) : (
                    <div style={{ aspectRatio: '2/3', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageOff size={32} style={{ opacity: 0.3 }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="movie-detail-info">
                  <h2 className="movie-detail-title serif">{d.title}</h2>
                  {d.original_title && d.original_title !== d.title && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>{d.original_title}</p>
                  )}

                  <div className="movie-detail-meta">
                    {rating && parseFloat(rating) > 0 && (
                      <MetaBadge className="rating">
                        <Star size={13} fill="currentColor" /> {rating}
                        {d.vote_count && <span style={{ opacity: 0.7 }}>({d.vote_count.toLocaleString()})</span>}
                      </MetaBadge>
                    )}
                    {year && <MetaBadge><Calendar size={13} /> {year}</MetaBadge>}
                    {formatRuntime(runtime) && <MetaBadge><Clock size={13} /> {formatRuntime(runtime)}</MetaBadge>}
                    {d.original_language && <MetaBadge>{d.original_language.toUpperCase()}</MetaBadge>}
                  </div>

                  {genres.length > 0 && (
                    <div className="movie-detail-genres">
                      {genres.map(g => (
                        <span key={g.id} className="genre-pill">{g.name}</span>
                      ))}
                    </div>
                  )}

                  {d.overview && (
                    <p className="movie-detail-overview">{d.overview}</p>
                  )}

                  <div className="movie-detail-actions">
                    <button
                      className={`btn ${inList ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => onWatchlistToggle(d)}
                      id="movie-detail-watchlist-btn"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={inList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      {inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </button>
                    <a
                      href={`https://www.themoviedb.org/movie/${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      id="movie-detail-tmdb-link"
                    >
                      <ExternalLink size={16} /> TMDB
                    </a>
                  </div>

                  {/* Trailer */}
                  {trailer ? (
                    <button className="trailer-btn" onClick={() => setShowTrailer(true)} id="movie-detail-trailer-btn">
                      <Play size={20} fill="currentColor" /> Watch Trailer
                    </button>
                  ) : (
                    <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                      No trailer available
                    </div>
                  )}
                </div>
              </div>

              {/* Production */}
              {d.production_countries?.length > 0 && (
                <div className="movie-detail-section">
                  <h3 className="movie-detail-section-title">Production</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {d.production_countries.map(c => (
                      <span key={c.iso_3166_1} className="meta-badge">{c.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Where to Watch / Streaming Providers */}
              <div className="providers-section" id="movie-providers-section">
                <div className="providers-header">
                  <div className="providers-title">
                    <Tv size={18} style={{ color: 'var(--accent)' }} />
                    Where to Watch & Stream
                  </div>
                  <div className="providers-country-tabs" role="tablist" aria-label="Select country for streaming">
                    {REGIONS.map(reg => (
                      <button
                        key={reg.code}
                        className={`country-chip ${watchRegion === reg.code ? 'active' : ''}`}
                        onClick={() => setWatchRegion(reg.code)}
                        type="button"
                        role="tab"
                        aria-selected={watchRegion === reg.code}
                      >
                        {reg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {streamProviders.length > 0 && (
                  <div className="provider-row">
                    <div className="provider-row-label">Stream on Subscription</div>
                    <div className="providers-list">
                      {streamProviders.map(p => (
                        <div key={p.provider_id} className="provider-badge" title={p.provider_name}>
                          {p.logo_path && (
                            <img
                              src={getImageUrl(p.logo_path, 'w92')}
                              alt={p.provider_name}
                              className="provider-logo"
                              loading="lazy"
                            />
                          )}
                          <span>{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rentProviders.length > 0 && streamProviders.length === 0 && (
                  <div className="provider-row">
                    <div className="provider-row-label">Rent / Buy</div>
                    <div className="providers-list">
                      {rentProviders.slice(0, 5).map(p => (
                        <div key={p.provider_id} className="provider-badge" title={p.provider_name}>
                          {p.logo_path && (
                            <img
                              src={getImageUrl(p.logo_path, 'w92')}
                              alt={p.provider_name}
                              className="provider-logo"
                              loading="lazy"
                            />
                          )}
                          <span>{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {streamProviders.length === 0 && rentProviders.length === 0 && (
                  <div className="providers-empty">
                    Currently not streaming on subscription in this region. Check local theatrical screenings or digital storefronts.
                  </div>
                )}

                {justWatchLink && (
                  <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Streaming availability data provided by JustWatch via TMDB.{' '}
                    <a
                      href={justWatchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                    >
                      View on JustWatch <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="movie-detail-section">
                  <h3 className="movie-detail-section-title">Cast</h3>
                  <div className="cast-list">
                    {cast.map(person => (
                      <div key={person.id} className="cast-card">
                        <div className="cast-avatar">
                          {person.profile_path ? (
                            <img
                              src={getImageUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              loading="lazy"
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                              <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>👤</span>
                            </div>
                          )}
                        </div>
                        <div className="cast-name">{person.name}</div>
                        {person.character && <div className="cast-character">{person.character}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="movie-detail-section">
                  <h3 className="movie-detail-section-title">You May Also Like</h3>
                  <div className="similar-grid">
                    {recommendations.map(rec => (
                      <article
                        key={rec.id}
                        className="movie-card"
                        onClick={() => {
                          if (onSelect) {
                            onSelect(rec);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                        tabIndex={0}
                        role="button"
                        aria-label={rec.title}
                      >
                        <div className="movie-card-poster">
                          {rec.poster_path ? (
                            <img src={getImageUrl(rec.poster_path, 'w185')} alt={rec.title} loading="lazy" />
                          ) : (
                            <div className="poster-fallback"><ImageOff size={24} style={{ opacity: 0.3 }} /></div>
                          )}
                        </div>
                        <div className="movie-card-info" style={{ padding: '8px 10px 10px' }}>
                          <div className="movie-card-title" style={{ fontSize: '0.8125rem' }}>{rec.title}</div>
                          <div className="movie-card-year">{(rec.release_date || '').substring(0, 4)}</div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1300, background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}
          onClick={() => setShowTrailer(false)}
        >
          <div style={{ width: '100%', maxWidth: 900, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute', top: -40, right: 0, background: 'none', border: 'none',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem'
              }}
            >
              <X size={18} /> Close Trailer
            </button>
            <iframe
              src={trailerUrl}
              title={`${d.title} Trailer`}
              style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 12 }}
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
