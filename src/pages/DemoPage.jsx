import { useEffect, useMemo, useRef, useState } from "react";
// import "../styles/consorcia.css";
import {
  FiHome,
  FiDollarSign,
  FiMessageSquare,
  FiSettings,
  FiMoreVertical,
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { 
  AiOutlineCheckCircle, 
  AiOutlineWarning, 
  AiOutlineCloseCircle, 
  AiOutlineInfoCircle,
  AiOutlineUpload,
  AiOutlineSearch
} from "react-icons/ai";


const NAV = [
  { key: "dashboard", label: "Dashboard", icon: FiHome },
  { key: "expenses", label: "Gastos", icon: FiDollarSign },
  { key: "messages", label: "Mensajes", icon: FiMessageSquare },
  { key: "settings", label: "Configuración", icon: FiSettings },
];

const THEME_KEY = "consorcia-theme";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const pad2 = (n) => String(n).padStart(2, "0");
const formatISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function DemoPage() {
  // Shell / nav
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  // Tabs + Modal
  const [tab, setTab] = useState("general");
  const [modalOpen, setModalOpen] = useState(false);

  // Toast/Snackbar queue
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  // Dropdown/Menu
  const [openMenuForId, setOpenMenuForId] = useState(null);

  // List: loading + search + pagination + empty toggle
  const [listLoading, setListLoading] = useState(true);
  const [emptyMode, setEmptyMode] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // Accordion
  const [openAcc, setOpenAcc] = useState(null);

  // DatePicker pattern (input + popover quick picks)
  const [dateValue, setDateValue] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const dateWrapRef = useRef(null);

  // Form demo state (completo)
  const [form, setForm] = useState({
    nombre: "Juan Pérez",
    email: "juan@correo.com",
    password: "123456",
    buscar: "",
    monto: 12000,
    fecha: "",
    tipo: "owner",
    mensaje: "Consulta sobre expensas.",
    aceptar: true,
    preferencia: "email",
    notificaciones: true,
    archivo: null,
  });

  /* ===============================
     Derived
     =============================== */
  const activeLabel = useMemo(
    () => NAV.find((n) => n.key === active)?.label ?? "Dashboard",
    [active]
  );

  const baseItems = useMemo(() => {
    if (emptyMode) return [];
    return [
      { id: "it-1001", concepto: "Expensas", estado: "Pendiente", importe: 24500, vence: "15/03" },
      { id: "it-1002", concepto: "Mantenimiento", estado: "Pagado", importe: 8200, vence: "—" },
      { id: "it-1003", concepto: "Fondo reserva", estado: "Info", importe: 3100, vence: "30/03" },
      { id: "it-1004", concepto: "Limpieza", estado: "Pendiente", importe: 4900, vence: "20/03" },
      { id: "it-1005", concepto: "Seguridad", estado: "Info", importe: 11200, vence: "28/03" },
      { id: "it-1006", concepto: "Ascensores", estado: "Pendiente", importe: 7600, vence: "25/03" },
      { id: "it-1007", concepto: "Electricidad", estado: "Pagado", importe: 5300, vence: "—" },
      { id: "it-1008", concepto: "Gas", estado: "Pendiente", importe: 6100, vence: "22/03" },
      { id: "it-1009", concepto: "Agua", estado: "Info", importe: 2800, vence: "27/03" },
      { id: "it-1010", concepto: "Pintura", estado: "Pendiente", importe: 19500, vence: "31/03" },
      { id: "it-1011", concepto: "Reparación", estado: "Info", importe: 9000, vence: "05/04" },
      { id: "it-1012", concepto: "Administración", estado: "Pagado", importe: 15000, vence: "—" },
    ];
  }, [emptyMode]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return baseItems;
    return baseItems.filter((it) => it.concepto.toLowerCase().includes(q));
  }, [baseItems, search]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)),
    [filteredItems.length]
  );

  useEffect(() => {
    setPage((p) => clamp(p, 1, totalPages));
  }, [totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const quickPicks = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const in7 = new Date();
    in7.setDate(today.getDate() + 7);
    return [
      { label: "Hoy", value: formatISO(today) },
      { label: "Mañana", value: formatISO(tomorrow) },
      { label: "+7 días", value: formatISO(in7) },
      { label: "Limpiar", value: "" },
    ];
  }, []);

  /* ===============================
     Theme
     =============================== */
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  /* ===============================
     Sidebar behavior
     =============================== */
  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen((v) => !v);
    else setSidebarCollapsed((v) => !v);
  };
  const closeMobileSidebar = () => setSidebarOpen(false);

  /* ===============================
     Toast queue
     =============================== */
  const pushToast = (message, variant = "success") => {
    const id = uid();
    const toast = { id, message, variant };
    setToasts((prev) => [toast, ...prev].slice(0, 4));

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, 2600);

    toastTimers.current.set(id, timer);
  };

  const dismissToast = (id) => {
    const timer = toastTimers.current.get(id);
    if (timer) clearTimeout(timer);
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* ===============================
     Effects: init + global listeners
     =============================== */
  useEffect(() => {
    // theme init
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);

    // list loading init
    setListLoading(true);
    const t = setTimeout(() => setListLoading(false), 900);

    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      // clear toast timers
      for (const [, timer] of toastTimers.current) clearTimeout(timer);
      toastTimers.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown / date popover on outside click + ESC
  useEffect(() => {
    const onDocDown = (e) => {
      const ddRoot = e.target.closest?.("[data-dropdown-root]");
      if (!ddRoot) setOpenMenuForId(null);

      const inDate = dateWrapRef.current?.contains(e.target);
      if (!inDate) setDateOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenuForId(null);
        setDateOpen(false);
        if (isMobile) setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMobile]);

  /* ===============================
     Handlers
     =============================== */
  const onNavClick = (key) => {
    setActive(key);
    if (isMobile) closeMobileSidebar();
  };

  // ✅ FIX: preserva key correctamente (esto evita pérdidas de UI/estado)
  const onChange = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox"
        ? e.target.checked
        : e?.target?.type === "file"
        ? e.target.files?.[0] ?? null
        : e.target.value;

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const badgeClassFor = (estado) => {
    if (estado === "Pagado") return "badge badge-success";
    if (estado === "Pendiente") return "badge badge-warning";
    if (estado === "Info") return "badge badge-info";
    return "badge";
  };

  const toastClassFor = (variant) => {
    if (variant === "success") return "toast toast-success";
    if (variant === "error") return "toast toast-error";
    if (variant === "info") return "toast toast-info";
    return "toast";
  };

  const handleAction = (action, item) => {
    setOpenMenuForId(null);
    if (action === "edit") pushToast(`Editando: ${item.concepto}`, "info");
    if (action === "duplicate") pushToast(`Duplicado: ${item.concepto}`, "success");
    if (action === "delete") pushToast(`Eliminado: ${item.concepto}`, "error");
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* ========================= HEADER ========================= */}
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
              <span>UI · Light / Dark / AMOLED</span>
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
        </div>
      </header>

      {/* ========================= OVERLAY (mobile) ========================= */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}

      {/* ========================= SIDEBAR ========================= */}
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
          <div className="sidebar-title">Rol (demo)</div>

          <div className="card" style={{ padding: 14 }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="badge badge-success">owner</span>
              <span className="badge badge-warning">council</span>
              <span className="badge badge-error">admin</span>
              <span className="badge badge-info">support</span>
            </div>

            <div className="divider" />

            <p>
              Tip: <span className="kbd">☰</span> colapsa en desktop / abre en mobile.
            </p>
            <p className="mt-8">Tooltips aparecen solo cuando está colapsado ✅</p>
          </div>
        </div>
      </aside>

      {/* ========================= CONTENT ========================= */}
      <main className="content">
        <div className="content-inner">
          {/* Breadcrumb / Intro */}
          <div className="section">
            <div className="breadcrumb">
              <span>Inicio</span>
              <span className="crumb-sep">/</span>
              <span>Demo</span>
              <span className="crumb-sep">/</span>
              <strong>{activeLabel}</strong>
            </div>

            <h1 className="mt-12">CONSORCIA UI</h1>
            <p className="mt-8">
              Demo completa: Buttons · Badges · Forms · Toast · Dropdown · Pagination/Empty · Skeleton · Accordion · DatePicker pattern.
            </p>
          </div>

          {/* Summary cards */}
          <div className="section grid">
            <div className="card">
              <h3>Sección activa</h3>
              <p className="mt-8">
                Estás en: <strong>{activeLabel}</strong>
              </p>
            </div>

            <div className="card">
              <h3>Acciones rápidas</h3>
              <div className="row mt-12">
                <button className="btn btn-success" onClick={() => pushToast("✅ Guardado OK", "success")}>
                  Guardar (Toast)
                </button>
                <button className="btn btn-secondary" onClick={() => setModalOpen(true)}>
                  Abrir Modal
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setListLoading(true);
                    setTimeout(() => setListLoading(false), 800);
                    pushToast("Actualizando listado…", "info");
                  }}
                >
                  Refrescar listado
                </button>
              </div>
            </div>
          </div>

          {/* ========================= RESTAURADO: Buttons + Badges ========================= */}
          <div className="section">
            <h3>Botones</h3>
            <div className="row mt-12">
              <button className="btn btn-primary" onClick={() => pushToast("Acción primaria", "info")}>
                Primario
              </button>
              <button className="btn btn-secondary">Secundario</button>
              <button className="btn btn-outline">Outline</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-link">Link</button>
            </div>

            <div className="row mt-12">
              <button className="btn btn-success">Success</button>
              <button className="btn btn-danger">Danger</button>
              <button className="btn btn-outline" disabled>
                Disabled
              </button>
              <button className="btn btn-icon" aria-label="Acción">
                <FiSettings />
              </button>
              <button className="btn btn-outline btn-sm">Small</button>
              <button className="btn btn-primary btn-lg">Large</button>
            </div>
          </div>

          <div className="section">
            <h3>Badges</h3>
            <div className="row mt-12">
              <span className="badge badge-success">Activo</span>
              <span className="badge badge-warning">Pendiente</span>
              <span className="badge badge-error">Bloqueado</span>
              <span className="badge badge-info">Info</span>
            </div>
          </div>

          {/* Alerts */}
          <div className="section">
            <h3>Alertas</h3>
            <div className="row stack mt-12">
              <div className="alert alert-success">
                <AiOutlineCheckCircle size={18} /> Todo OK
              </div>
              <div className="alert alert-warning">
                <AiOutlineWarning size={18} /> Atención
              </div>
              <div className="alert alert-error">
                <AiOutlineCloseCircle size={18} /> Error
              </div>
              <div className="alert alert-info">
                <AiOutlineInfoCircle size={18} /> Información
              </div>
            </div>
          </div>

          {/* ========================= Toast Stack ========================= */}
          {toasts.length > 0 && (
            <div className="toast-stack" aria-live="polite" aria-atomic="true">
              {toasts.map((t) => (
                <div key={t.id} className={toastClassFor(t.variant)}>
                  <span className="toast-icon" aria-hidden="true">
                    {t.variant === "success" && <FiCheckCircle />}
                    {t.variant === "error" && <FiX />}
                    {t.variant === "info" && <FiInfo />}
                  </span>
                  <span className="toast-text">{t.message}</span>
                  <button className="toast-close" onClick={() => dismissToast(t.id)} aria-label="Cerrar">
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="section">
            <h3>Tabs</h3>
            <div className="row mt-12">
              <div className="tabs" role="tablist" aria-label="Tabs demo">
                <button
                  className={`tab ${tab === "general" ? "active" : ""}`}
                  onClick={() => setTab("general")}
                  role="tab"
                  aria-selected={tab === "general"}
                >
                  General
                </button>
                <button
                  className={`tab ${tab === "pagos" ? "active" : ""}`}
                  onClick={() => setTab("pagos")}
                  role="tab"
                  aria-selected={tab === "pagos"}
                >
                  Pagos
                </button>
                <button
                  className={`tab ${tab === "config" ? "active" : ""}`}
                  onClick={() => setTab("config")}
                  role="tab"
                  aria-selected={tab === "config"}
                >
                  Config
                </button>
              </div>
              <span className="badge badge-info">tab: {tab}</span>
            </div>
          </div>

          {/* ========================= List: Skeleton + Search + Empty + Pagination + Dropdown ========================= */}
          <div className="section">
            <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
              <div>
                <h3>Listado real + Dropdown + Pagination</h3>
                <p className="mt-8">Búsqueda, empty state, skeleton y menú por ítem.</p>
              </div>

              <div className="row">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setEmptyMode((v) => !v);
                    setListLoading(true);
                    setTimeout(() => setListLoading(false), 650);
                  }}
                >
                  {emptyMode ? "Ver datos" : "Forzar Empty"}
                </button>
              </div>
            </div>

            <div className="card mt-12">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="label">Buscar por concepto</div>
                  <input
                    className="control"
                    placeholder="Ej: Expensas"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="row" style={{ alignItems: "flex-end" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearch("");
                      pushToast("Búsqueda limpiada", "info");
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="divider" />

              {listLoading ? (
                <div className="list-skeleton">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton-row">
                      <div className="skeleton w-40" />
                      <div className="skeleton w-20" />
                      <div className="skeleton w-20" />
                      <div className="skeleton w-12" />
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-title">No hay registros</div>
                  <div className="empty-subtitle">
                    Probá ajustar la búsqueda o desactivar el modo empty.
                  </div>
                  <div className="row mt-12">
                    <button className="btn btn-primary" onClick={() => pushToast("Crear nuevo (demo)", "info")}>
                      Crear nuevo
                    </button>
                    <button className="btn btn-outline" onClick={() => setSearch("")}>
                      Limpiar búsqueda
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-wrap">
                    <table className="table" aria-label="Tabla demo">
                      <thead>
                        <tr>
                          <th>Concepto</th>
                          <th>Estado</th>
                          <th>Importe</th>
                          <th>Vence</th>
                          <th style={{ width: 1 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {pagedItems.map((it) => (
                          <tr key={it.id}>
                            <td>{it.concepto}</td>
                            <td>
                              <span className={badgeClassFor(it.estado)}>{it.estado}</span>
                            </td>
                            <td>$ {it.importe.toLocaleString("es-AR")}</td>
                            <td>{it.vence}</td>
                            <td style={{ textAlign: "right" }}>
                              <div className="dropdown" data-dropdown-root>
                                <button
                                  className="btn btn-icon"
                                  aria-label="Acciones"
                                  onClick={() =>
                                    setOpenMenuForId((cur) => (cur === it.id ? null : it.id))
                                  }
                                >
                                  <FiMoreVertical />
                                </button>

                                {openMenuForId === it.id && (
                                  <div className="dropdown-menu" role="menu">
                                    <button className="menu-item" onClick={() => handleAction("edit", it)} role="menuitem">
                                      <FiEdit2 /> Editar
                                    </button>
                                    <button className="menu-item" onClick={() => handleAction("duplicate", it)} role="menuitem">
                                      <FiCopy /> Duplicar
                                    </button>
                                    <button className="menu-item danger" onClick={() => handleAction("delete", it)} role="menuitem">
                                      <FiTrash2 /> Eliminar
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="row mt-12" style={{ justifyContent: "space-between", width: "100%" }}>
                    <p>
                      Página <strong>{page}</strong> de <strong>{totalPages}</strong> · Total:{" "}
                      <strong>{filteredItems.length}</strong>
                    </p>

                    <div className="pagination">
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ========================= Accordion ========================= */}
          <div className="section">
            <h3>Accordion (FAQs / Config largas)</h3>
            <div className="card mt-12">
              {[
                {
                  id: "acc-1",
                  title: "¿Cómo se calculan las expensas?",
                  body: "Se determinan por gastos comunes y prorrateo según coeficiente/unidad (demo).",
                },
                {
                  id: "acc-2",
                  title: "¿Qué pasa si un pago queda pendiente?",
                  body: "Se muestra como Pendiente y puede notificar al owner/council (demo).",
                },
                {
                  id: "acc-3",
                  title: "¿Cómo funcionan los roles?",
                  body: "Owner visualiza; Council gestiona; Admin configura (demo).",
                },
              ].map((a) => {
                const opened = openAcc === a.id;
                return (
                  <div key={a.id} className="accordion-item">
                    <div
                      className="accordion-header"
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenAcc((cur) => (cur === a.id ? null : a.id))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setOpenAcc((cur) => (cur === a.id ? null : a.id));
                        }
                      }}
                    >
                      <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                        <span>{a.title}</span>
                        {opened ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    {opened && <div className="accordion-content">{a.body}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================= DatePicker pattern ========================= */}
          <div className="section">
            <h3>DatePicker (patrón UI)</h3>
            <div className="card mt-12" ref={dateWrapRef}>
              <p>
                Patrón recomendado: input date + popover con quick picks (sin libs).
              </p>

              <div className="row mt-12" style={{ alignItems: "flex-end", width: "100%" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="label">Fecha seleccionada</div>
                  <input
                    type="date"
                    className="control"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                  />
                  <div className="helper">Luego lo reemplazás por un DatePicker de librería manteniendo quick picks.</div>
                </div>

                <button className="btn btn-outline" onClick={() => setDateOpen((v) => !v)}>
                  <FiCalendar /> Quick picks
                </button>
              </div>

              {dateOpen && (
                <div className="date-popover mt-12" role="dialog" aria-label="Opciones de fecha">
                  <div className="row">
                    {quickPicks.map((p) => (
                      <button
                        key={p.label}
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setDateValue(p.value);
                          setDateOpen(false);
                          pushToast(p.value ? `Fecha: ${p.value}` : "Fecha limpiada", "info");
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="divider" />
                  <p>Recomendación: mantené esta UX al migrar a una lib.</p>
                </div>
              )}
            </div>
          </div>

          {/* ========================= RESTAURADO: Form components completos ========================= */}
          <div className="section">
            <h3>Componentes de formularios</h3>

            <div className="card mt-12">
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">
                  <div className="field">
                    <div className="label">Nombre</div>
                    <input
                      className="control"
                      placeholder="Ej: Juan Pérez"
                      value={form.nombre}
                      onChange={onChange("nombre")}
                    />
                    <div className="helper">Campo de texto estándar.</div>
                  </div>

                  <div className="field">
                    <div className="label">Email</div>
                    <input
                      type="email"
                      className="control"
                      placeholder="ej@correo.com"
                      value={form.email}
                      onChange={onChange("email")}
                    />
                    <div className="helper">Validación típica de email.</div>
                  </div>

                  <div className="field">
                    <div className="label">Password</div>
                    <input
                      type="password"
                      className="control"
                      value={form.password}
                      onChange={onChange("password")}
                    />
                    <div className="helper">Input password.</div>
                  </div>

                  <div className="field">
                    <div className="label">Buscar (con ícono)</div>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <AiOutlineSearch size={16} />
                      </span>
                      <input
                        className="control has-icon"
                        placeholder="Buscar…"
                        value={form.buscar}
                        onChange={onChange("buscar")}
                      />
                    </div>
                    <div className="helper">Input con ícono (CSS puro).</div>
                  </div>

                  <div className="field">
                    <div className="label">Monto</div>
                    <input
                      type="number"
                      className="control"
                      value={form.monto}
                      onChange={onChange("monto")}
                    />
                    <div className="helper">Input number.</div>
                  </div>

                  <div className="field">
                    <div className="label">Fecha</div>
                    <input
                      type="date"
                      className="control"
                      value={form.fecha}
                      onChange={onChange("fecha")}
                    />
                    <div className="helper">Input date.</div>
                  </div>

                  <div className="field">
                    <div className="label">Rol (Select)</div>
                    <select className="control" value={form.tipo} onChange={onChange("tipo")}>
                      <option value="owner">Owner</option>
                      <option value="council">Council</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="helper">Select estándar.</div>
                  </div>

                  <div className="field">
                    <div className="label">Archivo (File)</div>

                    {/* Input nativo oculto */}
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={onChange("archivo")}
                    />

                    {/* Botón estilizado que activa el input */}
                    <label htmlFor="file-upload" className="btn btn-outline" style={{ cursor: "pointer", width: "fit-content" }}>
                      <AiOutlineUpload size={18} />
                      {form.archivo ? form.archivo.name : "Seleccionar archivo"}
                    </label>

                    <div className="helper">
                      {form.archivo ? `Archivo: ${form.archivo.name}` : "Seleccioná un archivo."}
                    </div>
                  </div>
                </div>

                <div className="field mt-12">
                  <div className="label">Mensaje (Textarea)</div>
                  <textarea
                    className="control textarea"
                    value={form.mensaje}
                    onChange={onChange("mensaje")}
                  />
                  <div className="helper">Textarea con resize vertical.</div>
                </div>

                <div className="form-grid mt-12">
                  <div className="field">
                    <div className="label">Checkbox</div>
                    <label className="option">
                      <input type="checkbox" checked={form.aceptar} onChange={onChange("aceptar")} />
                      <div>
                        <strong>Acepto términos</strong>
                        <span>Texto de apoyo para checkbox.</span>
                      </div>
                    </label>
                  </div>

                  <div className="field">
                    <div className="label">Radio</div>
                    <label className="option">
                      <input
                        type="radio"
                        name="pref"
                        value="email"
                        checked={form.preferencia === "email"}
                        onChange={onChange("preferencia")}
                      />
                      <div>
                        <strong>Notificar por Email</strong>
                        <span>Preferencia 1.</span>
                      </div>
                    </label>

                    <label className="option mt-8">
                      <input
                        type="radio"
                        name="pref"
                        value="whatsapp"
                        checked={form.preferencia === "whatsapp"}
                        onChange={onChange("preferencia")}
                      />
                      <div>
                        <strong>Notificar por WhatsApp</strong>
                        <span>Preferencia 2.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="field mt-12">
                  <div className="label">Switch</div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={form.notificaciones}
                      onChange={onChange("notificaciones")}
                    />
                    <span className="switch-track">
                      <span className="switch-thumb" />
                    </span>
                    <span style={{ color: "var(--c-text-muted)", fontSize: 13 }}>
                      Notificaciones
                    </span>
                  </label>
                  <div className="helper">Switch accesible (checkbox oculto).</div>
                </div>

                <div className="row mt-16">
                  <button className="btn btn-primary" onClick={() => pushToast("✅ Guardado OK", "success")}>
                    Guardar
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => pushToast("Borrador guardado", "info")}>
                    Guardar borrador
                  </button>
                  <button className="btn btn-outline" type="button" onClick={() => pushToast("Cancelado", "error")}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => pushToast("Eliminado (demo)", "error")}>
                    Eliminar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="section">
            <p>✅ Esta versión vuelve a mostrar el “showcase” completo de Buttons/Badges/Forms además de todo lo nuevo.</p>
          </div>
        </div>
      </main>

      {/* ========================= MODAL ========================= */}
      {modalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Modal demo">
          <div className="modal">
            <div className="modal-header">
              <h3>Modal CONSORCIA</h3>
              <button className="btn btn-icon" onClick={() => setModalOpen(false)} aria-label="Cerrar">
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Confirmación de acciones críticas (aprobación/eliminación/etc).
              </p>
              <div className="alert alert-info mt-12">
                <FiAlertTriangle style={{ marginRight: 8 }} />
                Tip: dispará un Toast al confirmar para feedback no bloqueante.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setModalOpen(false);
                  pushToast("✅ Confirmado", "success");
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}