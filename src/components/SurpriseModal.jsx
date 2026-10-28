import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Play, Bookmark, Star, RefreshCw, Film } from 'lucide-react';
import { discoverMovies, getImageUrl, getYouTubeEmbedUrl, findTrailer, getMovieDetails } from '../services/tmdb';

const MOODS = [
  { id: 'all', label: '🌟 Any Great Movie', params: { sort_by: 'popularity.desc', 'vote_count.gte': 100 } },
  { id: 'action', label: '💥 Action & Thriller', params: { with_genres: '28,53', sort_by: 'popularity.desc', 'vote_count.gte': 100 } },
  { id: 'comedy', label: '😂 Feel-Good Comedy', params: { with_genres: '35', sort_by: 'popularity.desc', 'vote_count.gte': 80 } },
  { id: 'scifi', label: '🚀 Mind-Bending Sci-Fi', params: { with_genres: '878', sort_by: 'vote_average.desc', 'vote_count.gte': 200 } },
  { id: 'horror', label: '🔪 Late Night Horror', params: { with_genres: '27', sort_by: 'popularity.desc', 'vote_count.gte': 50 } },
  { id: 'romance', label: '💖 Romance & Drama', params: { with_genres: '10749,18', sort_by: 'popularity.desc', 'vote_count.gte': 50 } },
  { id: 'indian', label: '🇮🇳 Indian Cinema', params: { with_original_language: 'hi|te|ta', sort_by: 'popularity.desc', 'vote_count.gte': 10 } },
  { id: 'korean', label: '🇰🇷 Korean Cinema', params: { with_original_language: 'ko', sort_by: 'popularity.desc', 'vote_count.gte': 30 } },
  { id: 'acclaimed', label: '🏆 Masterpieces (8.0+ ★)', params: { 'vote_average.gte': 8.0, 'vote_count.gte': 300, sort_by: 'vote_average.desc' } },
];

const SurpriseModal = ({ onClose, onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [selectedMood, setSelectedMood] = useState('all');
  const [spinning, setSpinning] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');
  const [winner, setWinner] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onClose]);

  const handleSpin = async () => {
    setError(null);
    setSpinning(true);
    setWinner(null);
    setWinnerDetails(null);
    setTrailerOpen(false);

    try {
      const moodConfig = MOODS.find(m => m.id === selectedMood) || MOODS[0];
      // Randomize page between 1 and 5 for diverse surprises
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const data = await discoverMovies(moodConfig.params, randomPage);
      const movies = (data.results || []).filter(m => m.title && (m.poster_path || m.backdrop_path));

      if (movies.length === 0) {
        throw new Error('No movies found for this mood. Try another one!');
      }

      // Fast reel cycle animation
      let step = 0;
      const totalSteps = 14;
      const interval = 80;

      timerRef.current = setInterval(() => {
        const tempMovie = movies[Math.floor(Math.random() * movies.length)];
        setDisplayTitle(tempMovie.title);
        step++;

        if (step >= totalSteps) {
          clearInterval(timerRef.current);
          const finalPick = movies[Math.floor(Math.random() * movies.length)];
          setWinner(finalPick);
          setDisplayTitle(finalPick.title);
          setSpinning(false);

          // Fetch full details for trailer
          getMovieDetails(finalPick.id)
            .then(d => setWinnerDetails(d))
            .catch(() => {});
        }
      }, interval);
    } catch (err) {
      setError(err.message || 'Failed to draw a movie. Please try again.');
      setSpinning(false);
    }
  };

  const inList = winner ? isInWatchlist(winner.id) : false;
  const trailer = winnerDetails ? findTrailer(winnerDetails.videos) : null;
  const trailerEmbed = trailer ? getYouTubeEmbedUrl(trailer.key) : null;

  return (
    <div
      className="roulette-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Movie Roulette Surprise Me"
      id="surprise-roulette-modal"
    >
      <div className="roulette-modal">
        <button
          className="roulette-close"
          onClick={onClose}
          aria-label="Close Movie Roulette"
        >
          <X size={18} />
        </button>

        <div className="roulette-header">
          <div className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> Can't decide what to watch?
          </div>
          <h2 className="roulette-title serif">Movie Roulette</h2>
          <p className="roulette-subtitle">
            Pick your mood, hit spin, and let destiny choose your next movie!
          </p>
        </div>

        {/* Mood Selector */}
        <div className="mood-selector" role="radiogroup" aria-label="Select movie mood">
          {MOODS.map(m => (
            <button
              key={m.id}
              className={`mood-btn ${selectedMood === m.id ? 'active' : ''}`}
              onClick={() => { setSelectedMood(m.id); setWinner(null); }}
              type="button"
              role="radio"
              aria-checked={selectedMood === m.id}
              disabled={spinning}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Spin Box */}
        <div className="roulette-action-box">
          <button
            className="spin-btn"
            onClick={handleSpin}
            disabled={spinning}
            id="roulette-spin-btn"
          >
            {spinning ? (
              <>
                <RefreshCw size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
                Selecting your movie…
              </>
            ) : winner ? (
              <>
                <RefreshCw size={20} />
                Spin Again
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Spin The Wheel
              </>
            )}
          </button>

          {spinning && (
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent)',
              textAlign: 'center',
              minHeight: 36,
              letterSpacing: '0.02em',
              animation: 'pulse 0.4s ease infinite alternate'
            }}>
              🎬 {displayTitle || 'Finding perfection…'}
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--accent)', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>

        {/* Winner Display */}
        {winner && !spinning && (
          <div className="roulette-result-card" id="roulette-winner-card">
            <div className="roulette-poster">
              {winner.poster_path ? (
                <img
                  src={getImageUrl(winner.poster_path, 'w342')}
                  alt={winner.title}
                  loading="lazy"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Film size={32} style={{ opacity: 0.3 }} />
                </div>
              )}
            </div>

            <div className="roulette-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-accent">🎯 Destiny's Pick</span>
                {winner.vote_average > 0 && (
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Star size={13} fill="currentColor" /> {winner.vote_average.toFixed(1)}
                  </span>
                )}
                {winner.release_date && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {winner.release_date.substring(0, 4)}
                  </span>
                )}
              </div>

              <h3 className="roulette-movie-title serif">{winner.title}</h3>

              {winner.overview && (
                <p className="roulette-overview">{winner.overview}</p>
              )}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onClose();
                    onSelect(winner);
                  }}
                  id="roulette-view-details-btn"
                >
                  <Play size={14} fill="currentColor" /> View Full Details
                </button>

                {trailerEmbed && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setTrailerOpen(true)}
                    id="roulette-trailer-btn"
                  >
                    <Play size={14} /> Watch Trailer
                  </button>
                )}

                <button
                  className={`btn btn-secondary btn-sm ${inList ? 'btn-active' : ''}`}
                  onClick={() => onWatchlistToggle(winner)}
                  id="roulette-watchlist-btn"
                >
                  <Bookmark size={14} fill={inList ? 'currentColor' : 'none'} />
                  {inList ? 'Saved' : 'Watchlist'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Trailer Modal */}
        {trailerOpen && trailerEmbed && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 1350, background: 'rgba(0,0,0,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
            onClick={() => setTrailerOpen(false)}
          >
            <div style={{ width: '100%', maxWidth: 840, position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setTrailerOpen(false)}
                style={{
                  position: 'absolute', top: -36, right: 0, background: 'none', border: 'none',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem'
                }}
              >
                <X size={18} /> Close Trailer
              </button>
              <iframe
                src={trailerEmbed}
                title={`${winner.title} Trailer`}
                style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 12 }}
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurpriseModal;
