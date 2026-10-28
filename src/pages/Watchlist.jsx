import React, { useMemo } from 'react';
import { BookmarkX, Film, Star, Globe, Trash2 } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getImageUrl } from '../services/tmdb';

const Watchlist = ({ watchlist, onSelect, onWatchlistToggle, isInWatchlist }) => {
  const stats = useMemo(() => {
    const langMap = {};
    const genreMap = {};
    watchlist.forEach(m => {
      if (m.original_language) langMap[m.original_language] = (langMap[m.original_language] || 0) + 1;
      (m.genre_ids || []).forEach(id => { genreMap[id] = (genreMap[id] || 0) + 1; });
    });
    const topLang = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() || '—';
    const avgRating = watchlist.length
      ? (watchlist.reduce((s, m) => s + (m.vote_average || 0), 0) / watchlist.length).toFixed(1)
      : '—';
    return { total: watchlist.length, avgRating, topLang };
  }, [watchlist]);

  if (watchlist.length === 0) {
    return (
      <main className="page-wrapper fade-in" id="watchlist-page-empty">
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div style={{ marginBottom: 32 }}>
            <span className="section-eyebrow">📌 Saved Films</span>
            <h1 className="section-title" style={{ marginTop: 6 }}>My Watchlist</h1>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookmarkX size={32} />
            </div>
            <h2 className="empty-state-title">Your watchlist is empty</h2>
            <p className="empty-state-desc">
              Start adding movies you want to watch by clicking the bookmark icon on any movie card.
              Your list saves automatically and persists across page refreshes.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper fade-in" id="watchlist-page">
      {/* Header */}
      <div className="watchlist-hero">
        <div className="container">
          <span className="section-eyebrow">📌 Saved Films</span>
          <h1 className="section-title" style={{ marginTop: 6, marginBottom: 8 }}>My Watchlist</h1>
          <p className="section-subtitle">Movies you've saved — synced to this browser</p>

          <div className="watchlist-stats">
            <div className="watchlist-stat-card">
              <div className="watchlist-stat-value">{stats.total}</div>
              <div className="watchlist-stat-label">Movies Saved</div>
            </div>
            <div className="watchlist-stat-card">
              <div className="watchlist-stat-value">{stats.avgRating}</div>
              <div className="watchlist-stat-label">Avg Rating</div>
            </div>
            <div className="watchlist-stat-card">
              <div className="watchlist-stat-value">{stats.topLang}</div>
              <div className="watchlist-stat-label">Top Language</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        <MovieGrid
          movies={watchlist}
          loading={false}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          emptyMessage="No movies in your watchlist."
        />
      </div>
    </main>
  );
};

export default Watchlist;
