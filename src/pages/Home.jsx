import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCcw, AlertCircle } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import HeroSection from '../components/HeroSection';
import {
  getTrendingDay, getTrendingWeek, getPopular, getNowPlaying,
  getUpcoming, getGenres, getHiddenGems, getBollywood, getTelugu,
  getTamil, getMalayalam, getRecommendedByGenres, hasToken
} from '../services/tmdb';

const SectionRow = ({ title, eyebrow, subtitle, movies, loading, error, onSelect, onWatchlistToggle, isInWatchlist, onViewAll }) => (
  <section className="section" aria-labelledby={`section-${eyebrow?.replace(/\s+/g, '-').toLowerCase()}`}>
    <div className="container">
      <div className="section-header">
        <div className="section-title-group">
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2 className="section-title" id={`section-${eyebrow?.replace(/\s+/g, '-').toLowerCase()}`}>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {onViewAll && (
          <button className="view-all-btn" onClick={onViewAll} aria-label={`View all ${title}`}>
            View All <ChevronRight size={16} />
          </button>
        )}
      </div>
      {error ? (
        <div className="api-warning">
          <AlertCircle size={18} className="api-warning-icon" />
          <div>
            <div className="api-warning-title">
              {error === 'MISSING_TOKEN' ? 'API Token Required' : 'Failed to load'}
            </div>
            <div className="api-warning-desc">
              {error === 'MISSING_TOKEN'
                ? 'Add your TMDB token to .env to see live data.'
                : 'Check your connection and try again.'}
            </div>
          </div>
        </div>
      ) : (
        <MovieGrid
          movies={movies?.slice(0, 12)}
          loading={loading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          skeletonCount={8}
        />
      )}
    </div>
  </section>
);

const useSection = (fetcher) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!hasToken()) { setError('MISSING_TOKEN'); setLoading(false); return; }
    fetcher()
      .then(d => { setMovies(d.results || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);
  return { movies, loading, error };
};

const Home = ({ onSelect, onWatchlistToggle, isInWatchlist, onNavigate, onSurpriseOpen, watchlist }) => {
  const [genres, setGenres] = useState([]);
  const trending = useSection(() => getTrendingDay(1));
  const popular = useSection(() => getPopular(1));
  const nowPlaying = useSection(() => getNowPlaying(1));
  const upcoming = useSection(() => getUpcoming(1));
  const hiddenGems = useSection(() => getHiddenGems(1));
  const bollywood = useSection(() => getBollywood(1));
  const telugu = useSection(() => getTelugu(1));

  // Recommendation based on watchlist genres
  const [recMovies, setRecMovies] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    getGenres().then(d => setGenres(d.genres || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasToken()) { setRecLoading(false); return; }
    const genreIds = watchlist
      .flatMap(m => m.genre_ids || [])
      .reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const topGenres = Object.entries(genreIds).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => parseInt(id));
    const watchlistIds = new Set(watchlist.map(m => m.id));
    getRecommendedByGenres(topGenres, 1)
      .then(d => {
        const filtered = (d.results || []).filter(m => !watchlistIds.has(m.id));
        setRecMovies(filtered);
        setRecLoading(false);
      })
      .catch(() => setRecLoading(false));
  }, [watchlist]);

  return (
    <main className="page-wrapper fade-in" id="main-content">
      <HeroSection
        onSelect={onSelect}
        onWatchlistToggle={onWatchlistToggle}
        isInWatchlist={isInWatchlist}
        onSurpriseOpen={onSurpriseOpen}
        genres={genres}
      />

      <SectionRow
        eyebrow="🔥 Hot Right Now"
        title="Trending Today"
        subtitle="What the world is watching right now"
        movies={trending.movies}
        loading={trending.loading}
        error={trending.error}
        onSelect={onSelect}
        onWatchlistToggle={onWatchlistToggle}
        isInWatchlist={isInWatchlist}
        onViewAll={() => onNavigate('trending')}
      />

      <div style={{ background: 'var(--bg-secondary)', padding: '4px 0' }}>
        <SectionRow
          eyebrow="🎬 In Cinemas"
          title="Now Playing"
          subtitle="Currently showing in theatres"
          movies={nowPlaying.movies}
          loading={nowPlaying.loading}
          error={nowPlaying.error}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      </div>

      <SectionRow
        eyebrow="⭐ Fan Favourites"
        title="Most Popular"
        subtitle="Loved by millions of viewers worldwide"
        movies={popular.movies}
        loading={popular.loading}
        error={popular.error}
        onSelect={onSelect}
        onWatchlistToggle={onWatchlistToggle}
        isInWatchlist={isInWatchlist}
        onViewAll={() => onNavigate('discover')}
      />

      <div style={{ background: 'var(--bg-secondary)', padding: '4px 0' }}>
        <SectionRow
          eyebrow="🇮🇳 Bollywood"
          title="Hindi Cinema Highlights"
          subtitle="Top films from the world's biggest film industry"
          movies={bollywood.movies}
          loading={bollywood.loading}
          error={bollywood.error}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
          onViewAll={() => onNavigate('indian')}
        />
      </div>

      <SectionRow
        eyebrow="🎭 Telugu Cinema"
        title="Tollywood's Best"
        subtitle="Spectacular stories from Telugu cinema"
        movies={telugu.movies}
        loading={telugu.loading}
        error={telugu.error}
        onSelect={onSelect}
        onWatchlistToggle={onWatchlistToggle}
        isInWatchlist={isInWatchlist}
        onViewAll={() => onNavigate('indian')}
      />

      <div style={{ background: 'var(--bg-secondary)', padding: '4px 0' }}>
        <SectionRow
          eyebrow="💎 Underrated Gems"
          title="Hidden Gems"
          subtitle="Critically acclaimed films you might have missed"
          movies={hiddenGems.movies}
          loading={hiddenGems.loading}
          error={hiddenGems.error}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      </div>

      <SectionRow
        eyebrow="📅 Coming Soon"
        title="Upcoming Releases"
        subtitle="Get ready for what's next"
        movies={upcoming.movies}
        loading={upcoming.loading}
        error={upcoming.error}
        onSelect={onSelect}
        onWatchlistToggle={onWatchlistToggle}
        isInWatchlist={isInWatchlist}
        onViewAll={() => onNavigate('upcoming')}
      />

      <div style={{ background: 'var(--bg-secondary)', padding: '4px 0' }}>
        <SectionRow
          eyebrow="✨ For You"
          title="Recommended For You"
          subtitle={watchlist.length > 0 ? 'Based on your watchlist preferences' : 'Discover highly acclaimed cinema'}
          movies={recMovies}
          loading={recLoading}
          onSelect={onSelect}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
      </div>
    </main>
  );
};

export default Home;
