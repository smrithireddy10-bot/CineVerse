import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getTrendingDay, getTrendingWeek, hasToken } from '../services/tmdb';

const Trending = ({ onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [activeTab, setActiveTab] = useState('day');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!hasToken()) { setError('MISSING_TOKEN'); setLoading(false); return; }
    setLoading(true);
    const fetcher = activeTab === 'day' ? getTrendingDay : getTrendingWeek;
    fetcher(page)
      .then(d => {
        setMovies(d.results || []);
        setTotalPages(Math.min(d.total_pages || 1, 10));
        setLoading(false);
        setError(null);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [activeTab, page]);

  const handleTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setMovies([]);
  };

  return (
    <main className="page-wrapper fade-in" id="trending-page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="section-eyebrow">📈 Charts</span>
          <h1 className="section-title" style={{ marginTop: 6 }}>Trending Movies</h1>
          <p className="section-subtitle">Real-time trending from TMDB</p>
        </div>

        <div className="page-tabs" role="tablist">
          <button
            className={`page-tab ${activeTab === 'day' ? 'active' : ''}`}
            onClick={() => handleTab('day')}
            role="tab"
            aria-selected={activeTab === 'day'}
            id="tab-trending-day"
          >
            Today
          </button>
          <button
            className={`page-tab ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => handleTab('week')}
            role="tab"
            aria-selected={activeTab === 'week'}
            id="tab-trending-week"
          >
            This Week
          </button>
        </div>

        <MovieGrid
          movies={movies}
          loading={loading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          emptyMessage="No trending data available right now."
        />

        {/* Pagination */}
        {!loading && movies.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '40px 0' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Trending;
