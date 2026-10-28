import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { discoverMovies, hasToken } from '../services/tmdb';

const INDUSTRIES = [
  { id: 'hi', label: '🇮🇳 Bollywood', desc: 'Hindi Cinema' },
  { id: 'te', label: '🎬 Tollywood', desc: 'Telugu Cinema' },
  { id: 'ta', label: '🎭 Kollywood', desc: 'Tamil Cinema' },
  { id: 'ml', label: '🌿 Mollywood', desc: 'Malayalam Cinema' },
  { id: 'kn', label: '🌟 Sandalwood', desc: 'Kannada Cinema' },
  { id: 'bn', label: '🎨 Tollywood Bengali', desc: 'Bengali Cinema' },
  { id: 'mr', label: '🏛️ Marathi Cinema', desc: 'Marathi Films' },
  { id: 'pa', label: '🌾 Punjabi Cinema', desc: 'Punjabi Films' },
];

const IndianCinema = ({ onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [activeIndustry, setActiveIndustry] = useState('hi');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!hasToken()) { setLoading(false); return; }
    setLoading(true);
    discoverMovies({ with_original_language: activeIndustry, sort_by: 'popularity.desc', 'vote_count.gte': 10 }, page)
      .then(d => { setMovies(d.results || []); setTotalPages(Math.min(d.total_pages || 1, 20)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeIndustry, page]);

  const handleIndustry = (id) => { setActiveIndustry(id); setPage(1); setMovies([]); };

  const current = INDUSTRIES.find(i => i.id === activeIndustry);

  return (
    <main className="page-wrapper fade-in" id="indian-cinema-page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">🇮🇳 Indian Film Industries</span>
          <h1 className="section-title" style={{ marginTop: 6 }}>Indian Cinema</h1>
          <p className="section-subtitle">Explore the diverse world of Indian filmmaking</p>
        </div>

        {/* Industry Tabs */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32,
          padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          {INDUSTRIES.map(ind => (
            <button
              key={ind.id}
              className={`btn btn-sm ${activeIndustry === ind.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleIndustry(ind.id)}
              id={`industry-tab-${ind.id}`}
              aria-selected={activeIndustry === ind.id}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {current && (
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>{current.label}</h2>
            <p className="section-subtitle">{current.desc} — sorted by popularity</p>
          </div>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          skeletonCount={16}
          emptyMessage="No movies available for this industry right now."
        />

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

export default IndianCinema;
