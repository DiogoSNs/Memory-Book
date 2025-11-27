import React, { useState } from "react";

export function MemoryMediaGallery({ memory }) {
  const [activeTab, setActiveTab] = useState('all');

  const isPhoto = (src) => typeof src === 'string' && (
    src.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(src)
  );
  const isVideo = (src) => typeof src === 'string' && (
    src.startsWith('data:video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(src)
  );

  const photos = Array.isArray(memory.photos) ? memory.photos.filter(isPhoto) : [];
  const videos = Array.isArray(memory.videos) ? memory.videos.filter(isVideo) : [];
  const allMedia = [...photos, ...videos];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.375rem 0.75rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            background: activeTab === 'all' ? '#2563eb' : '#f3f4f6',
            color: activeTab === 'all' ? 'white' : '#374151',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Todos ({allMedia.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          style={{
            padding: '0.375rem 0.75rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            background: activeTab === 'photos' ? '#2563eb' : '#f3f4f6',
            color: activeTab === 'photos' ? 'white' : '#374151',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Fotos ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          style={{
            padding: '0.375rem 0.75rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            background: activeTab === 'videos' ? '#2563eb' : '#f3f4f6',
            color: activeTab === 'videos' ? 'white' : '#374151',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Vídeos ({videos.length})
        </button>
      </div>

      <div>
        {activeTab === 'all' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {allMedia.map((m, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {isPhoto(m) ? (
                  <img src={m} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.375rem', border: '2px solid #e5e7eb' }} />
                ) : (
                  <video src={m} controls style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {photos.map((photo, idx) => (
              <img key={idx} src={photo} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.375rem', border: '2px solid #e5e7eb' }} />
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {videos.map((v, idx) => (
              <video key={idx} src={v} controls style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

