import React from 'react';
import { Clapperboard, ExternalLink } from 'lucide-react';

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FOOTER_NAV = {
  Explore: ['Trending Today', 'Top Rated', 'Now Playing', 'Upcoming', 'Hidden Gems'],
  Cinema: ['Bollywood', 'Telugu Cinema', 'Tamil Cinema', 'Malayalam Cinema', 'Korean Cinema'],
  Links: ['TMDB API', 'About TMDB', 'Privacy Policy', 'Terms of Use'],
};

const Footer = ({ onNavigate }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-brand-name serif">Cine<span>Verse</span></span>
            <p className="footer-desc">
              Discover your next great watch. CineVerse connects you with thousands of movies from around the world — powered by TMDB's comprehensive movie database.
            </p>
            <a
              href="https://github.com/smrithireddy10-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              id="footer-github-link"
              aria-label="GitHub profile: smrithireddy10-bot"
            >
              <GithubIcon size={16} />
              GitHub Profile
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Nav Columns */}
          {Object.entries(FOOTER_NAV).map(([title, links]) => (
            <div key={title}>
              <h3 className="footer-col-title">{title}</h3>
              <ul className="footer-links" role="list">
                {links.map(link => {
                  let handleClick = null;
                  let href = null;

                  if (link === 'Trending Today') handleClick = () => onNavigate('trending');
                  else if (link === 'Top Rated') handleClick = () => onNavigate('top-rated');
                  else if (link === 'Upcoming') handleClick = () => onNavigate('upcoming');
                  else if (['Bollywood', 'Telugu Cinema', 'Tamil Cinema', 'Malayalam Cinema'].includes(link)) handleClick = () => onNavigate('indian');
                  else if (link === 'Korean Cinema') handleClick = () => onNavigate('international');
                  else if (['Now Playing', 'Hidden Gems'].includes(link)) handleClick = () => onNavigate('home');
                  else if (link === 'TMDB API') href = 'https://developer.themoviedb.org';
                  else if (link === 'About TMDB') href = 'https://www.themoviedb.org/about';

                  return (
                    <li key={link}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
                          {link}
                        </a>
                      ) : handleClick ? (
                        <button
                          onClick={handleClick}
                          className="footer-link"
                          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                        >
                          {link}
                        </button>
                      ) : (
                        <span className="footer-link">
                          {link}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © {year} CineVerse. Movie data provided by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clapperboard size={16} style={{ color: 'var(--accent)' }} />
            <span className="footer-bottom-text">Built with React + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
