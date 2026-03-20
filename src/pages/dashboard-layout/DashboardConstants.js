import {
  FiGrid, FiSettings, FiDollarSign, FiHome,
  FiMessageSquare, FiPieChart, FiPhone, FiFileText, FiAlertCircle,
} from "react-icons/fi";

export const APP_VERSION = "v1.0.0";

export const SIDEBAR_ITEMS = [
  { id: "dashboard",     label: "Inicio",           icon: FiHome,          path: "/dashboard"     },
  { id: "expensas",      label: "Expensas",         icon: FiDollarSign,    path: "/expensas"      },
  { id: "documentos",    label: "Documentos",       icon: FiFileText,      path: "/documentos"    },
  { id: "mensajes",      label: "Mensajes",         icon: FiMessageSquare, path: "/mensajes"      },
  { id: "reclamos",      label: "Reclamos",         icon: FiAlertCircle,   path: "/reclamos"      },
  { id: "encuestas",     label: "Encuestas",        icon: FiPieChart,      path: "/encuestas"     },
  { id: "contactos",     label: "Contactos útiles", icon: FiPhone,         path: "/contactos"     },
  { id: "configuracion", label: "Configuración",    icon: FiSettings,      path: "/configuracion" },
];

export const BOTTOM_ITEMS = [
  { id: "dashboard", label: "Inicio",    icon: FiHome,          path: "/dashboard" },
  { id: "expensas",  label: "Expensas",  icon: FiDollarSign,    path: "/expensas"  },
  { id: "mensajes",  label: "Mensajes",  icon: FiMessageSquare, path: "/mensajes"  },
  { id: "encuestas", label: "Encuestas", icon: FiPieChart,      path: "/encuestas" },
];

export const MOCK_CONSORCIOS = [
  { id: "c1", nombre: "Edificio Las Acacias", direccion: "Av. Corrientes 1234" },
  { id: "c2", nombre: "Torre San Martín",     direccion: "San Martín 567"      },
  { id: "c3", nombre: "Complejo Los Olivos",  direccion: "Av. Santa Fe 890"    },
];

export const MOCK_CONSORCIOS_POR_USUARIO = {
  "admin@consorcia.com":   ["c1", "c2", "c3"],
  "council@consorcia.com": ["c1", "c2"],
  "owner@consorcia.com":   ["c1", "c2"],
  "owner2@consorcia.com":  ["c3"],
  "tenant@consorcia.com":  ["c1"],
};

export const MOCK_NOTIFICACIONES = [
  { title: "Expensa cargada",  desc: "Mayo 2025 disponible",   time: "hace 2h", dot: "#5b9ea0" },
  { title: "Nuevo reclamo",    desc: "Unidad 4B — Filtración", time: "hace 5h", dot: "#f9b17a" },
  { title: "Votación activa",  desc: "Pintura pasillo",        time: "ayer",    dot: "#5b9ea0" },
];

// Filtra items de nav según rol
export function filterNavItems(items, role) {
  return items.filter(i => {
    if (role === "tenant" && ["documentos", "encuestas", "reclamos"].includes(i.id)) return false;
    return true;
  });
}