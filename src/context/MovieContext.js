import React, { createContext, useState, useContext, useEffect } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('Avengers');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMovies = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/movies?s=${query}`);
      const data = await res.json();
      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    setModalLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=trilogy`);
      const data = await res.json();
      setSelectedMovie(data);
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  const toggleWatchlist = (movie) => {
    const exists = watchlist.some((m) => m.imdbID === movie.imdbID);
    if (exists) {
      setWatchlist(watchlist.filter((m) => m.imdbID !== movie.imdbID));
      showToast(`Removed "${movie.Title}" from Watchlist`, 'info');
    } else {
      setWatchlist([...watchlist, movie]);
      showToast(`Added "${movie.Title}" to Watchlist!`, 'success');
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        watchlist,
        loading,
        searchTerm,
        setSearchTerm,
        fetchMovies,
        toggleWatchlist,
        activeTab,
        setActiveTab,
        selectedMovie,
        setSelectedMovie,
        fetchMovieDetails,
        modalLoading,
        toast,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
