// ============================================================
// TMDB API Service
// Centralized API integration for CineVerse
// Uses Read Access Token (Bearer auth) as per TMDB docs
// IMPORTANT: VITE_ prefixed variables are client-side visible
// ============================================================

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Simple in-memory request cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ==================== IMAGE HELPERS ====================
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};

// ==================== REQUEST HELPER ====================
const request = async (endpoint, params = {}, signal = null) => {
  if (!ACCESS_TOKEN && !API_KEY) {
    throw new Error('MISSING_TOKEN');
  }

  const cacheKey = endpoint + JSON.stringify(params);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, val);
    }
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  } else if (API_KEY) {
    url.searchParams.append('api_key', API_KEY);
  }

  const options = { headers };
  if (signal) options.signal = signal;

  const response = await fetch(url.toString(), options);

  if (response.status === 429) {
    throw new Error('RATE_LIMITED');
  }
  if (!response.ok) {
    throw new Error(`HTTP_ERROR_${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('JSON_PARSE_ERROR');
  }

  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

// ==================== TRENDING ====================
export const getTrendingDay = (page = 1) =>
  request('/trending/movie/day', { page });

export const getTrendingWeek = (page = 1) =>
  request('/trending/movie/week', { page });

// ==================== MOVIES ====================
export const getPopular = (page = 1) =>
  request('/movie/popular', { page });

export const getTopRated = (page = 1) =>
  request('/movie/top_rated', { page });

export const getNowPlaying = (page = 1) =>
  request('/movie/now_playing', { page });

export const getUpcoming = (page = 1) =>
  request('/movie/upcoming', { page });

// ==================== SEARCH ====================
export const searchMovies = (query, page = 1, signal = null) =>
  request('/search/movie', { query, page, include_adult: false }, signal);

// ==================== DISCOVER ====================
export const discoverMovies = (filters = {}, page = 1) => {
  const params = { page, include_adult: false, ...filters };
  return request('/discover/movie', params);
};

// ==================== GENRES ====================
export const getGenres = () =>
  request('/genre/movie/list', { language: 'en-US' });

// ==================== LANGUAGES ====================
export const getLanguages = () =>
  request('/configuration/languages');

// ==================== MOVIE DETAILS ====================
export const getMovieDetails = (movieId) =>
  request(`/movie/${movieId}`, { append_to_response: 'credits,videos,recommendations,similar,watch/providers' });

export const getWatchProviders = (movieId) =>
  request(`/movie/${movieId}/watch/providers`);

export const getMovieCredits = (movieId) =>
  request(`/movie/${movieId}/credits`);

export const getMovieVideos = (movieId) =>
  request(`/movie/${movieId}/videos`);

export const getMovieRecommendations = (movieId, page = 1) =>
  request(`/movie/${movieId}/recommendations`, { page });

// ==================== INDIAN CINEMA ====================
export const getBollywood = (page = 1) =>
  discoverMovies({ with_original_language: 'hi', sort_by: 'popularity.desc', 'vote_count.gte': 50 }, page);

export const getTelugu = (page = 1) =>
  discoverMovies({ with_original_language: 'te', sort_by: 'popularity.desc', 'vote_count.gte': 20 }, page);

export const getTamil = (page = 1) =>
  discoverMovies({ with_original_language: 'ta', sort_by: 'popularity.desc', 'vote_count.gte': 20 }, page);

export const getMalayalam = (page = 1) =>
  discoverMovies({ with_original_language: 'ml', sort_by: 'popularity.desc', 'vote_count.gte': 10 }, page);

export const getKannada = (page = 1) =>
  discoverMovies({ with_original_language: 'kn', sort_by: 'popularity.desc', 'vote_count.gte': 10 }, page);

// ==================== INTERNATIONAL ====================
export const getByLanguage = (langCode, page = 1) =>
  discoverMovies({ with_original_language: langCode, sort_by: 'popularity.desc', 'vote_count.gte': 50 }, page);

// ==================== HIDDEN GEMS ====================
export const getHiddenGems = (page = 1) =>
  discoverMovies({
    sort_by: 'vote_average.desc',
    'vote_count.gte': 200,
    'vote_count.lte': 2000,
    'vote_average.gte': 7.5,
  }, page);

// ==================== RECOMMENDATIONS ====================
export const getRecommendedByGenres = (genreIds, page = 1) => {
  if (!genreIds || genreIds.length === 0) return getTopRated(page);
  const genreStr = genreIds.slice(0, 3).join('|');
  return discoverMovies({
    with_genres: genreStr,
    sort_by: 'vote_average.desc',
    'vote_count.gte': 100,
  }, page);
};

// ==================== TRAILER HELPER ====================
export const findTrailer = (videos) => {
  if (!videos || !videos.results) return null;
  const ytVideos = videos.results.filter(v => v.site === 'YouTube');
  return (
    ytVideos.find(v => v.type === 'Trailer' && v.official) ||
    ytVideos.find(v => v.type === 'Trailer') ||
    ytVideos.find(v => v.type === 'Teaser') ||
    ytVideos[0] ||
    null
  );
};

export const getYouTubeUrl = (key) =>
  key ? `https://www.youtube.com/watch?v=${key}` : null;

export const getYouTubeEmbedUrl = (key) =>
  key ? `https://www.youtube.com/embed/${key}?autoplay=1&rel=0` : null;

// ==================== LANGUAGE CODES ====================
export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (Bollywood)' },
  { code: 'te', name: 'Telugu (Tollywood)' },
  { code: 'ta', name: 'Tamil (Kollywood)' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Mandarin)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Indonesian' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
];

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'title.asc', label: 'Title A–Z' },
];

export const hasToken = () => Boolean(ACCESS_TOKEN || API_KEY);
