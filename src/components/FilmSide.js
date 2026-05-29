import "../components_css/FilmSide.css";
import { useEffect, useState } from 'react';

const defaultIds = [
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0071562', // The Godfather: Part II
    'tt0468569', // The Dark Knight
    'tt0050083', // 12 Angry Men
    'tt0108052', // Schindler's List
    'tt0137523', // Fight Club
    'tt0110912', // Pulp Fiction
    'tt0120737', // The Lord of the Rings: The Fellowship
    'tt0167260', // The Lord of the Rings: The Two Towers
    'tt0080684', // Star Wars: Episode V - The Empire Strikes Back
    'tt0133093', // The Matrix
    'tt0109830', // Forrest Gump
    'tt1375666', // Inception
    'tt0169547', // American Beauty
];

export default function FilmSide({ movieId, searchQuery, onSelectMovie, addFavorite }) {
    const [movies, setMovies] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [listError, setListError] = useState('');

    const [movie, setMovie] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState('');

    const apiKey = '24f9a32a';

    useEffect(() => {
        const fetchSearch = (query) => {
            setLoadingList(true);
            const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === 'True') {
                        setMovies(data.Search || []);
                        setListError('');
                    } else {
                        setMovies([]);
                        setListError(data.Error || 'No results');
                    }
                    setLoadingList(false);
                })
                .catch(error => {
                    console.error('Error loading movies:', error);
                    setListError('Movie list could not be loaded.');
                    setLoadingList(false);
                });
        };
        setLoadingList(true);
        const fetchDefaults = () => {
            setLoadingList(true);
            const ids = [];
            const idsCopy = [...defaultIds];
            while (ids.length < 10 && idsCopy.length > 0) {
                const idx = Math.floor(Math.random() * idsCopy.length);
                ids.push(idsCopy.splice(idx, 1)[0]);
            }

            const promises = ids.map(id => fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}`).then(r => r.json()));

            Promise.all(promises)
                .then(results => {
                    const good = results.filter(r => r && r.Response === 'True');
                    const mapped = good.map(r => ({ imdbID: r.imdbID, Title: r.Title, Year: r.Year, Poster: r.Poster }));
                    setMovies(mapped);
                    setListError('');
                })
                .catch(err => {
                    console.error('Error loading default movies:', err);
                    setListError('Movie list could not be loaded.');
                })
                .finally(() => {
                    setLoadingList(false);
                });
        };

        if (!searchQuery || !searchQuery.trim()) {
            fetchDefaults();
        } else {
            fetchSearch(searchQuery);
        }
    }, [searchQuery, apiKey]);

    useEffect(() => {
        if (!movieId) {
            setMovie(null);
            setDetailError('');
            setLoadingDetail(false);
            return;
        }

        setLoadingDetail(true);
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(movieId)}&plot=full`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    setMovie({
                        id: data.imdbID,
                        title: data.Title,
                        release_date: data.Released || data.Year,
                        vote_average: data.imdbRating,
                        overview: data.Plot,
                        poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
                    });
                    setDetailError('');
                } else {
                    setMovie(null);
                    setDetailError(data.Error || 'Movie not found.');
                }
                setLoadingDetail(false);
            })
            .catch(error => {
                console.error('Error loading movie detail:', error);
                setDetailError('Movie information could not be loaded.');
                setLoadingDetail(false);
            });
    }, [movieId, apiKey]);

    if (loadingDetail) {
        return (
            <main>
                <p className="loading-text">Loading movie details...</p>
            </main>
        );
    }

    if (detailError) {
        return (
            <main>
                <p className="error-text">{detailError}</p>
            </main>
        );
    }

    if (movie) {
        return (
            <main>
                <p onClick={() => onSelectMovie && onSelectMovie(null)} className="back-link">
                    ◄ Back to List
                </p>
                <div className="movie-detail-card">
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="detail-poster"
                        />
                    ) : null}
                    <div className="detail-content">
                        <h1>{movie.title}</h1>
                        <p><strong>Release date:</strong> {movie.release_date}</p>
                        <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
                        <p className="detail-overview">{movie.overview}</p>
                        <button
                            className="movie-card-button"
                            onClick={() => addFavorite && addFavorite(movie)}
                        >
                            Add to Favorites
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (loadingList) {
        return (
            <main>
                <h1 className="main-title">Trending Movies</h1>
                <p className="loading-text">Loading trending films...</p>
            </main>
        );
    }

    if (listError) {
        return (
            <main>
                <h1 className="main-title">Trending Movies</h1>
                <p className="error-text">{listError}</p>
            </main>
        );
    }

    const normalized = (movies || []).map(m => ({
        id: m.imdbID,
        title: m.Title,
        year: m.Year,
        poster: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
    }));

    const filtered = normalized;

    return (
        <main>
            <h1 className="main-title">Trending Movies</h1>
            <div className="movies-container">
                {filtered.length === 0 ? (
                    <p className="loading-text">No films match your search.</p>
                ) : (
                    filtered.map(movieItem => {
                        return (
                            <div
                                key={movieItem.id}
                                className="movie-card"
                                onClick={() => onSelectMovie && onSelectMovie(movieItem.id)}
                            >
                                {movieItem.poster ? (
                                    <img
                                        src={movieItem.poster}
                                        alt={movieItem.title}
                                        className="movie-poster"
                                    />
                                ) : (
                                    <div className="movie-poster placeholder">No image</div>
                                )}
                                <div className="movie-card-title">{movieItem.title} ({movieItem.year})</div>
                                <button
                                    className="movie-card-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addFavorite && addFavorite({
                                            id: movieItem.id,
                                            title: movieItem.title,
                                            Year: movieItem.year,
                                            Poster: movieItem.poster,
                                        });
                                    }}
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}
