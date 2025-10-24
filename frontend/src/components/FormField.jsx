// ============================================
// COMPONENT/COMPOSITE PATTERN - FormField
// Componente atômico que demonstra o padrão Component/Composite
// ============================================

import React from "react";

/**
 * COMPONENT/COMPOSITE PATTERN - Componente Leaf (Folha)
 * 
 * Este componente demonstra o padrão Component/Composite em React:
 * 
 * 1. COMPONENT: Interface comum para todos os elementos da UI
 *    - Recebe props padronizadas (label, icon, children)
 *    - Renderiza de forma consistente
 *    - Pode ser usado em qualquer lugar da aplicação
 * 
 * 2. COMPOSITE: Pode conter outros componentes através de 'children'
 *    - Aceita qualquer elemento React como filho
 *    - Permite composição hierárquica
 *    - Facilita reutilização e modularidade
 * 
 * Benefícios do padrão:
 * - Reutilização: Mesmo componente usado em diferentes contextos
 * - Composição: Pode ser combinado com outros componentes
 * - Consistência: Aparência e comportamento padronizados
 * - Manutenibilidade: Mudanças centralizadas em um local
 * 
 * Exemplo de uso:
 * <FormField label="Email" icon={<MailIcon />}>
 *   <input type="email" />
 * </FormField>
 */
export function FormField({ label, icon, children }) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#374151",
          marginBottom: "0.25rem",
        }}
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}