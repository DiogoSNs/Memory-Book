// ============================================
// CONTROLLER - MemoryController.jsx
// Controller para gerenciamento de memórias geográficas
// ============================================

/**
 * Controller para gerenciamento de memórias geográficas da aplicação.
 * 
 * Responsabilidades:
 * - Gerenciar estado global das memórias do usuário
 * - Implementar operações CRUD para memórias (Create, Read, Update, Delete)
 * - Sincronizar dados com API backend
 * - Gerenciar estados de loading e erro
 * - Fornecer interface unificada para componentes acessarem memórias
 * - Controlar carregamento automático baseado em autenticação
 * 
 * Dependências:
 * - React: Biblioteca principal (createContext, useContext, useState, useEffect)
 * - ../utils/api: Cliente API e tratamento de erros
 * - ../contexts/AuthContext: Contexto de autenticação
 * 
 * Padrões de Projeto:
 * - MVC Pattern: Atua como Controller na arquitetura MVC
 * - Context Pattern: Compartilhamento de estado via Context API
 * - Observer Pattern: Observa mudanças na autenticação
 * - Repository Pattern: Interface para acesso a dados de memórias
 * - Facade Pattern: Simplifica acesso às operações de memória
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, ApiError } from '../utils/api.js';
import { authSubject } from '../contexts/AuthContext.jsx';

// Context para compartilhar estado das memórias
const MemoryContext = createContext(null);

// Provider que atua como Controller
export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // OBSERVER EXPLÍCITO: observa autenticação para carregar memórias quando autenticado
  const [authSnapshot, setAuthSnapshot] = useState(authSubject.getState());
  useEffect(() => {
    const unsubscribe = authSubject.subscribe((snapshot) => setAuthSnapshot(snapshot));
    return unsubscribe;
  }, []);

  // Carrega memórias ao inicializar (apenas se autenticado)
  useEffect(() => {
    // update: quando Subject notifica autenticação, decide carregar/limpar
    if (authSnapshot.isAuthenticated) {
      loadMemories();
    } else {
      setMemories([]);
      setIsLoaded(false);
    }
  }, [authSnapshot.isAuthenticated]);

  // Função para carregar memórias da API
  const loadMemories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getMemories();
      setMemories(response.memories || []);
      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar memórias:", error);
      setError(error instanceof ApiError ? error.message : 'Erro ao carregar memórias');
      setMemories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Adiciona nova memória
  const addMemory = async (memoryData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.addMemory(memoryData);
      const newMemory = response.memory;
      setMemories(prev => [...prev, newMemory]);
      return { success: true, memory: newMemory };
    } catch (error) {
      console.error("Erro ao adicionar memória:", error);
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao adicionar memória';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza memória existente
  const updateMemory = async (id, updatedData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.updateMemory(id, updatedData);
      const updatedMemory = response.memory;
      setMemories(prev => 
        prev.map(memory => 
          memory.id === id ? updatedMemory : memory
        )
      );
      return { success: true, memory: updatedMemory };
    } catch (error) {
      console.error("Erro ao atualizar memória:", error);
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao atualizar memória';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove memória
  const deleteMemory = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.deleteMemory(id);
      setMemories(prev => prev.filter(memory => memory.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar memória:", error);
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao deletar memória';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
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

  // Função para buscar memórias com filtros
  const searchMemories = async (filters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.searchMemories(filters);
      return { success: true, memories: response.memories || [] };
    } catch (error) {
      console.error("Erro ao buscar memórias:", error);
      const errorMessage = error instanceof ApiError ? error.message : 'Erro ao buscar memórias';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    findMemoryById,
    getMemoryCount,
    searchMemories,
    loadMemories,
    isLoaded,
    isLoading,
    error,
    clearError: () => setError(null)
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
