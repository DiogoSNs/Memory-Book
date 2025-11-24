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
export const processFileWithTimeout = (file) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout: arquivo muito grande ou processamento lento"));
    }, 10000);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      clearTimeout(timeout);
      const result = e.target.result;
      if (result.length > 10 * 1024 * 1024) {
        reject(new Error("Arquivo resultante muito grande após conversão"));
        return;
      }
      resolve(result);
    };
    
    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("Erro na leitura do arquivo"));
    };
    
    reader.onabort = () => {
      clearTimeout(timeout);
      reject(new Error("Leitura do arquivo foi abortada"));
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
export const validateFileSize = (files, maxSizeInMB = 3) => {
  const maxSize = maxSizeInMB * 1024 * 1024;
  const oversizedFiles = files.filter(file => file.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    return {
      valid: false,
      error: `${oversizedFiles.length} foto(s) excedem o limite de ${maxSizeInMB}MB e não foram adicionadas!`,
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
