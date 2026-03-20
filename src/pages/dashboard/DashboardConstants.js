export const ESTADO_CONFIG = {
  pago:      { label: "Pagado",    bg: "rgba(42,107,110,0.08)",  border: "rgba(42,107,110,0.2)",   color: "#2a6b6e", dot: "#2a6b6e" },
  pendiente: { label: "Pendiente", bg: "rgba(249,177,122,0.10)", border: "rgba(249,177,122,0.35)", color: "#c87941", dot: "#f9b17a" },
  vencido:   { label: "Vencido",   bg: "rgba(185,28,28,0.07)",   border: "rgba(185,28,28,0.2)",    color: "#b91c1c", dot: "#b91c1c" },
};

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function getFormattedDate() {
  const d = new Date().toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export const ROLE_LABELS = {
  admin:   "Administrador",
  council: "Consejo",
  owner:   "Propietario",
  tenant:  "Inquilino",
};