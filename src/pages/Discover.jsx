import React, { useState, useEffect, useCallback } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { discoverMovies, getGenres, LANGUAGE_OPTIONS, SORT_OPTIONS, hasToken } from '../services/tmdb';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => currentYear - i);

const Discover = ({ onSelect, onWatchlistToggle, isInWatchlist }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    language: '',
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'popularity.desc',
  });
  const [appliedFilters, setAppliedFilters] = useState({ sortBy: 'popularity.desc' });

  useEffect(() => {
    if (hasToken()) getGenres().then(d => setGenres(d.genres || [])).catch(() => {});
  }, []);

  const fetchMovies = useCallback((params, pg = 1) => {
    if (!hasToken()) { setLoading(false); return; }
    setLoading(true);
    const apiParams = { sort_by: params.sortBy || 'popularity.desc' };
    if (params.language) apiParams.with_original_language = params.language;
    if (params.genre) apiParams.with_genres = params.genre;
    if (params.year) apiParams.primary_release_year = params.year;
    if (params.minRating) apiParams['vote_average.gte'] = params.minRating;
    apiParams['vote_count.gte'] = 20;

    discoverMovies(apiParams, pg)
      .then(d => {
        setMovies(d.results || []);
        setTotalPages(Math.min(d.total_pages || 1, 20));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMovies(appliedFilters, page);
  }, [appliedFilters, page, fetchMovies]);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setPage(1);
  };

  const resetFilters = () => {
    const reset = { sortBy: 'popularity.desc' };
    setFilters({ language: '', genre: '', year: '', minRating: '', sortBy: 'popularity.desc' });
    setAppliedFilters(reset);
    setPage(1);
  };

  const removeFilter = (key) => {
    const updated = { ...appliedFilters };
    delete updated[key];
    if (!updated.sortBy) updated.sortBy = 'popularity.desc';
    setAppliedFilters(updated);
    setFilters(f => ({ ...f, [key]: '' }));
    setPage(1);
  };

  const activeChips = Object.entries(appliedFilters)
    .filter(([k, v]) => v && k !== 'sortBy')
    .map(([k, v]) => {
      let label = '';
      if (k === 'language') label = `Language: ${LANGUAGE_OPTIONS.find(l => l.code === v)?.name || v}`;
      if (k === 'genre') label = `Genre: ${genres.find(g => String(g.id) === String(v))?.name || v}`;
      if (k === 'year') label = `Year: ${v}`;
      if (k === 'minRating') label = `Min Rating: ${v}+`;
      return { key: k, label };
    });

  return (
    <main className="page-wrapper fade-in" id="discover-page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span className="section-eyebrow">🔍 Explore</span>
            <h1 className="section-title" style={{ marginTop: 6 }}>Discover Movies</h1>
            <p className="section-subtitle">Filter by language, genre, year, and more</p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(f => !f)}
            id="toggle-filters-btn"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filters-panel" role="search" aria-label="Movie filters">
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-language">Language / Industry</label>
              <select
                id="filter-language"
                className="filter-select"
                value={filters.language}
                onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
              >
                <option value="">All Languages</option>
                {LANGUAGE_OPTIONS.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-genre">Genre</label>
              <select
                id="filter-genre"
                className="filter-select"
                value={filters.genre}
                onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-year">Release Year</label>
              <select
                id="filter-year"
                className="filter-select"
                value={filters.year}
                onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
              >
                <option value="">Any Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-rating">Min Rating</label>
              <select
                id="filter-rating"
                className="filter-select"
                value={filters.minRating}
                onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
              >
                <option value="">Any Rating</option>
                {[9, 8, 7, 6, 5].map(r => <option key={r} value={r}>{r}+ ★</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-sort">Sort By</label>
              <select
                id="filter-sort"
                className="filter-select"
                value={filters.sortBy}
                onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
              >
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-ghost btn-sm" onClick={resetFilters} id="reset-filters-btn">
                <X size={14} /> Reset
              </button>
              <button className="btn btn-primary btn-sm" onClick={applyFilters} id="apply-filters-btn">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {activeChips.map(chip => (
              <div key={chip.key} className="filter-chip">
                {chip.label}
                <button
                  className="filter-chip-remove"
                  onClick={() => removeFilter(chip.key)}
                  aria-label={`Remove filter: ${chip.label}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          skeletonCount={16}
          emptyMessage="No movies match your filters. Try adjusting or resetting them."
        />

        {/* Pagination */}
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

export default Discover;
