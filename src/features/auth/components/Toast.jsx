import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

/**
 * Toast — componente de notificaciones flotantes.
 *
 * Props:
 *   toasts  — array de toasts del hook useToast
 *   dismiss — función para cerrar un toast manualmente
 *
 * Se renderiza con portal al body usando position: fixed.
 * Colocalo una sola vez en el componente raíz o en el layout.
 */

const STYLES = {
  error: {
    background: "#fff1f1",
    border: "1px solid rgba(185,28,28,0.2)",
    iconColor: "#b91c1c",
    iconBg: "#fee2e2",
    barColor: "#b91c1c",
    Icon: FiAlertCircle,
  },
  success: {
    background: "#f0fafa",
    border: "1px solid rgba(42,107,110,0.25)",
    iconColor: "#2a6b6e",
    iconBg: "rgba(42,107,110,0.12)",
    barColor: "#2a6b6e",
    Icon: FiCheckCircle,
  },
  info: {
    background: "#f0f8f8",
    border: "1px solid rgba(91,158,160,0.3)",
    iconColor: "#5b9ea0",
    iconBg: "rgba(91,158,160,0.12)",
    barColor: "#5b9ea0",
    Icon: FiInfo,
  },
};

function ToastItem({ toast, onDismiss }) {
  const s = STYLES[toast.type] || STYLES.error;
  const { Icon } = s;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px 12px 0",
        borderRadius: 14,
        background: s.background,
        border: s.border,
        boxShadow: "0 8px 32px rgba(45,50,80,0.12), 0 2px 8px rgba(45,50,80,0.06)",
        minWidth: 280,
        maxWidth: 360,
        fontFamily: "'Raleway', sans-serif",
        animation: toast.leaving
          ? "toast-out 0.28s cubic-bezier(0.4,0,1,1) forwards"
          : "toast-in 0.32s cubic-bezier(0.22,1,0.36,1) forwards",
        pointerEvents: "all",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Barra de acento izquierda */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 4,
        borderRadius: "14px 0 0 14px",
        background: s.barColor,
        flexShrink: 0,
      }} />

      {/* Ícono */}
      <div style={{
        marginLeft: 14,
        width: 30, height: 30, borderRadius: 8,
        background: s.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={15} color={s.iconColor} />
      </div>

      {/* Mensaje */}
      <p style={{
        flex: 1,
        margin: 0,
        fontSize: 13,
        fontWeight: 500,
        color: "#2d3250",
        lineHeight: 1.5,
        paddingTop: 5,
      }}>
        {toast.message}
      </p>

      {/* Cerrar */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        style={{
          background: "none",
          border: "none",
          padding: 4,
          cursor: "pointer",
          color: "rgba(45,50,80,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          flexShrink: 0,
          transition: "color 0.15s, background 0.15s",
          marginTop: 2,
          touchAction: "manipulation",
        }}
        onMouseEnter={e => { e.currentTarget.style.color="#2d3250"; e.currentTarget.style.background="rgba(45,50,80,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color="rgba(45,50,80,0.35)"; e.currentTarget.style.background="none"; }}
      >
        <FiX size={14} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, dismiss }) {
  if (!toasts.length) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateX(0); max-height: 80px; margin-bottom: 0; }
          to   { opacity: 0; transform: translateX(110%); max-height: 0; margin-bottom: -10px; }
        }
      `}</style>
      <div
        aria-label="Notificaciones"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}