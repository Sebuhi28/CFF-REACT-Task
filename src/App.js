import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import FilmSide from './components/FilmSide';
import Favorite from './components/Favorite';

function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const handleAddFavorite = (movie) => {
    if (!movie || !movie.id) return;
    const id = movie.id || movie.imdbID;
    const title = movie.title || movie.Title || '';
    const year = movie.releaseYear || movie.Year || (movie.release_date ? movie.release_date.split('-')[0] : 'Unknown');
    const poster = movie.poster || movie.Poster || null;

    setFavorites((prev) => {
      if (prev.some((item) => item.id === id)) return prev;

      return [
        ...prev,
        {
          id,
          title,
          releaseYear: year,
          poster,
        },
      ];
    });
  };

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <div className="App">
      <Header />
      <Search onSelectMovie={setSelectedMovieId} onSearch={setSearchQuery} />
      <div className="main-content">
        <FilmSide
          movieId={selectedMovieId}
          searchQuery={searchQuery}
          onSelectMovie={setSelectedMovieId}
          addFavorite={handleAddFavorite}
        />
        <Favorite favorites={favorites} onRemoveFavorite={handleRemoveFavorite} />
      </div>
    </div>
  );
}

export default App;
