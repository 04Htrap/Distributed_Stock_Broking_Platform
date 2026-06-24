import { useState, useEffect, useRef } from 'react';
import { searchStocks } from '../../services/marketService';
import { addToWatchlist } from '../../services/watchlistService';
import { normalizeError } from '../../utils/errors';
import toast from 'react-hot-toast';

export default function StockSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return undefined;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchStocks(query);
        setResults(data);
        setError('');
        setOpen(true);
      } catch (err) {
        setResults([]);
        setError(normalizeError(err));
        setOpen(true);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleQueryChange = (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      setError('');
    }
  };

  const handleSelect = async (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    if (!normalized) return;

    try {
      await addToWatchlist(normalized);
      toast.success(`${normalized} added to watchlist`);
      setQuery('');
      setOpen(false);
      setError('');
      onSelect?.(normalized);
    } catch (err) {
      toast.error(normalizeError(err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstResult = results[0]?.symbol;
    handleSelect(firstResult || query);
  };

  return (
    <form className="search-box" ref={containerRef} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => query.trim() && setOpen(true)}
      />
      {open && (
        <div className="search-results">
          {searching ? (
            <div className="search-result-item" style={{ color: 'var(--text-secondary)' }}>
              Searching...
            </div>
          ) : error ? (
            <button
              type="submit"
              className="search-result-item search-result-item--button"
            >
              <span>Add {query.trim().toUpperCase()}</span>
              <span className="search-result-item__name">Search failed: press Enter</span>
            </button>
          ) : results.length === 0 ? (
            <button
              type="submit"
              className="search-result-item search-result-item--button"
            >
              <span>Add {query.trim().toUpperCase()}</span>
              <span className="search-result-item__name">Press Enter</span>
            </button>
          ) : (
            results.map((item) => (
              <button
                key={item.symbol}
                type="button"
                className="search-result-item search-result-item--button"
                onClick={() => handleSelect(item.symbol)}
              >
                <span>{item.symbol}</span>
                <span className="search-result-item__name">{item.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </form>
  );
}
