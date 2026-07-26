import React, { useState } from 'react';
import { MovieProvider, useMovies } from './context/MovieContext';
import { SkeletonCard } from './components/SkeletonCard';
import { EmptyState } from './components/EmptyState';

const QUICK_CATEGORIES = ['Avengers', 'Batman', 'Spiderman', 'Harry Potter', 'Bollywood', 'Anime'];

// Safe Poster Image Handler (HTTP to HTTPS + Fallback)
const getSafePoster = (posterUrl) => {
  if (!posterUrl || posterUrl === 'N/A') {
    return 'https://via.placeholder.com/300x450/1e293b/38bdf8?text=Poster+Not+Available';
  }
  return posterUrl.replace('http://', 'https://');
};

const MovieApp = () => {
  const {
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
  } = useMovies();

  const [inputVal, setInputVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchTerm(inputVal);
      fetchMovies(inputVal);
    }
  };

  const handleCategoryClick = (cat) => {
    setSearchTerm(cat);
    fetchMovies(cat);
  };

  const currentList = activeTab === 'browse' ? movies : watchlist;

  return (
    <div style={styles.appContainer}>
      {/* Toast Notification */}
      {toast && (
        <div style={toast.type === 'info' ? styles.toastInfo : styles.toastSuccess}>
          {toast.msg}
        </div>
      )}

      {/* Navbar Header */}
      <header style={styles.navbar}>
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🍿</span>
          <h1 style={styles.logo}>CINE<span style={{ color: '#0284c7' }}>VAULT</span></h1>
        </div>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search movies, series..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>🔍 Search</button>
        </form>

        <div style={styles.tabs}>
          <button
            style={activeTab === 'browse' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab('browse')}
          >
            Explore
          </button>
          <button
            style={activeTab === 'watchlist' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>
      </header>

      {/* Hero Quick Category Chips */}
      {activeTab === 'browse' && (
        <div style={styles.categoryBar}>
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Trending Tags:</span>
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={searchTerm.toLowerCase() === cat.toLowerCase() ? styles.activeChip : styles.chip}
            >
              #{cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {activeTab === 'browse' ? `Results for "${searchTerm}"` : 'Your Personal Watchlist'}
          </h2>
          <span style={styles.badge}>{currentList.length} Items</span>
        </div>

        <div style={styles.grid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : currentList.length > 0 ? (
            currentList.map((movie) => {
              const isSaved = watchlist.some((m) => m.imdbID === movie.imdbID);
              return (
                <div key={movie.imdbID} style={styles.card}>
                  <div style={styles.posterContainer} onClick={() => fetchMovieDetails(movie.imdbID)}>
                    <img
                      src={getSafePoster(movie.Poster)}
                      alt={movie.Title}
                      style={styles.poster}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450/1e293b/38bdf8?text=Poster+Not+Available';
                      }}
                    />
                    <div style={styles.overlay}>
                      <span style={styles.viewDetailsText}>ℹ Click for Plot Details</span>
                    </div>
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.movieHeader}>
                      <h3 style={styles.movieTitle}>{movie.Title}</h3>
                      <span style={styles.yearBadge}>{movie.Year}</span>
                    </div>
                    <button
                      onClick={() => toggleWatchlist(movie)}
                      style={isSaved ? styles.removeBtn : styles.addBtn}
                    >
                      {isSaved ? '✖ Remove' : '🔖 Add to Watchlist'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              message={
                activeTab === 'browse'
                  ? `No titles found matching "${searchTerm}". Try another keyword!`
                  : 'Your Watchlist is empty. Click "+ Add to Watchlist" on any movie!'
              }
              icon={activeTab === 'browse' ? '🔎' : '🎬'}
            />
          )}
        </div>
      </main>

      {/* Movie Details Modal Popup */}
      {(selectedMovie || modalLoading) && (
        <div style={styles.modalOverlay} onClick={() => setSelectedMovie(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {modalLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading Movie Specs...</div>
            ) : (
              selectedMovie && (
                <div style={styles.modalBody}>
                  <img
                    src={getSafePoster(selectedMovie.Poster)}
                    alt={selectedMovie.Title}
                    style={styles.modalPoster}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/1e293b/38bdf8?text=Poster+Not+Available';
                    }}
                  />
                  <div style={styles.modalDetails}>
                    <h2 style={styles.modalTitle}>{selectedMovie.Title}</h2>
                    <div style={styles.modalMeta}>
                      <span style={styles.imdbTag}>⭐ {selectedMovie.imdbRating} / 10</span>
                      <span>{selectedMovie.Runtime}</span>
                      <span>{selectedMovie.Genre}</span>
                    </div>
                    <p style={styles.modalPlot}>{selectedMovie.Plot}</p>
                    <p style={styles.modalSub}><strong>Actors:</strong> {selectedMovie.Actors}</p>
                    <p style={styles.modalSub}><strong>Director:</strong> {selectedMovie.Director}</p>
                    <button style={styles.closeBtn} onClick={() => setSelectedMovie(null)}>Close Window</button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <MovieApp />
    </MovieProvider>
  );
}

// Ultra Professional Styles System
const styles = {
  appContainer: {
    backgroundColor: '#090d16',
    minHeight: '100vh',
    color: '#f1f5f9',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    position: 'relative',
  },
  toastSuccess: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
  toastInfo: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 48px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px' },
  logo: { fontSize: '24px', fontWeight: '800', letterSpacing: '1px', color: '#fff' },
  searchForm: { display: 'flex', gap: '8px', flex: '1', maxWidth: '420px', margin: '0 20px' },
  searchInput: {
    width: '100%',
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#fff',
    outline: 'none',
  },
  searchBtn: {
    padding: '10px 18px',
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  tabs: { display: 'flex', gap: '8px' },
  tabBtn: {
    padding: '8px 18px',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '600',
  },
  activeTabBtn: {
    padding: '8px 18px',
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '700',
  },
  categoryBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 48px',
    backgroundColor: '#0c1322',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    overflowX: 'auto',
  },
  chip: {
    padding: '6px 14px',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    border: '1px solid #334155',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  activeChip: {
    padding: '6px 14px',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
  },
  mainContent: { padding: '36px 48px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' },
  sectionTitle: { fontSize: '24px', fontWeight: '700' },
  badge: {
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #334155',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '28px',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  posterContainer: { position: 'relative', cursor: 'pointer', overflow: 'hidden' },
  poster: { width: '100%', height: '320px', objectFit: 'cover', display: 'block' },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  viewDetailsText: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  cardInfo: { padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' },
  movieHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  movieTitle: { fontSize: '15px', fontWeight: '700', lineHeight: '1.3' },
  yearBadge: { backgroundColor: '#334155', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1' },
  addBtn: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  removeBtn: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderRadius: '20px',
    maxWidth: '700px',
    width: '100%',
    overflow: 'hidden',
    border: '1px solid #334155',
  },
  modalBody: { display: 'flex', gap: '24px', padding: '24px', flexWrap: 'wrap' },
  modalPoster: { width: '220px', borderRadius: '12px', objectFit: 'cover' },
  modalDetails: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  modalTitle: { fontSize: '26px', fontWeight: '800' },
  modalMeta: { display: 'flex', gap: '12px', fontSize: '14px', color: '#94a3b8', alignItems: 'center' },
  imdbTag: { backgroundColor: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' },
  modalPlot: { lineHeight: '1.6', color: '#cbd5e1', fontSize: '14px' },
  modalSub: { fontSize: '13px', color: '#94a3b8' },
  closeBtn: {
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
