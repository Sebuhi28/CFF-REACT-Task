import { useState } from 'react';
import "../components_css/Search.css";

export default function Search({ onSelectMovie, onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (onSearch) onSearch(q);
    };

    return (
        <div className="search">
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search movies..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
