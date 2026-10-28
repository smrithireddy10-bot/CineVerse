import React, { useState, useEffect, useRef } from 'react';
import { Film, Search, Sun, Moon, Bookmark, Menu, X, Clapperboard, TrendingUp, Star, Clock, Globe, Heart, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Film size={18} /> },
  { id: 'discover', label: 'Discover', icon: <SlidersHorizontal size={18} /> },
  { id: 'trending', label: 'Trending', icon: <TrendingUp size={18} /> },
  { id: 'top-rated', label: 'Top Rated', icon: <Star size={18} /> },
  { id: 'upcoming', label: 'Upcoming', icon: <Clock size={18} /> },
  { id: 'indian', label: 'Indian Cinema', icon: <Clapperboard size={18} /> },
  { id: 'international', label: 'International', icon: <Globe size={18} /> },
  { id: 'watchlist', label: 'Watchlist', icon: <Heart size={18} /> },
];

const Navbar = ({ currentPage, onNavigate, onSearchOpen, onSurpriseOpen, theme, onThemeToggle, watchlistCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'at-top'}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <button className="nav-logo" onClick={() => handleNav('home')} aria-label="CineVerse Home">
            <div className="nav-logo-icon">
              <Clapperboard size={20} color="#1A0F00" strokeWidth={2.5} />
            </div>
            <span className="nav-logo-text">Cine<span>Verse</span></span>
          </button>

          {/* Desktop Nav */}
          <ul className="nav-links" role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <button
              className="nav-search-btn"
              onClick={onSurpriseOpen}
              aria-label="Movie Roulette — Surprise Me"
              id="nav-surprise-btn"
              title="Movie Roulette — Surprise Me"
              style={{ color: 'var(--accent)' }}
            >
              <Sparkles size={18} />
            </button>
            <button
              className="nav-search-btn"
              onClick={onSearchOpen}
              aria-label="Open search"
              id="nav-search-btn"
            >
              <Search size={18} />
            </button>
            <button
              className="nav-theme-btn"
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              id="nav-theme-toggle"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="nav-watchlist-btn"
              onClick={() => handleNav('watchlist')}
              aria-label={`My Watchlist (${watchlistCount} items)`}
              id="nav-watchlist-btn"
            >
              <Bookmark size={16} />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span style={{
                  background: 'var(--accent)',
                  color: '#1A0F00',
                  borderRadius: '999px',
                  padding: '1px 7px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  marginLeft: 2,
                }}>
                  {watchlistCount}
                </span>
              )}
            </button>
            <button
              className="nav-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              id="nav-hamburger-btn"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.id)}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            {item.icon}
            {item.label}
            {item.id === 'watchlist' && watchlistCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: 'var(--accent)',
                color: '#1A0F00',
                borderRadius: '999px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 800,
              }}>
                {watchlistCount}
              </span>
            )}
            <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.4 }} />
          </button>
        ))}
        <div className="mobile-menu-divider" />
        <button
          className="mobile-nav-link"
          onClick={() => { setMenuOpen(false); onSurpriseOpen(); }}
          style={{ color: 'var(--accent)', fontWeight: 700 }}
        >
          <Sparkles size={18} />
          Movie Roulette (Surprise Me)
        </button>
        <button className="mobile-nav-link" onClick={onSearchOpen}>
          <Search size={18} />
          Search Movies
        </button>
        <button className="mobile-nav-link" onClick={onThemeToggle}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </>
  );
};

export default Navbar;
