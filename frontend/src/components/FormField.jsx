// ============================================
// COMPONENT - FormField
// Campo de formulário estilizado
// ============================================

import React from "react";

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