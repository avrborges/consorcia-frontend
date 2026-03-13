import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FiGrid, FiSettings, FiBell, FiLogOut,
  FiMenu, FiX, FiDollarSign, FiArrowRight 
} from "react-icons/fi";
import logoConsorcia from "../assets/img/consorcia.png";
import { getStoredUser, logout } from "../features/auth/hooks/useLogin";

const APP_VERSION = "v1.0.0";

/* ── Navegación desktop (sidebar) ── */
const SIDEBAR_ITEMS = [
  { id: "dashboard",     label: "Dashboard",    icon: FiGrid,        path: "/dashboard"     },
  { id: "expensas",      label: "Expensas",     icon: FiDollarSign,  path: "/expensas"      },
  { id: "configuracion", label: "Configuración", icon: FiSettings,    path: "/configuracion" },
];

/* ── Navegación mobile (bottom bar) ── */
const BOTTOM_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid,       path: "/dashboard" },
  { id: "expensas",  label: "Expensas",  icon: FiDollarSign, path: "/expensas"  },
  { id: "menu",      label: "Menú",      icon: FiMenu,       path: null         },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed,   setCollapsed]   = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const notifRef = useRef(null);

  /* Datos de sesión reales */
  const storedUser = getStoredUser();
  const USER = {
    name:     storedUser?.name ?? "Usuario",
    initials: storedUser?.name ? storedUser.name.slice(0, 2).toUpperCase() : "U",
    role:     storedUser?.role ?? "owner",
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  /* Cierra notif al hacer click fuera */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);
  const sidebarW = collapsed ? 64 : 220;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#ffffff", fontFamily:"'Raleway', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        /* ── Sidebar nav items ── */
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(240,244,248,0.55);
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: background 0.15s, color 0.15s;
          white-space: nowrap; overflow: hidden;
          touch-action: manipulation;
        }
        .nav-item:hover  { background: rgba(255,255,255,0.07); color: rgba(240,244,248,0.85); }
        .nav-item.active {
          background: rgba(91,158,160,0.14); color: #8ecfd1;
          border-left: 2px solid #5b9ea0; padding-left: 10px;
        }

        /* ── Header buttons ── */
        .header-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(240,244,248,0.6);
          cursor: pointer; touch-action: manipulation;
          transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .header-btn:hover { background: rgba(255,255,255,0.12); color: #f0f4f8; }

        /* ── Logout sidebar ── */
        .logout-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 12px; border-radius: 10px;
          font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(240,244,248,0.3);
          cursor: pointer; border: none; background: transparent;
          width: 100%; white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s; touch-action: manipulation;
        }
        .logout-btn:hover { background: rgba(185,28,28,0.1); color: #fca5a5; }

        /* ── Notif dot ── */
        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #f9b17a; border: 1.5px solid #2d3250;
        }

        /* ── Notif panel ── */
        .notif-panel {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 300px; border-radius: 14px;
          background: #ffffff; border: 1px solid #b0cfd0;
          box-shadow: 0 8px 32px rgba(45,50,80,0.12);
          z-index: 100; animation: fadeIn 0.15s ease; overflow: hidden;
        }
        .notif-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(176,207,208,0.3);
          transition: background 0.12s; cursor: pointer;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #f0f4f8; }

        /* ── Bottom nav (mobile) ── */
        .bottom-nav {
          display: flex;
          position: fixed; bottom: 0; left: 0; right: 0;
          height: 62px;
          background: #2d3250;
          border-top: 1px solid rgba(255,255,255,0.07);
          z-index: 30;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .bottom-nav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          border: none; background: transparent;
          cursor: pointer; touch-action: manipulation;
          transition: color 0.15s; padding: 0;
          color: rgba(240,244,248,0.35);
          font-family: 'Raleway', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.03em;
          position: relative;
        }
        .bottom-nav-item.active { color: #8ecfd1; }
        .bottom-nav-item.active::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 28px; height: 2px;
          border-radius: 0 0 3px 3px;
          background: #5b9ea0;
        }
        .bottom-nav-item:not(.active):hover { color: rgba(240,244,248,0.65); }

        /* ── Responsive: sidebar solo desktop, bottom nav solo mobile ── */
        .sidebar-desktop { display: none; }
        .bottom-nav      { display: flex; }
        @media (min-width: 1024px) {
          .sidebar-desktop { display: flex; }
          .bottom-nav      { display: none; }
        }

        /* ── Padding inferior del contenido en mobile para no quedar bajo la bottom nav ── */
        .main-content { padding-bottom: 28px; }
        @media (max-width: 1023px) {
          .main-content { padding-bottom: 78px; }
        }

        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideIn { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,158,160,0.25); border-radius: 4px; }
      `}</style>

      {/* ══════════════════════════════════════
          SIDEBAR — desktop only
      ══════════════════════════════════════ */}
      <aside
        className="sidebar-desktop"
        style={{
          width: sidebarW, flexShrink: 0, flexDirection: "column",
          background: "#2d3250",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden", position: "relative", zIndex: 20,
        }}
      >
        {/* Logo */}
        <div style={{
          display:"flex", alignItems:"center",
          gap: collapsed ? 0 : 10,
          padding: collapsed ? "20px 0" : "20px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          minHeight: 64, flexShrink: 0,
          transition: "padding 0.22s, gap 0.22s",
        }}>
          <img src={logoConsorcia} alt="Logo" style={{ width:30, height:30, flexShrink:0 }} />
          {!collapsed && (
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:16, color:"#f0f4f8", letterSpacing:"0.15em", whiteSpace:"nowrap" }}>
              CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
            </span>
          )}
        </div>

        {/* Nav principal */}
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {!collapsed && (
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>
              Principal
            </p>
          )}
          {SIDEBAR_ITEMS.filter(i => i.id !== "configuracion").map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              title={collapsed ? item.label : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
            >
              <item.icon size={16} style={{ flexShrink:0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}

          {/* Sistema */}
          <div style={{ marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            {!collapsed && (
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>
                Sistema
              </p>
            )}
            {SIDEBAR_ITEMS.filter(i => i.id === "configuracion").map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                title={collapsed ? item.label : undefined}
                style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
              >
                <item.icon size={16} style={{ flexShrink:0 }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="logout-btn"
              title={collapsed ? "Cerrar sesión" : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
            >
              <FiLogOut size={16} style={{ flexShrink:0 }} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </nav>

        {/* Versión */}
        {!collapsed && (
          <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.06)", fontFamily:"'Raleway', sans-serif", fontSize:10, color:"rgba(240,244,248,0.15)", letterSpacing:"0.08em", textAlign:"center" }}>
            {APP_VERSION}
          </div>
        )}
      </aside>

      {/* ══════════════════════════════════════
          COLUMNA PRINCIPAL
      ══════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* ── HEADER ── */}
        <header style={{
          height: 60, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 16px",
          background:"#2d3250",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          zIndex:10,
        }}>

          {/* Izquierda: hamburguesa desktop + logo mobile + nombre edificio */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>

            {/* Hamburguesa — solo desktop */}
            <button
              onClick={() => setCollapsed(v => !v)}
              className="header-btn"
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              style={{ display:"none" }}
              id="btn-collapse-desktop"
            >
              <FiMenu size={17} />
            </button>
            <style>{`
              @media (min-width: 1024px) { #btn-collapse-desktop { display: flex !important; } }
            `}</style>

            {/* Logo — solo mobile */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }} id="header-logo-mobile">
              <img src={logoConsorcia} alt="Logo" style={{ width:26, height:26 }} />
              <span style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:15, color:"#f0f4f8", letterSpacing:"0.12em" }}>
                CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
              </span>
            </div>
            <style>{`
              @media (min-width: 1024px) { #header-logo-mobile { display: none !important; } }
            `}</style>

          </div>

          {/* Derecha: notif + avatar + logout */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>

            {/* Notificaciones */}
            <div style={{ position:"relative" }} ref={notifRef}>
              <button className="header-btn" onClick={() => setNotifOpen(v => !v)} aria-label="Notificaciones">
                <FiBell size={16} />
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid rgba(176,207,208,0.3)" }}>
                    <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", margin:0 }}>Notificaciones</p>
                  </div>
                  {[
                    { title:"Expensa cargada",  desc:"Mayo 2025 disponible",    time:"hace 2h", dot:"#5b9ea0" },
                    { title:"Nuevo reclamo",    desc:"Unidad 4B — Filtración",  time:"hace 5h", dot:"#f9b17a" },
                    { title:"Votación activa",  desc:"Pintura pasillo",          time:"ayer",    dot:"#5b9ea0" },
                  ].map((n, i) => (
                    <div key={i} className="notif-item">
                      <span style={{ width:8, height:8, borderRadius:"50%", background:n.dot, flexShrink:0, marginTop:5 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.title}</p>
                        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.desc}</p>
                      </div>
                      <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"rgba(91,122,138,0.55)", margin:0, flexShrink:0 }}>{n.time}</p>
                    </div>
                  ))}
                  <div style={{ padding:"10px 16px" }}>
                    <button style={{ background:"none", border:"none", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2a6b6e", cursor:"pointer", padding:0, touchAction:"manipulation" }}
                      onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
                      onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
                    >Ver todas →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar + nombre */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 8px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background:"linear-gradient(135deg, #2a6b6e, #5b9ea0)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0,
              }}>
                {USER.initials}
              </div>
              <span id="header-username" style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:500, color:"rgba(240,244,248,0.75)", whiteSpace:"nowrap", display:"none" }}>
                {USER.name}
              </span>
              <style>{`
                @media (min-width: 1024px) { #header-username { display: inline !important; } }
              `}</style>
            </div>

            {/* Logout — solo desktop */}
            <button
              onClick={handleLogout}
              className="header-btn"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              id="btn-logout-desktop"
              style={{ display:"none" }}
            >
              <FiLogOut size={16} />
            </button>
            <style>{`
              @media (min-width: 1024px) { #btn-logout-desktop { display: flex !important; } }
            `}</style>

          </div>
        </header>

        {/* ── ÁREA DE CONTENIDO ── */}
        <main className="main-content" style={{ flex:1, overflowY:"auto", background:"#ffffff", padding:"28px 24px" }}>
          <Outlet />
        </main>

      </div>

      {/* ══════════════════════════════════════
          DRAWER — mobile only
      ══════════════════════════════════════ */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position:"fixed", inset:0, zIndex:40,
              background:"rgba(26,31,62,0.55)",
              backdropFilter:"blur(2px)",
              animation:"fadeIn 0.2s ease",
            }}
          />
          <aside style={{
            position:"fixed", top:0, left:0, bottom:0, zIndex:50,
            width:"100%", background:"#2d3250",
            borderRight:"none",
            display:"flex", flexDirection:"column",
            animation:"slideIn 0.22s cubic-bezier(0.4,0,0.2,1)",
          }}>
            {/* Header — bloque perfil cliqueable */}
            <button
              onClick={() => { navigate("/perfil"); setDrawerOpen(false); }}
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"24px 16px 20px",
                borderBottom:"1px solid rgba(255,255,255,0.06)",
                background:"rgba(255,255,255,0.03)",
                border:"none", width:"100%", cursor:"pointer",
                touchAction:"manipulation",
                transition:"background 0.15s",
                textAlign:"left",
              }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
              aria-label="Ir a Mi Perfil"
            >
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                {/* Avatar */}
                <div style={{
                  width:48, height:48, borderRadius:"50%",
                  background:"linear-gradient(135deg, #2a6b6e, #5b9ea0)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Raleway', sans-serif", fontSize:16, fontWeight:700,
                  color:"#fff", flexShrink:0,
                  boxShadow:"0 4px 14px rgba(42,107,110,0.35)",
                }}>
                  {USER.initials}
                </div>
                {/* Nombre + rol + Mi Perfil */}
                <div style={{ minWidth:0 }}>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:15, fontWeight:700, color:"#f0f4f8", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {USER.name}
                  </p>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:400, color:"rgba(240,244,248,0.4)", margin:"2px 0 0", textTransform:"capitalize", letterSpacing:"0.03em" }}>
                    {USER.role}
                  </p>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#8ecfd1", margin:"4px 0 0", letterSpacing:"0.01em", display:"inline-flex", alignItems:"center" }}>
                    Mi Perfil <FiArrowRight size={12} style={{ marginLeft:4, verticalAlign:"middle" }} />
                  </p>
                </div>
              </div>
              {/* Botón cerrar — detiene propagación */}
              <button
                onClick={e => { e.stopPropagation(); setDrawerOpen(false); }}
                className="header-btn"
                aria-label="Cerrar menú"
                style={{ flexShrink:0 }}
              >
                <FiX size={16} />
              </button>
            </button>
            <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>Principal</p>
              {SIDEBAR_ITEMS.filter(i => i.id !== "configuracion").map(item => (
                <button key={item.id} onClick={() => { navigate(item.path); setDrawerOpen(false); }} className={`nav-item ${isActive(item.path) ? "active" : ""}`}>
                  <item.icon size={16} style={{ flexShrink:0 }} />
                  <span>{item.label}</span>
                </button>
              ))}

              <div style={{ marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>Sistema</p>
                {SIDEBAR_ITEMS.filter(i => i.id === "configuracion").map(item => (
                  <button key={item.id} onClick={() => { navigate(item.path); setDrawerOpen(false); }} className={`nav-item ${isActive(item.path) ? "active" : ""}`}>
                    <item.icon size={16} style={{ flexShrink:0 }} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button onClick={handleLogout} className="logout-btn">
                  <FiLogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* ══════════════════════════════════════
          BOTTOM NAV — mobile only
      ══════════════════════════════════════ */}
      <nav className="bottom-nav" aria-label="Navegación principal">
        {BOTTOM_ITEMS.map(item => {
          const isMenu = item.id === "menu";
          const active = !isMenu && isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => isMenu ? setDrawerOpen(true) : navigate(item.path)}
              className={`bottom-nav-item ${active ? "active" : ""}`}
              aria-label={item.label}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}