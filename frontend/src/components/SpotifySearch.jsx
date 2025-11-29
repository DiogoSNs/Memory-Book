// ============================================
// COMPONENT - SpotifySearch
// Busca e seleção de músicas do Spotify (por nome)
// ============================================

import React, { useState, useEffect } from 'react';
import { PlayCircle, Link as LinkIcon } from 'lucide-react';
import { api } from '../utils/api.js';

export function SpotifySearch({ onSelect, initialSelection }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(initialSelection || null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError('');
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.searchSpotifyTracks(query.trim());
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch {
        setError('Não foi possível buscar músicas agora.');
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [query]);

  const handleSelect = (track) => {
    const selection = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album_image: track.album_image || null,
      external_url: track.external_url || null,
    };
    setSelected(selection);
    setResults([]);
    setQuery('');
    onSelect?.(selection);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); if (selected) setSelected(null); }}
        placeholder="Digite o nome da música"
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      />

      {loading && (
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Buscando…</div>
      )}
      {error && (
        <div style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</div>
      )}

      {results.length > 0 && !selected && (
        <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '30vh', overflowY: 'auto' }}>
          {results.map((track) => (
            <div key={track.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
              {track.album_image && (
                <img src={track.album_image} alt={track.name} style={{ width: '40px', height: '40px', borderRadius: '0.375rem', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>{track.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artists}</div>
              </div>
              <button onClick={() => handleSelect(track)} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.375rem', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                Selecionar
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !selected && query.trim().length >= 2 && results.length === 0 && (
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sem resultados</div>
      )}

      {selected && (
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlayCircle style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
            <span style={{ fontWeight: 600, color: '#111827' }}>{selected.name}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>• {selected.artists}</span>
          </div>
          {selected.external_url && (
            <a href={selected.external_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              <LinkIcon style={{ width: '1rem', height: '1rem' }} /> Abrir no Spotify
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default SpotifySearch;
