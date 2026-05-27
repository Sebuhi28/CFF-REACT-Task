import "../components_css/Favorite.css";

export default function Favorite({ favorites, onRemoveFavorite }) {
    const favoriteMovies = favorites || [];

    return (
        <main className="favorite">
            <h1>Favorite Movies</h1>

            <div className="favorites-list">
                {favoriteMovies.length === 0 ? (
                    <p className="placeholder">No favorite movies yet. Click "Add to Favorites" on a movie to add it here.</p>
                ) : (
                    favoriteMovies.map((movie) => (
                        <div className="favorite-card" key={movie.id}>
                            {movie.poster ? (
                                <img src={movie.poster} alt={movie.title} className="favorite-poster" />
                            ) : (
                                <div className="favorite-poster placeholder">No image</div>
                            )}
                            <div className="favorite-info">
                                <p>{movie.title}</p>
                            </div>
                            <button
                                className="remove-favorite-button"
                                onClick={() => onRemoveFavorite && onRemoveFavorite(movie.id)}
                            >
                                Remove
                            </button>
                            <button className="imdb-button" onClick={() => window.open(`https://www.imdb.com/title/${movie.id}/`, '_blank')}>
                                IMDB
                            </button>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}