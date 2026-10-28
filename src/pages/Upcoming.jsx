import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getUpcoming, hasToken } from '../services/tmdb';

const Upcoming = ({ onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!hasToken()) { setLoading(false); return; }
    setLoading(true);
    getUpcoming(page)
      .then(d => { setMovies(d.results || []); setTotalPages(Math.min(d.total_pages || 1, 10)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <main className="page-wrapper fade-in" id="upcoming-page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="section-eyebrow">📅 Coming Soon</span>
          <h1 className="section-title" style={{ marginTop: 6 }}>Upcoming Releases</h1>
          <p className="section-subtitle">Be the first to know what's coming to theatres</p>
        </div>
        <MovieGrid movies={movies} loading={loading} onSelect={onSelect} onWatchlistToggle={onWatchlistToggle} isInWatchlist={isInWatchlist} />
        {!loading && movies.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '40px 0' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={16} /> Previous
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Upcoming;
