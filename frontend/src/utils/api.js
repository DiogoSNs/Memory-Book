// ============================================
// API FACADE
// Padrão Facade para abstrair chamadas HTTP
// ============================================

/**
 * Configuração base da API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Classe utilitária para gerenciar tokens JWT
 */
class TokenManager {
  static getToken() {
    return localStorage.getItem('authToken');
  }

  static setToken(token) {
    localStorage.setItem('authToken', token);
  }

  static removeToken() {
    localStorage.removeItem('authToken');
  }

  static isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

/**
 * Classe para tratamento de erros da API
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * FACADE PATTERN - Classe Principal ApiFacade
 * 
 * Implementa o padrão Facade fornecendo uma interface simplificada para:
 * 
 * SUBSISTEMAS COMPLEXOS ABSTRAÍDOS:
 * 1. Fetch API nativa do JavaScript
 * 2. Gerenciamento de tokens JWT (TokenManager)
 * 3. Tratamento de erros HTTP (ApiError)
 * 4. Configuração de headers e autenticação
 * 5. Parsing de respostas JSON
 * 6. Validação de status HTTP
 * 
 * BENEFÍCIOS DO PADRÃO FACADE:
 * - Simplicidade: Interface única para operações complexas
 * - Abstração: Oculta detalhes de implementação dos subsistemas
 * - Reutilização: Métodos padronizados para todas as requisições
 * - Manutenibilidade: Mudanças centralizadas em um local
 * - Consistência: Tratamento uniforme de erros e autenticação
 * 
 * ESTRUTURA DO PADRÃO:
 * Cliente -> ApiFacade -> [TokenManager, ApiError, Fetch API]
 * 
 * EXEMPLO DE USO:
 * // Sem Facade (complexo):
 * const token = localStorage.getItem('authToken');
 * const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
 * if (!response.ok) throw new Error('Erro');
 * const data = await response.json();
 * 
 * // Com Facade (simples):
 * const data = await ApiFacade.get('/users');
 */
class ApiFacade {
  /**
   * Método privado para fazer requisições HTTP
   */
  static async #makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = (data && (data.message || data.error || data.detail)) || 'Erro na requisição';
        throw new ApiError(
          errorMsg,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Erro de conexão com o servidor',
        0,
        { originalError: error.message }
      );
    }
  }

  // ============================================
  // MÉTODOS DE AUTENTICAÇÃO
  // ============================================

  /**
   * Registra um novo usuário
   */
  static async register(userData) {
    const response = await this.#makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.access_token) {
      TokenManager.setToken(response.access_token);
    }

    return response;
  }

  /**
   * Faz login do usuário
   */
  static async login(credentials) {
    const response = await this.#makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.access_token) {
      TokenManager.setToken(response.access_token);
    }

    return response;
  }

  /**
   * Faz logout do usuário
   */
  static async logout() {
    try {
      await this.#makeRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      TokenManager.removeToken();
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated() {
    return TokenManager.isTokenValid();
  }

  /**
   * Obtém informações do usuário atual
   */
  static async getCurrentUser() {
    return await this.#makeRequest('/auth/me');
  }

  // ============================================
  // MÉTODOS DE USUÁRIOS
  // ============================================

  /**
   * Obtém perfil do usuário
   */
  static async getUserProfile(userId) {
    return await this.#makeRequest(`/users/${userId}`);
  }

  /**
   * Atualiza perfil do usuário
   */
  static async updateUserProfile(userId, userData) {
    return await this.#makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Deleta conta do usuário
   */
  static async deleteUser(userId) {
    return await this.#makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // MÉTODOS DE MEMÓRIAS
  // ============================================

  /**
   * Obtém todas as memórias do usuário
   */
  static async getMemories() {
    return await this.#makeRequest('/memories');
  }

  /**
   * Obtém uma memória específica
   */
  static async getMemory(memoryId) {
    return await this.#makeRequest(`/memories/${memoryId}`);
  }

  /**
   * Cria uma nova memória
   */
  static async addMemory(memoryData) {
    return await this.#makeRequest('/memories', {
      method: 'POST',
      body: JSON.stringify(memoryData),
    });
  }

  /**
   * Atualiza uma memória existente
   */
  static async updateMemory(memoryId, memoryData) {
    return await this.#makeRequest(`/memories/${memoryId}`, {
      method: 'PUT',
      body: JSON.stringify(memoryData),
    });
  }

  /**
   * Deleta uma memória
   */
  static async deleteMemory(memoryId) {
    return await this.#makeRequest(`/memories/${memoryId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Busca memórias por filtros
   */
  static async searchMemories(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/memories/search?${queryString}` : '/memories/search';
    
    return await this.#makeRequest(endpoint);
  }

  // ============================================
  // MÉTODOS UTILITÁRIOS
  // ============================================

  /**
   * Verifica se a API está funcionando
   */
  static async healthCheck() {
    return await this.#makeRequest('/health');
  }

  /**
   * Obtém estatísticas do usuário
   */
  static async getUserStats() {
    return await this.#makeRequest('/users/stats');
  }

  /**
   * Obtém preferências do usuário
   */
  static async getUserPreferences() {
    return await this.#makeRequest('/auth/preferences');
  }

  /**
   * Atualiza preferências do usuário
   */
  static async updateUserPreferences(preferences) {
    return await this.#makeRequest('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // ============================================
  // MÚSICAS - INTEGRAÇÃO COM SPOTIFY (BUSCA POR NOME)
  // ============================================

  /**
   * Busca faixas no Spotify pelo nome
   * Comentário: espera endpoint do backend em `/spotify/search?q=` que devolve
   * itens com { title, artist, preview_url, spotify_id, cover_url }
   */
  static async searchSpotifyTracks(query) {
    const q = encodeURIComponent(query);
    return await this.#makeRequest(`/spotify/search?q=${q}&limit=30`);
  }
}

// ============================================
// EXPORTAÇÕES
// ============================================

// Exporta a classe principal
export default ApiFacade;

// Exporta também o gerenciador de tokens para uso direto se necessário
export { TokenManager, ApiError };

// Exporta funções de conveniência para uso mais simples
export const api = {
  // Autenticação
  register: (userData) => ApiFacade.register(userData),
  login: (credentials) => ApiFacade.login(credentials),
  logout: () => ApiFacade.logout(),
  isAuthenticated: () => ApiFacade.isAuthenticated(),
  getCurrentUser: () => ApiFacade.getCurrentUser(),

  // Usuários
  getUserProfile: (userId) => ApiFacade.getUserProfile(userId),
  updateUserProfile: (userId, userData) => ApiFacade.updateUserProfile(userId, userData),
  deleteUser: (userId) => ApiFacade.deleteUser(userId),

  // Memórias
  getMemories: () => ApiFacade.getMemories(),
  getMemory: (memoryId) => ApiFacade.getMemory(memoryId),
  addMemory: (memoryData) => ApiFacade.addMemory(memoryData),
  updateMemory: (memoryId, memoryData) => ApiFacade.updateMemory(memoryId, memoryData),
  deleteMemory: (memoryId) => ApiFacade.deleteMemory(memoryId),
  searchMemories: (filters) => ApiFacade.searchMemories(filters),

  // Utilitários
  healthCheck: () => ApiFacade.healthCheck(),
  getUserStats: () => ApiFacade.getUserStats(),

  // Preferências
  getUserPreferences: () => ApiFacade.getUserPreferences(),
  updateUserPreferences: (preferences) => ApiFacade.updateUserPreferences(preferences),

  // Músicas (Spotify)
  searchSpotifyTracks: (query) => ApiFacade.searchSpotifyTracks(query),
};
