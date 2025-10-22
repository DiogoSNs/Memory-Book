// ============================================
// CONTROLLER - MemoryController
// Gerencia o estado e operações das memórias usando Context API
// ============================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { MemoryRepository } from '../models/MemoryRepository.js';

// Context para compartilhar estado das memórias
const MemoryContext = createContext(null);

// Provider que atua como Controller
export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const repository = new MemoryRepository();

  // Carrega memórias ao inicializar
  useEffect(() => {
    const loadedMemories = repository.loadAll();
    setMemories(loadedMemories);
    setIsLoaded(true);
    console.log("✅ Memórias carregadas:", loadedMemories.length);
  }, []);

  // Salva memórias sempre que o estado muda
  useEffect(() => {
    if (isLoaded && memories.length >= 0) {
      repository.saveAll(memories);
    }
  }, [memories, isLoaded]);

  // Adiciona nova memória
  const addMemory = (memoryData) => {
    try {
      const newMemory = repository.add(memoryData);
      setMemories(prev => [...prev, newMemory]);
      return newMemory;
    } catch (error) {
      console.error("Erro ao adicionar memória:", error);
      throw error;
    }
  };

  // Atualiza memória existente
  const updateMemory = (id, updatedData) => {
    try {
      const updatedMemory = repository.update(id, updatedData);
      setMemories(prev => 
        prev.map(memory => 
          memory.id === id ? updatedMemory : memory
        )
      );
      return updatedMemory;
    } catch (error) {
      console.error("Erro ao atualizar memória:", error);
      throw error;
    }
  };

  // Remove memória
  const deleteMemory = (id) => {
    try {
      repository.delete(id);
      setMemories(prev => prev.filter(memory => memory.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao deletar memória:", error);
      throw error;
    }
  };

  // Busca memória por ID
  const findMemoryById = (id) => {
    return memories.find(memory => memory.id === id) || null;
  };

  // Conta total de memórias
  const getMemoryCount = () => {
    return memories.length;
  };

  const value = {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    findMemoryById,
    getMemoryCount,
    isLoaded
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
}

// Hook para usar o contexto das memórias
export function useMemories() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemories deve ser usado dentro de MemoryProvider");
  }
  return context;
}