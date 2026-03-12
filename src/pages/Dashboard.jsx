import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiMessageSquare,
  FiSettings,
  FiUsers,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const THEME_KEY = "consorcia-theme";

// Menú base (como DemoPage)
const BASE_NAV = [
  { key: "dashboard", label: "Dashboard", icon: FiHome },
  { key: "expenses", label: "Gastos", icon: FiDollarSign },
  { key: "messages", label: "Mensajes", icon: FiMessageSquare },
  { key: "settings", label: "Configuración", icon: FiSettings },
];

// Menú extra por rol (ejemplo)
const NAV_BY_ROLE = {
  owner: [...BASE_NAV],
  council: [...BASE_NAV],
  admin: [
    ...BASE_NAV,
    { key: "users", label: "Usuarios", icon: FiUsers },
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();

  // UI shell (mismo comportamiento que DemoPage)
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  // ===== User / Role desde sessionStorage (tu login mock actual) =====
  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("consorcia_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = (user?.role || "owner").toLowerCase();
  const NAV = NAV_BY_ROLE[role] || NAV_BY_ROLE.owner;

  const activeLabel = useMemo(
    () => NAV.find((n) => n.key === active)?.label ?? "Dashboard",
    [NAV, active]
  );

  // ===== Theme (igual que DemoPage) =====
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  // init + resize listener (igual patrón DemoPage)
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);

    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== Sidebar behavior =====
  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen((v) => !v);
    else setSidebarCollapsed((v) => !v);
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  const onNavClick = (key) => {
    setActive(key);
    if (isMobile) closeMobileSidebar();
    // Si más adelante querés navegar a rutas reales:
    // navigate(`/dashboard/${key === "dashboard" ? "" : key}`);
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* ========================= HEADER (mismas clases DemoPage) ========================= */}
      <header className="header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar} aria-label="Menú">
            <span className="hamburger-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div className="brand">
            <div className="brand-mark">C</div>
            <div className="brand-title">
              <strong>CONSORCIA</strong>
              <span>Dashboard · {role}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="theme-switch">
            <button className="btn btn-outline btn-sm" onClick={() => applyTheme("light")}>
              Light
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => applyTheme("dark")}>
              Dark
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => applyTheme("amoled")}>
              AMOLED
            </button>
          </div>

          <button className="btn btn-outline btn-sm" onClick={logout}>
            <FiLogOut style={{ marginRight: 8 }} />
            Salir
          </button>
        </div>
      </header>

      {/* ========================= OVERLAY (mobile) ========================= */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}

      {/* ========================= SIDEBAR (mismas clases DemoPage) ========================= */}
      <aside
        className={[
          "sidebar",
          isMobile ? "mobile-drawer" : "",
          isMobile && sidebarOpen ? "open" : "",
        ].join(" ")}
      >
        <div className="sidebar-section">
          <div className="sidebar-title">Navegación</div>

          <nav className="nav">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;

              return (
                <div
                  key={item.key}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => onNavClick(item.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onNavClick(item.key);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  data-tooltip={item.label}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Sesión</div>

          <div className="card" style={{ padding: 14 }}>
            <p style={{ margin: 0 }}>
              Usuario: <strong>{user?.name || "—"}</strong>
            </p>
            <p className="mt-8" style={{ marginBottom: 0 }}>
              Rol: <span className="badge badge-info">{role}</span>
            </p>

            <div className="divider" />

            <button className="btn btn-danger" onClick={logout} style={{ width: "100%" }}>
              <FiX style={{ marginRight: 8 }} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* ========================= CONTENT ========================= */}
      <main className="content">
        <div className="content-inner">
          <div className="section">
            <div className="breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">/</span>
              <strong>{activeLabel}</strong>
            </div>

            <h1 className="mt-12">Panel</h1>
            <p className="mt-8">
              Este Dashboard reutiliza <strong>exactamente</strong> el sistema visual de <strong>DemoPage</strong> (clases + variables CSS + theme).
            </p>
          </div>

          <div className="section grid">
            <div className="card">
              <h3>Sección activa</h3>
              <p className="mt-8">
                Estás en: <strong>{activeLabel}</strong>
              </p>
            </div>

            <div className="card">
              <h3>Acciones</h3>
              <div className="row mt-12">
                <button className="btn btn-primary" onClick={() => alert("Acción demo")}>
                  Acción primaria
                </button>
                <button className="btn btn-outline" onClick={() => setSidebarCollapsed((v) => !v)}>
                  Colapsar sidebar
                </button>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="alert alert-info">
              Tip: el color exacto lo provee tu CSS de Demo (variables + temas). Este archivo NO define HEX nuevos.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}