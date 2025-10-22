// ============================================
// COMPONENT - MemoryListModal
// Modal para listar e editar memórias
// ============================================

import React, { useState, useMemo } from "react";
import { X, List, FileText, Calendar, Image, Upload, Music, Save, Edit3, Trash2, Filter } from "lucide-react";
import { useMemories } from '../controllers/MemoryController.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';
import { extractSpotifyId, processFileWithTimeout, validateFileSize, validatePhotoLimit } from '../utils/helpers.js';
import { FormField } from './FormField.jsx';
import { ConfirmationModal } from './ConfirmationModal.jsx';

export function MemoryListModal({ isOpen, onClose }) {
  const { memories, updateMemory, deleteMemory } = useMemories();
  const { showToast } = useToast();
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();
  const [editingMemory, setEditingMemory] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date: "",
    photos: [],
    spotifyUrl: "",
  });
  const [showSpotifyInput, setShowSpotifyInput] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const filteredMemories = useMemo(() => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      return memories;
    }

    return memories.filter((memory) => {
      const memoryDate = new Date(memory.date);
      const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      if (startDate && endDate) {
        return memoryDate >= startDate && memoryDate <= endDate;
      } else if (startDate) {
        return memoryDate >= startDate;
      } else if (endDate) {
        return memoryDate <= endDate;
      }

      return true;
    });
  }, [memories, dateFilter]);

  const startEditing = (memory) => {
    setEditingMemory(memory.id);
    setEditForm({
      title: memory.title,
      description: memory.description || "",
      date: memory.date,
      photos: memory.photos || [],
      spotifyUrl: memory.spotifyUrl || "",
    });
    setShowSpotifyInput(!!memory.spotifyUrl);
  };

  const cancelEditing = () => {
    setEditingMemory(null);
    setEditForm({
      title: "",
      description: "",
      date: "",
      photos: [],
      spotifyUrl: "",
    });
    setShowSpotifyInput(false);
  };

  const saveEdit = () => {
    if (!editForm.title.trim()) {
      showToast("Por favor, adicione um título!", "error");
      return;
    }

    if (editForm.spotifyUrl && !extractSpotifyId(editForm.spotifyUrl)) {
      showToast(
        "Link do Spotify inválido! Use um link como: https://open.spotify.com/track/...", "error"
      );
      return;
    }

    updateMemory(editingMemory, {
      title: editForm.title,
      description: editForm.description,
      date: editForm.date,
      photos: editForm.photos.length > 0 ? editForm.photos : null,
      spotifyUrl: editForm.spotifyUrl.trim() || null,
    });

    cancelEditing();
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!validatePhotoLimit(editForm.photos.length, files.length)) {
      showToast("Você pode adicionar no máximo 6 fotos por memória!", "error");
      return;
    }

    const oversizedFiles = files.filter(file => !validateFileSize(file));
    if (oversizedFiles.length > 0) {
      showToast(`${oversizedFiles.length} foto(s) excedem o limite de 3MB! (Limite reduzido para melhor performance)`, "error");
      return;
    }

    for (const file of files) {
      try {
        const result = await processFileWithTimeout(file);
        setEditForm((prev) => ({
          ...prev,
          photos: [...prev.photos, result],
        }));
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        showToast("Erro ao processar uma das fotos. Tente com uma imagem menor.", "error");
        break;
      }
    }
  };

  const removePhoto = (index) => {
    setEditForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = (memory) => {
    setMemoryToDelete(memory);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (memoryToDelete) {
      deleteMemory(memoryToDelete.id);
      setMemoryToDelete(null);
    }
    setShowConfirmModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            maxWidth: "60rem",
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  Minhas Memórias ({filteredMemories.length})
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    color: "#9ca3af",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: "1.5rem", height: "1.5rem" }} />
                </button>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem",
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb"
              }}>
                <Filter style={{ width: "1rem", height: "1rem", color: "#6b7280" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500" }}>
                    De:
                  </label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{
                      padding: "0.375rem 0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500" }}>
                    Até:
                  </label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{
                      padding: "0.375rem 0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <button
                    onClick={() => setDateFilter({ startDate: "", endDate: "" })}
                    style={{
                      padding: "0.375rem 0.75rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
            }}
          >
            {filteredMemories.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#6b7280",
                }}
              >
                <List style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "1.125rem", fontWeight: 500 }}>
                  {memories.length === 0 ? "Nenhuma memória encontrada" : "Nenhuma memória encontrada para o período selecionado"}
                </p>
                <p style={{ fontSize: "0.875rem" }}>
                  {memories.length === 0 ? "Adicione sua primeira memória clicando no mapa!" : "Tente ajustar o filtro de data."}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "1rem",
                }}
              >
                {filteredMemories.map((memory) => (
                  <div
                    key={memory.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      background: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    {editingMemory === memory.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <FormField
                          label="Título *"
                          icon={<FileText style={{ width: "1rem", height: "1rem" }} />}
                        >
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem 1rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                            }}
                          />
                        </FormField>

                        <FormField label="Descrição">
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            rows={2}
                            style={{
                              width: "100%",
                              padding: "0.5rem 1rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem",
                              resize: "none",
                              fontSize: "0.875rem",
                            }}
                          />
                        </FormField>

                        <FormField
                          label="Data"
                          icon={<Calendar style={{ width: "1rem", height: "1rem" }} />}
                        >
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, date: e.target.value }))
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem 1rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                            }}
                          />
                        </FormField>

                        <FormField
                          label={`Fotos (${editForm.photos.length}/6)`}
                          icon={<Image style={{ width: "1rem", height: "1rem" }} />}
                        >
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                              style={{ display: "none" }}
                              id={`photo-upload-${memory.id}`}
                            />
                            <label
                              htmlFor={`photo-upload-${memory.id}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "0.5rem",
                                border: "2px dashed #d1d5db",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                color: "#6b7280",
                                fontSize: "0.75rem",
                              }}
                            >
                              <Upload style={{ width: "1rem", height: "1rem" }} />
                              Adicionar fotos
                            </label>

                            {editForm.photos.length > 0 && (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "0.5rem",
                                  marginTop: "0.5rem",
                                }}
                              >
                                {editForm.photos.map((photo, idx) => (
                                  <div key={idx} style={{ position: "relative" }}>
                                    <img
                                      src={photo}
                                      alt={`Foto ${idx + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "0.375rem",
                                        border: "2px solid #e5e7eb",
                                      }}
                                    />
                                    <button
                                      onClick={() => removePhoto(idx)}
                                      style={{
                                        position: "absolute",
                                        top: "-0.25rem",
                                        right: "-0.25rem",
                                        background: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "1.25rem",
                                        height: "1.25rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormField>

                        <FormField
                          label="Música do Spotify"
                          icon={<Music style={{ width: "1rem", height: "1rem" }} />}
                        >
                          <div>
                            {!showSpotifyInput ? (
                              <button
                                onClick={() => setShowSpotifyInput(true)}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem 1rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.5rem",
                                  background: "white",
                                  color: "#6b7280",
                                  cursor: "pointer",
                                  fontSize: "0.75rem",
                                  textAlign: "left",
                                }}
                              >
                                + Adicionar música do Spotify
                              </button>
                            ) : (
                              <input
                                type="text"
                                value={editForm.spotifyUrl}
                                onChange={(e) =>
                                  setEditForm((prev) => ({ ...prev, spotifyUrl: e.target.value }))
                                }
                                placeholder="Cole o link da música do Spotify"
                                style={{
                                  width: "100%",
                                  padding: "0.5rem 1rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.5rem",
                                  fontSize: "0.875rem",
                                }}
                              />
                            )}
                          </div>
                        </FormField>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={saveEdit}
                            style={{
                              flex: 1,
                              background: gradientData.gradient,
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.25rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          >
                            <Save style={{ width: "1rem", height: "1rem" }} />
                            Salvar
                          </button>
                          <button
                            onClick={cancelEditing}
                            style={{
                              padding: "8px 16px",
                              border: "1px solid #d1d5db",
                              color: "#374151",
                              background: "white",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <h3
                            style={{
                              fontWeight: "bold",
                              fontSize: "1rem",
                              color: memory.color,
                              margin: 0,
                              wordBreak: "break-word",
                            }}
                          >
                            {memory.title}
                          </h3>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => startEditing(memory)}
                              style={{
                                color: "#6b7280",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "0.25rem",
                              }}
                            >
                              <Edit3 style={{ width: "1rem", height: "1rem" }} />
                            </button>
                            <button
                              onClick={() => handleDelete(memory)}
                              style={{
                                color: "#ef4444",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "0.25rem",
                              }}
                            >
                              <Trash2 style={{ width: "1rem", height: "1rem" }} />
                            </button>
                          </div>
                        </div>

                        {memory.photos && memory.photos.length > 0 && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "0.5rem",
                              marginBottom: "0.75rem",
                            }}
                          >
                            {memory.photos.slice(0, 3).map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Foto ${idx + 1}`}
                                style={{
                                  width: "100%",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "0.375rem",
                                  border: "2px solid #e5e7eb",
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {memory.spotifyUrl && extractSpotifyId(memory.spotifyUrl) && (
                          <div style={{ marginBottom: "0.75rem" }}>
                            <iframe
                              src={`https://open.spotify.com/embed/track/${extractSpotifyId(memory.spotifyUrl)}?utm_source=generator&theme=0`}
                              width="100%"
                              height="152"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                              style={{ borderRadius: "0.5rem" }}
                            ></iframe>
                          </div>
                        )}

                        {memory.description && (
                          <p
                            style={{
                              color: "#374151",
                              marginBottom: "0.5rem",
                              fontSize: "0.875rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {memory.description}
                          </p>
                        )}

                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.75rem",
                            margin: 0,
                          }}
                        >
                          📅 {new Date(memory.date).toLocaleDateString("pt-BR")} • 📍 {memory.lat.toFixed(4)}, {memory.lng.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Excluir Memória"
        message={`Tem certeza que deseja excluir a memória "${memoryToDelete?.title}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}