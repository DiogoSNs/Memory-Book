// ============================================
// ENTRY POINT - main.jsx
// Ponto de entrada da aplicação React
// ============================================

/**
 * Ponto de entrada principal da aplicação Memory Book React.
 * 
 * Responsabilidades:
 * - Inicializar a aplicação React no DOM
 * - Configurar React.StrictMode para desenvolvimento
 * - Importar estilos globais da aplicação
 * - Importar estilos do Leaflet para mapas
 * - Renderizar o componente App raiz
 * 
 * Dependências:
 * - React: Biblioteca principal para componentes
 * - ReactDOM: Renderização no DOM
 * - ./App.jsx: Componente raiz da aplicação
 * - ./index.css: Estilos globais da aplicação
 * - leaflet/dist/leaflet.css: Estilos do mapa Leaflet
 * 
 * Padrões de Projeto:
 * - Entry Point Pattern: Ponto único de entrada da aplicação
 * - Dependency Injection: Injeção do componente App
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

// Renderizar aplicação no elemento root do HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
