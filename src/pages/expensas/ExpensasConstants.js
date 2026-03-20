import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

export const ESTADO = {
  pago: {
    label: "Pagado",
    color: "#2a6b6e",
    bg: "rgba(42,107,110,0.08)",
    border: "rgba(42,107,110,0.2)",
    dot: "#2a6b6e",
    Icon: FiCheckCircle,
  },
  pago_con_recargo: {
    label: "Pagado c/ recargo",
    color: "#c87941",
    bg: "rgba(249,177,122,0.10)",
    border: "rgba(249,177,122,0.3)",
    dot: "#f9b17a",
    Icon: FiCheckCircle,
  },
  pendiente: {
    label: "Pendiente",
    color: "#c87941",
    bg: "rgba(249,177,122,0.10)",
    border: "rgba(249,177,122,0.3)",
    dot: "#f9b17a",
    Icon: FiClock,
  },
  vencido: {
    label: "Vencido",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.2)",
    dot: "#b91c1c",
    Icon: FiAlertCircle,
  },
  vencido_pagado: {
    label: "Vencido — pagado",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.15)",
    dot: "#b91c1c",
    Icon: FiCheckCircle,
  },
  parcial: {
    label: "Pago parcial",
    color: "#7c5c9e",
    bg: "rgba(124,92,158,0.07)",
    border: "rgba(124,92,158,0.2)",
    dot: "#9b7dc4",
    Icon: FiClock,
  },
  pendiente_validacion: {
    label: "Pendiente validación",
    color: "#2a6b6e",
    bg: "rgba(42,107,110,0.07)",
    border: "rgba(42,107,110,0.2)",
    dot: "#5b9ea0",
    Icon: FiClock,
  },
  comprobante_rechazado: {
    label: "Comprobante rechazado",
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.07)",
    border: "rgba(185,28,28,0.2)",
    dot: "#b91c1c",
    Icon: FiAlertCircle,
  },
};

export const ITEM_COLORS = [
  "#2a6b6e",
  "#5b9ea0",
  "#8ecfd1",
  "#b0cfd0",
  "#f9b17a",
];

export const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);