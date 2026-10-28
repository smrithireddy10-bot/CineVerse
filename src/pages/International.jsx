import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { discoverMovies, hasToken } from '../services/tmdb';

const COUNTRIES = [
  { id: 'ja', label: '🇯🇵 Japanese', desc: 'Japanese Cinema' },
  { id: 'ko', label: '🇰🇷 Korean', desc: 'Korean Cinema (K-Cinema)' },
  { id: 'zh', label: '🇨🇳 Chinese', desc: 'Chinese-Language Cinema' },
  { id: 'es', label: '🇪🇸 Spanish', desc: 'Spanish Cinema' },
  { id: 'fr', label: '🇫🇷 French', desc: 'French Cinema' },
  { id: 'de', label: '🇩🇪 German', desc: 'German Cinema' },
  { id: 'it', label: '🇮🇹 Italian', desc: 'Italian Cinema' },
  { id: 'pt', label: '🇧🇷 Portuguese', desc: 'Portuguese Cinema' },
  { id: 'ru', label: '🇷🇺 Russian', desc: 'Russian Cinema' },
  { id: 'ar', label: '🌙 Arabic', desc: 'Arabic-Language Cinema' },
  { id: 'tr', label: '🇹🇷 Turkish', desc: 'Turkish Cinema' },
  { id: 'id', label: '🇮🇩 Indonesian', desc: 'Indonesian Cinema' },
  { id: 'th', label: '🇹🇭 Thai', desc: 'Thai Cinema' },
];

const International = ({ onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [activeLang, setActiveLang] = useState('ko');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!hasToken()) { setLoading(false); return; }
    setLoading(true);
    discoverMovies({ with_original_language: activeLang, sort_by: 'popularity.desc', 'vote_count.gte': 20 }, page)
      .then(d => { setMovies(d.results || []); setTotalPages(Math.min(d.total_pages || 1, 20)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeLang, page]);

  const handleLang = (id) => { setActiveLang(id); setPage(1); setMovies([]); };
  const current = COUNTRIES.find(c => c.id === activeLang);

  return (
    <main className="page-wrapper fade-in" id="international-page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">🌍 World Cinema</span>
          <h1 className="section-title" style={{ marginTop: 6 }}>International Cinema</h1>
          <p className="section-subtitle">Discover remarkable films from around the globe</p>
        </div>

        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32,
          padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${activeLang === c.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleLang(c.id)}
              id={`intl-tab-${c.id}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {current && (
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>{current.label}</h2>
            <p className="section-subtitle">{current.desc}</p>
          </div>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          skeletonCount={16}
          emptyMessage="No movies available for this region right now."
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

export default International;
