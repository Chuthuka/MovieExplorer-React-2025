import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { Credits, Movie, MovieDetails, SearchResults, Video } from '../types/movie';

// API configuration
const API_URL = import.meta.env.VITE_TMDB_API_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // correct usage

// Axios instance (no Authorization header, TMDb uses api_key param)
const api = axios.create({
  baseURL: API_URL,
  params: {
    api_key: API_KEY,
  },
});

interface FilterOptions {
  genre: string;
  year: string;
  minRating: string;
}

interface MovieContextType {
  trendingMovies: Movie[];
  searchResults: Movie[];
  favorites: Movie[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchMovies: (query: string, page?: number, filters?: FilterOptions) => Promise<void>;
  getTrendingMovies: (page?: number, filters?: FilterOptions) => Promise<void>;
  getMovieDetails: (movieId: number) => Promise<MovieDetails | null>;
  getMovieCredits: (movieId: number) => Promise<Credits | null>;
  getMovieVideos: (movieId: number) => Promise<Video[]>;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  resetSearch: () => void;
  loadMoreResults: () => Promise<void>;
  loadMoreTrending: () => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType>({} as MovieContextType);

export const useMovies = () => useContext(MovieContext);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState<string>(() => localStorage.getItem('lastSearch') || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({ genre: '', year: '', minRating: '' });

  // ✅ Corrected: TMDb API call using api_key query param
  const getTrendingMovies = async (page = 1, filters?: FilterOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = { page };
      if (filters) {
        if (filters.genre) params.with_genres = filters.genre;
        if (filters.year) params.primary_release_year = filters.year;
        if (filters.minRating) params.vote_average_gte = filters.minRating;
      }

      const response = await api.get<SearchResults>('/trending/movie/day', { params });
      const movies = response.data.results || [];

      if (page === 1) setTrendingMovies(movies);
      else setTrendingMovies(prev => [...prev, ...movies]);

      setCurrentPage(response.data.page);
      setTotalPages(response.data.total_pages);
      setCurrentFilters(filters || { genre: '', year: '', minRating: '' });
    } catch (err) {
      console.error('Error fetching trending movies:', err);
      setError('Failed to fetch trending movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (query: string, page = 1, filters?: FilterOptions) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const params: any = {
        query,
        page,
        include_adult: false,
      };
      if (filters) {
        if (filters.genre) params.with_genres = filters.genre;
        if (filters.year) params.primary_release_year = filters.year;
        if (filters.minRating) params.vote_average_gte = filters.minRating;
      }

      const response = await api.get<SearchResults>('/search/movie', { params });
      const movies = response.data.results || [];

      if (page === 1) setSearchResults(movies);
      else setSearchResults(prev => [...prev, ...movies]);

      setCurrentPage(response.data.page);
      setTotalPages(response.data.total_pages);
      setCurrentFilters(filters || { genre: '', year: '', minRating: '' });

      localStorage.setItem('lastSearch', query);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to find movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreTrending = async () => {
    if (currentPage < totalPages) await getTrendingMovies(currentPage + 1, currentFilters);
  };
  const loadMoreResults = async () => {
    if (currentPage < totalPages) await searchMovies(searchQuery, currentPage + 1, currentFilters);
  };

  const resetSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    setCurrentPage(1);
    setCurrentFilters({ genre: '', year: '', minRating: '' });
    localStorage.removeItem('lastSearch');
  };

  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => {
      if (!prev.some(m => m.id === movie.id)) {
        const updated = [...prev, movie];
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => {
      const updated = prev.filter(m => m.id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (movieId: number) => favorites.some(m => m.id === movieId);

  const getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
    try {
      const response = await api.get<MovieDetails>(`/movie/${movieId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching movie details:', err);
      return null;
    }
  };

  const getMovieCredits = async (movieId: number): Promise<Credits | null> => {
    try {
      const response = await api.get<Credits>(`/movie/${movieId}/credits`);
      return response.data;
    } catch (err) {
      console.error('Error fetching movie credits:', err);
      return null;
    }
  };

  const getMovieVideos = async (movieId: number): Promise<Video[]> => {
    try {
      const response = await api.get(`/movie/${movieId}/videos`);
      return response.data.results || [];
    } catch (err) {
      console.error('Error fetching movie videos:', err);
      return [];
    }
  };

  useEffect(() => {
    getTrendingMovies();
    if (searchQuery) searchMovies(searchQuery);
  }, []);

  return (
    <MovieContext.Provider
      value={{
        trendingMovies,
        searchResults,
        favorites,
        searchQuery,
        isLoading,
        error,
        currentPage,
        totalPages,
        searchMovies,
        getTrendingMovies,
        getMovieDetails,
        getMovieCredits,
        getMovieVideos,
        addToFavorites,
        removeFromFavorites,
        resetSearch,
        loadMoreResults,
        loadMoreTrending,
        isFavorite,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;
