// ============================================
// MODEL - Memory
// Representa uma memória no sistema
// ============================================

export class Memory {
  constructor({
    id = null,
    title,
    description = "",
    date,
    lat,
    lng,
    photos = null,
    music = null,
    color = null
  }) {
    this.id = id || Date.now();
    this.title = title;
    this.description = description;
    this.date = date;
    this.lat = lat;
    this.lng = lng;
    this.photos = photos;
    // NOVO: objeto de música selecionada { title, artist, preview_url, spotify_id, startTime, duration }
    // Comentário: substitui o antigo spotifyUrl baseado em link
    this.music = music;
    this.color = color || this.getRandomColor();
  }

  // Método para gerar cor aleatória
  getRandomColor() {
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
  }

  // Validação da memória
  validate() {
    if (!this.title || !this.title.trim()) {
      throw new Error("Título é obrigatório");
    }
    
    if (!this.lat || !this.lng) {
      throw new Error("Localização é obrigatória");
    }
    
    if (!this.date) {
      throw new Error("Data é obrigatória");
    }

    return true;
  }

  // Converte para objeto simples para serialização
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date,
      lat: this.lat,
      lng: this.lng,
      photos: this.photos,
      music: this.music,
      color: this.color
    };
  }

  // Cria instância a partir de objeto
  static fromJSON(data) {
    return new Memory(data);
  }
}
