import {
  FiCreditCard, FiFileText, FiBell,
  FiBarChart2, FiHome, FiZap,
  FiTool, FiCheckSquare,
} from "react-icons/fi";

export const APP_VERSION = "v1.0.0";

// Usadas en HomeHero para las floating shapes (inline solo para top/left/size/delay dinámicos)
export const SHAPES = [
  { size: 180, top: "8%",  left: "72%", delay: 0,   dur: 18 },
  { size: 90,  top: "55%", left: "80%", delay: 3,   dur: 14 },
  { size: 260, top: "65%", left: "-6%", delay: 6,   dur: 22 },
  { size: 60,  top: "20%", left: "15%", delay: 1.5, dur: 16 },
  { size: 120, top: "38%", left: "50%", delay: 9,   dur: 20 },
];

export const FEATURES = [
  { icon: FiCreditCard,  label: "Expensas digitales"     },
  { icon: FiFileText,    label: "Actas y documentos"     },
  { icon: FiBell,        label: "Avisos al instante"     },
  { icon: FiBarChart2,   label: "Reportes claros"        },
  { icon: FiHome,        label: "Por unidad"             },
  { icon: FiZap,         label: "100% online"            },
  { icon: FiTool,        label: "Gestión de reclamos"    },
  { icon: FiCheckSquare, label: "Encuestas y votaciones" },
];