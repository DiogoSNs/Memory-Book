// ============================================
// UTILITÁRIOS
// Funções auxiliares reutilizáveis
// ============================================

// (Removido) Função de extração de ID de Spotify baseada em URL

// Gera cores aleatórias para as memórias
export const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1", 
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Processa arquivo com timeout para evitar travamentos
export const processFileWithTimeout = (file, timeoutMs = 15000, maxResultBytes = 15 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Tempo excedido ao processar mídia"));
    }, timeoutMs);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      clearTimeout(timeout);
      const result = e.target.result;
      if (result.length > maxResultBytes) {
        reject(new Error("Mídia muito grande após conversão"));
        return;
      }
      resolve(result);
    };
    
    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("Erro na leitura da mídia"));
    };
    
    reader.onabort = () => {
      clearTimeout(timeout);
      reject(new Error("Leitura da mídia foi abortada"));
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
};

// Valida tamanho máximo de arquivos
export const validateFileSize = (files, maxSizeInMB = 4) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  const oversizedFiles = files.filter(file => file.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    return {
      valid: false,
      error: `${oversizedFiles.length} imagem(ns) excedem ${maxSizeInMB}MB. Tente uma qualidade menor.`,
      validFiles: files.filter(file => file.size <= maxSize)
    };
  }
  
  return { valid: true, validFiles: files };
};

// Valida limite de fotos por memória
export const validatePhotoLimit = (currentPhotos, newFiles, maxPhotos = 6) => {
  if (currentPhotos.length + newFiles.length > maxPhotos) {
    return {
      valid: false,
      error: `Você pode adicionar no máximo ${maxPhotos} fotos por memória!`
    };
  }
  
  return { valid: true };
};

// Valida tamanho máximo de vídeos
export const validateVideoSize = (files, maxSizeInMB = 12) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  const oversized = files.filter(file => file.size > maxSize);
  if (oversized.length > 0) {
    return {
      valid: false,
      error: `${oversized.length} vídeo(s) excedem ${maxSizeInMB}MB. Envie um arquivo menor ou recorte.`,
      validFiles: files.filter(file => file.size <= maxSize)
    };
  }
  return { valid: true, validFiles: files };
};

// Obtém duração de um vídeo em segundos
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(Number(video.duration) || 0);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível obter a duração do vídeo'));
      };
    } catch (e) {
      reject(e);
    }
  });
};

// Grava um segmento de um vídeo via captureStream + MediaRecorder
export const recordVideoSegment = (videoEl, startTime = 0, durationSec = 30) => {
  return new Promise((resolve, reject) => {
    try {
      if (!videoEl || !videoEl.captureStream) {
        reject(new Error('Corte de vídeo não suportado neste navegador'));
        return;
      }

      const ensureMetadata = () => new Promise((res, rej) => {
        if (isFinite(videoEl.duration) && videoEl.duration > 0) {
          res();
        } else {
          const onMeta = () => { videoEl.removeEventListener('loadedmetadata', onMeta); res(); };
          const onErr = () => { videoEl.removeEventListener('error', onErr); rej(new Error('Falha ao carregar vídeo')); };
          videoEl.addEventListener('loadedmetadata', onMeta);
          videoEl.addEventListener('error', onErr);
        }
      });

      const seekToStart = () => new Promise((res, rej) => {
        const safeStart = Math.max(0, Math.min(startTime, (videoEl.duration || startTime)));
        const onSeeked = () => { videoEl.removeEventListener('seeked', onSeeked); res(); };
        const onErr = () => { videoEl.removeEventListener('error', onErr); rej(new Error('Falha ao posicionar vídeo')); };
        videoEl.addEventListener('seeked', onSeeked);
        videoEl.addEventListener('error', onErr);
        try { videoEl.pause(); } catch { /* ignore pause error */ }
        videoEl.currentTime = safeStart;
      });

      const startRecording = () => {
        const stream = videoEl.captureStream();
        let recorder;
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        } catch {
          try {
            recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          } catch {
            reject(new Error('Falha ao inicializar gravação de vídeo'));
            return;
          }
        }
        const chunks = [];
        recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          try {
            const blob = new Blob(chunks, { type: 'video/webm' });
            resolve(blob);
          } catch {
            reject(new Error('Falha ao finalizar vídeo'));
          }
        };
        const startStop = () => {
          recorder.start();
          setTimeout(() => { recorder.stop(); try { videoEl.pause(); } catch { /* ignore pause error */ } }, durationSec * 1000);
        };
        videoEl.muted = true;
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(startStop).catch(startStop);
        } else {
          startStop();
        }
      };

      ensureMetadata()
        .then(seekToStart)
        .then(startRecording)
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
