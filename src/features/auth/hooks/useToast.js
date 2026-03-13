import { useState, useCallback, useRef } from "react";

/**
 * useToast — hook reutilizable para mostrar toasts en cualquier componente.
 *
 * Uso:
 *   const { toasts, showToast } = useToast();
 *   showToast("Mensaje de error", "error");
 *   showToast("Operación exitosa", "success");
 *   showToast("Información", "info");
 *
 * Tipos disponibles: "error" | "success" | "info"
 * Duración por defecto: 4000ms
 */
export function useToast(duration = 4000) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 280); // duración de la animación de salida
  }, []);

  const showToast = useCallback((message, type = "error") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, leaving: false }]);

    // Auto-dismiss
    timers.current[id] = setTimeout(() => dismiss(id), duration);

    return () => {
      clearTimeout(timers.current[id]);
      dismiss(id);
    };
  }, [dismiss, duration]);

  return { toasts, showToast, dismiss };
}