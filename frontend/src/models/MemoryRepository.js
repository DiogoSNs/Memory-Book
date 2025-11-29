// ============================================
// REPOSITORY - MemoryRepository
// Gerencia o armazenamento e recuperação de memórias
// ============================================

import { Memory } from './Memory.js';

export class MemoryRepository {
  constructor() {
    this.storageKey = 'memories';
  }

  // Carrega todas as memórias do localStorage
  loadAll() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map(data => Memory.fromJSON(data));
    } catch (error) {
      console.error("❌ Erro ao carregar memórias:", error);
      return [];
    }
  }

  // Salva todas as memórias no localStorage
  saveAll(memories) {
    try {
      const serialized = memories.map(memory => memory.toJSON());
      const jsonString = JSON.stringify(serialized);
      localStorage.setItem(this.storageKey, jsonString);
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar memórias:", error);
      
      // Verificar se é erro de quota
      if (error.name === 'QuotaExceededError') {
        console.error("💾 Erro: Limite de armazenamento do localStorage excedido!");
        alert("Erro: Limite de armazenamento excedido! As fotos são muito grandes. Tente com imagens menores.");
      }
      
      return false;
    }
  }

  // Adiciona uma nova memória
  add(memoryData) {
    const memories = this.loadAll();
    const newMemory = new Memory(memoryData);
    newMemory.validate();
    
    memories.push(newMemory);
    this.saveAll(memories);
    return newMemory;
  }

  // Atualiza uma memória existente
  update(id, updatedData) {
    const memories = this.loadAll();
    const index = memories.findIndex(memory => memory.id === id);
    
    if (index === -1) {
      throw new Error("Memória não encontrada");
    }

    // Mantém o ID original e atualiza os outros campos
    const updatedMemory = new Memory({
      ...memories[index].toJSON(),
      ...updatedData,
      id: id
    });
    
    updatedMemory.validate();
    memories[index] = updatedMemory;
    this.saveAll(memories);
    return updatedMemory;
  }

  // Remove uma memória
  delete(id) {
    const memories = this.loadAll();
    const filteredMemories = memories.filter(memory => memory.id !== id);
    
    if (filteredMemories.length === memories.length) {
      throw new Error("Memória não encontrada");
    }
    
    this.saveAll(filteredMemories);
    return true;
  }

  // Busca uma memória por ID
  findById(id) {
    const memories = this.loadAll();
    return memories.find(memory => memory.id === id) || null;
  }

  // Conta o total de memórias
  count() {
    return this.loadAll().length;
  }
}
