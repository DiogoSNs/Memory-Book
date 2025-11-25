// ============================================
// COMPONENT - MemoryForm.jsx
// Formulário para criação de memórias geográficas
// ============================================

/**
 * Componente de formulário para criação de memórias geográficas.
 * 
 * Responsabilidades:
 * - Renderizar formulário completo para criação de memórias
 * - Gerenciar upload e processamento de fotos
 * - Validar dados de entrada (título, descrição, fotos)
 * - Integrar com Spotify para URLs de música
 * - Permitir personalização de cor do marcador
 * - Processar localização geográfica selecionada
 * - Aplicar tema/gradiente personalizado
 * - Exibir feedback de validação e erros
 * 
 * Dependências:
 * - React: Biblioteca principal (useState)
 * - lucide-react: Ícones para interface
 * - ../controllers/MemoryController: Controller de memórias
 * - ../contexts/ToastContext: Contexto de notificações
 * - ../contexts/GradientContext: Contexto de temas
 * - ../utils/helpers: Utilitários para validação e processamento
 * - ./FormField: Componente de campo de formulário
 * 
 * Padrões de Projeto:
 * - Component Pattern: Componente reutilizável e encapsulado
 * - Observer Pattern: Observa mudanças nos contextos
 * - Strategy Pattern: Diferentes estratégias de validação
 * - Facade Pattern: Interface simplificada para criação de memórias
 */

import React, { useState, useRef } from "react";
import { X, FileText, Calendar, Image, Upload, Music, Palette } from "lucide-react";
import { useMemories } from '../controllers/MemoryController.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';
import { processFileWithTimeout, validateFileSize, validatePhotoLimit, validateVideoSize, getVideoDuration, recordVideoSegment } from '../utils/helpers.js';
import { FormField } from './FormField.jsx';
import SpotifySearch from './SpotifySearch.jsx';

export function MemoryForm({ selectedLocation, onClose }) {
  const { addMemory } = useMemories();
  const { showToast } = useToast();
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  // NOVO: música selecionada via busca por nome (substitui o antigo link)
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [pendingVideo, setPendingVideo] = useState(null);
  const pendingVideoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [markerColor, setMarkerColor] = useState("#FF6B6B");

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setPhotoError("");

    // Validar limite de fotos
    const limitValidation = validatePhotoLimit(photos.length, files.length);
    if (!limitValidation.valid) {
      setPhotoError(limitValidation.error);
      return;
    }

    // Validar tamanho dos arquivos
    const validation = validateFileSize(files);
    if (!validation.valid) {
      setPhotoError(validation.error);
      return;
    }

    for (const file of files) {
      try {
        console.log("📸 Processando arquivo:", file.name, "Tamanho:", (file.size / 1024 / 1024).toFixed(2), "MB");
        const result = await processFileWithTimeout(file);
        console.log("✅ Arquivo processado com sucesso. Tamanho final:", (result.length / 1024 / 1024).toFixed(2), "MB");
        setPhotos((prev) => [...prev, result]);
      } catch (error) {
        console.error("❌ Erro ao processar arquivo:", error);
        setPhotoError("Erro ao processar uma das fotos. Tente com uma imagem menor.");
        break;
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setVideoError("");
    if (!files.length) return;
    const { valid, error, validFiles } = validateVideoSize(files);
    if (!valid) {
      setVideoError(error);
    }
    const file = (validFiles && validFiles[0]) || null;
    if (!file) return;
    try {
      const duration = await getVideoDuration(file);
      setVideoDuration(duration);
      if (duration <= 30) {
        const dataUrl = await processFileWithTimeout(file, 20000, 25 * 1024 * 1024);
        setVideos((prev) => [...prev, dataUrl]);
      } else {
        setPendingVideo(file);
        setTrimStart(0);
        setTrimEnd(Math.min(30, Math.floor(duration)));
      }
    } catch {
      setVideoError('Não foi possível processar o vídeo.');
    }
  };

  const confirmVideoCut = async () => {
    if (!pendingVideo) return;
    setVideoError("");
    try {
      const videoEl = pendingVideoRef.current;
      if (!videoEl) throw new Error('Video preview não disponível');
      // Garante metadata carregada antes de gravar
      await new Promise((res, rej) => {
        if (isFinite(videoEl.duration) && videoEl.duration > 0) {
          res();
        } else {
          const onMeta = () => {
            videoEl.removeEventListener('loadedmetadata', onMeta);
            res();
          };
          const onErr = () => {
            videoEl.removeEventListener('error', onErr);
            rej(new Error('Falha ao carregar vídeo'));
          };
          videoEl.addEventListener('loadedmetadata', onMeta);
          videoEl.addEventListener('error', onErr);
        }
      });
      const start = Math.min(trimStart, Math.max(0, videoDuration - 30));
      const durationSel = Math.max(1, Math.min(30, Math.floor(trimEnd - start)));
      const blob = await recordVideoSegment(videoEl, start, durationSel);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setVideos((prev) => [...prev, dataUrl]);
        setPendingVideo(null);
        setVideoDuration(0);
        setTrimStart(0);
        setTrimEnd(0);
      };
      reader.readAsDataURL(blob);
    } catch {
      setVideoError('Seu navegador não suporta corte de vídeo. Envie um arquivo até 30s.');
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast("Por favor, adicione um título!", "error");
      return;
    }

    addMemory({
      title,
      description,
      date,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      photos: photos.length > 0 ? photos : null,
      videos: videos.length > 0 ? videos : null,
      // NOVO: salva objeto completo de música, se selecionado
      music: selectedMusic || null,
      color: markerColor,
    });

    showToast("Memória adicionada com sucesso!", "success");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
          maxWidth: "32rem",
          width: "100%",
          padding: "1.5rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Nova Memória
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField
            label="Título *"
            icon={<FileText style={{ width: "1rem", height: "1rem" }} />}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para Paris"
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }}
            />
          </FormField>

          <FormField label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte um pouco sobre essa memória..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                resize: "none",
                fontSize: "1rem",
              }}
            />
          </FormField>

          <FormField
            label="Data"
            icon={<Calendar style={{ width: "1rem", height: "1rem" }} />}
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }}
            />
          </FormField>

          <FormField
            label="Cor do Marcador"
            icon={<Palette style={{ width: "1rem", height: "1rem" }} />}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="color"
                value={markerColor}
                onChange={(e) => setMarkerColor(e.target.value)}
                style={{
                  width: "3rem",
                  height: "2.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setMarkerColor(color)}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      backgroundColor: color,
                      border: markerColor === color ? "2px solid #374151" : "1px solid #d1d5db",
                      borderRadius: "50%",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    title={`Selecionar cor ${color}`}
                  />
                ))}
              </div>
            </div>
          </FormField>

          <FormField
            label={`Fotos (${photos.length}/6)`}
            icon={<Image style={{ width: "1rem", height: "1rem" }} />}
          >
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  border: "2px dashed #d1d5db",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#9333ea";
                  e.currentTarget.style.color = "#9333ea";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <Upload style={{ width: "1.25rem", height: "1.25rem" }} />
                Clique para adicionar fotos
              </label>

              {photos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {photos.map((photo, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "80px",
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
                          width: "1.5rem",
                          height: "1.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "bold",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photoError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "0.375rem",
                  }}
                >
                  {photoError}
                </div>
              )}
            </div>
          </FormField>

          <FormField
            label={`Vídeo (${videos.length}/1)`}
            icon={<Upload style={{ width: "1rem", height: "1rem" }} />}
          >
            <div>
              <input
                type="file"
                accept="video/*"
                multiple={false}
                onChange={handleVideoUpload}
                style={{ display: "none" }}
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  border: "2px dashed #d1d5db",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                <Upload style={{ width: "1.25rem", height: "1.25rem" }} />
                Clique para adicionar vídeo
              </label>

              {pendingVideo && (
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem" }}>
                  <video
                    ref={pendingVideoRef}
                    src={URL.createObjectURL(pendingVideo)}
                    controls
                    style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Início</span>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, Math.floor(videoDuration - 30))}
                      value={trimStart}
                      onChange={(e) => {
                        const start = Number(e.target.value);
                        setTrimStart(start);
                        setTrimEnd((prev) => {
                          let end = prev;
                          if (end < start) end = start;
                          if (end > start + 30) end = start + 30;
                          return Math.min(Math.floor(videoDuration), end);
                        });
                      }}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{trimStart}s</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Fim</span>
                    <input
                      type="range"
                      min={trimStart}
                      max={Math.min(Math.floor(videoDuration), trimStart + 30)}
                      value={trimEnd}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const clamped = Math.max(trimStart, Math.min(val, trimStart + 30));
                        setTrimEnd(clamped);
                      }}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{trimEnd}s</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Selecionado: {Math.max(0, Math.min(30, Math.floor(trimEnd - trimStart)))}s
                  </div>
                  <button
                    type="button"
                    onClick={confirmVideoCut}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      background: gradientData.gradient,
                      color: "white",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Confirmar corte
                  </button>
                </div>
              )}

              {videos.length > 0 && (
                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {videos.map((v, idx) => (
                    <video key={idx} src={v} controls style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  ))}
                </div>
              )}

              {videoError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "0.375rem",
                  }}
                >
                  {videoError}
                </div>
              )}
            </div>
          </FormField>

          <FormField
            label="Música"
            icon={<Music style={{ width: "1rem", height: "1rem" }} />}
          >
            <div>
              {/* NOVO: busca e seleção de música por nome */}
              <SpotifySearch onSelect={setSelectedMusic} initialSelection={selectedMusic} />
            </div>
          </FormField>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              paddingTop: "0.5rem",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{
                flex: 1,
                background: title.trim()
                  ? gradientData.gradient
                  : "#d1d5db",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: title.trim() ? "pointer" : "not-allowed",
                fontWeight: "600",
                fontSize: "1rem",
                boxShadow: title.trim() ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              Salvar Memória
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "1px solid #d1d5db",
                color: "#374151",
                background: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
