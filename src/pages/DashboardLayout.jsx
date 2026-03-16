import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FiGrid, FiSettings, FiBell, FiLogOut,
  FiMenu, FiX, FiDollarSign, FiHome, FiMessageSquare, FiPieChart, FiPhone, FiFileText
} from "react-icons/fi";
import logoConsorcia from "../assets/img/consorcia.png";
import { getStoredUser, logout } from "../features/auth/hooks/useLogin";

const APP_VERSION = "v1.0.0";

/* ── Navegación desktop (sidebar) ── */
const SIDEBAR_ITEMS = [
  { id: "dashboard",     label: "Inicio",             icon: FiHome,          path: "/dashboard"     },
  { id: "expensas",      label: "Expensas",           icon: FiDollarSign,    path: "/expensas"      },
  { id: "documentos",    label: "Documentos",         icon: FiFileText,      path: "/documentos"    },
  { id: "mensajes",      label: "Mensajes",           icon: FiMessageSquare, path: "/mensajes"      },
  { id: "encuestas",     label: "Encuestas",          icon: FiPieChart,      path: "/encuestas"     },
  { id: "contactos",     label: "Contactos útiles",   icon: FiPhone,         path: "/contactos"     },
  { id: "configuracion", label: "Configuración",      icon: FiSettings,      path: "/configuracion" },
];

/* ── Navegación mobile (bottom bar) ── */
const BOTTOM_ITEMS = [
  { id: "dashboard", label: "Inicio",    icon: FiHome,          path: "/dashboard" },
  { id: "expensas",  label: "Expensas",  icon: FiDollarSign,    path: "/expensas"  },
  { id: "mensajes",  label: "Mensajes",  icon: FiMessageSquare, path: "/mensajes"  },
  { id: "encuestas", label: "Encuestas", icon: FiPieChart,      path: "/encuestas" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed,  setCollapsed]  = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const notifRef = useRef(null);

  const storedUser = getStoredUser();
  const USER = {
    name:     storedUser?.name ?? "Usuario",
    initials: storedUser?.name ? storedUser.name.slice(0, 2).toUpperCase() : "U",
    role:     storedUser?.role ?? "owner",
  };

  const handleLogout = () => { logout(); navigate("/login"); };

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

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(240,244,248,0.55);
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: background 0.15s, color 0.15s;
          white-space: nowrap; overflow: hidden; touch-action: manipulation;
        }
        .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(240,244,248,0.85); }
        .nav-item.active {
          background: rgba(91,158,160,0.14); color: #8ecfd1;
          border-left: 2px solid #5b9ea0; padding-left: 10px;
        }

        .nav-item-light {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 12px;
          font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 500;
          color: #2d3250;
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: background 0.15s, color 0.15s;
          white-space: nowrap; overflow: hidden; touch-action: manipulation;
        }
        .nav-item-light:hover { background: rgba(45,50,80,0.06); }
        .nav-item-light.active {
          background: rgba(91,158,160,0.12); color: #2a6b6e;
          border-left: 2px solid #5b9ea0; padding-left: 12px; font-weight: 600;
        }

        .logout-btn-light {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 12px;
          font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 500;
          color: rgba(45,50,80,0.45);
          cursor: pointer; border: none; background: transparent;
          width: 100%; white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s; touch-action: manipulation;
        }
        .logout-btn-light:hover { background: rgba(185,28,28,0.07); color: #b91c1c; }

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

        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #f9b17a; border: 1.5px solid #2d3250;
        }

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

        .bottom-nav {
          display: flex;
          position: fixed; bottom: 0; left: 0; right: 0;
          height: 68px;
          background: #2d3250;
          border-top: 1px solid rgba(255,255,255,0.07);
          z-index: 30;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .bottom-nav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          border: none; background: transparent;
          cursor: pointer; touch-action: manipulation;
          transition: color 0.15s; padding: 0;
          color: rgba(240,244,248,0.5);
          font-family: 'Raleway', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.03em; position: relative;
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
        .bottom-nav-item:not(.active):hover { color: rgba(240,244,248,0.75); }

        .sidebar-desktop { display: none; }
        .bottom-nav      { display: flex; }
        @media (min-width: 1024px) {
          .sidebar-desktop { display: flex; }
          .bottom-nav      { display: none; }
        }

        /* padding-bottom manejado inline en el main */

        @keyframes fadeIn       { from { opacity:0 } to { opacity:1 } }
        @keyframes slideIn      { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes slideInRight { from { transform:translateX(100%) }  to { transform:translateX(0) } }

        .notif-panel-desktop { display: none; }
        @media (min-width: 1024px) { .notif-panel-desktop { display: block; } }

        .notif-overlay-mobile, .notif-sidebar-mobile { display: flex; }
        @media (min-width: 1024px) {
          .notif-overlay-mobile, .notif-sidebar-mobile { display: none !important; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,158,160,0.25); border-radius: 4px; }
      `}</style>

      {/* ══════════ SIDEBAR desktop ══════════ */}
      <aside className="sidebar-desktop" style={{
        width: sidebarW, flexShrink: 0, flexDirection: "column",
        background: "#2d3250",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", position: "relative", zIndex: 20,
      }}>
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

        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {!collapsed && (
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>Principal</p>
          )}
          {SIDEBAR_ITEMS.filter(i => i.id !== "configuracion").map(item => (
            <button key={item.id} onClick={() => navigate(item.path)}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              title={collapsed ? item.label : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
            >
              <item.icon size={16} style={{ flexShrink:0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
          <div style={{ marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            {!collapsed && (
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(240,244,248,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 8px", padding:"0 8px" }}>Sistema</p>
            )}
            {SIDEBAR_ITEMS.filter(i => i.id === "configuracion").map(item => (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                title={collapsed ? item.label : undefined}
                style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
              >
                <item.icon size={16} style={{ flexShrink:0 }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
            <button onClick={handleLogout} className="logout-btn"
              title={collapsed ? "Cerrar sesión" : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : undefined }}
            >
              <FiLogOut size={16} style={{ flexShrink:0 }} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </nav>

        {!collapsed && (
          <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.06)", fontFamily:"'Raleway', sans-serif", fontSize:10, color:"rgba(240,244,248,0.15)", letterSpacing:"0.08em", textAlign:"center" }}>
            {APP_VERSION}
          </div>
        )}
      </aside>

      {/* ══════════ COLUMNA PRINCIPAL ══════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        <header style={{
          height: 60, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 16px", background:"#2d3250",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          zIndex:10, position:"relative",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => setDrawerOpen(true)} aria-label="Abrir menú"
              id="btn-open-drawer-mobile"
              style={{ background:"none", border:"none", padding:4, cursor:"pointer", color:"rgba(240,244,248,0.7)", touchAction:"manipulation", transition:"color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color="#f0f4f8"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(240,244,248,0.7)"}
            >
              <FiMenu size={22} />
            </button>
            <style>{`@media (min-width: 1024px) { #btn-open-drawer-mobile { display: none !important; } }`}</style>

            <button onClick={() => setCollapsed(v => !v)}
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              id="btn-collapse-desktop"
              style={{ display:"none", background:"none", border:"none", padding:4, cursor:"pointer", color:"rgba(240,244,248,0.6)", touchAction:"manipulation", transition:"color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color="#f0f4f8"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(240,244,248,0.6)"}
            >
              <FiMenu size={20} />
            </button>
            <style>{`@media (min-width: 1024px) { #btn-collapse-desktop { display: flex !important; } }`}</style>
          </div>

          <div id="header-logo-mobile" style={{ display:"flex", alignItems:"center", gap:7, position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
            <img src={logoConsorcia} alt="Logo" style={{ width:24, height:24 }} />
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:15, color:"#f0f4f8", letterSpacing:"0.12em" }}>
              CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
            </span>
          </div>
          <style>{`@media (min-width: 1024px) { #header-logo-mobile { display: none !important; } }`}</style>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div id="header-user" style={{ display:"none", alignItems:"center", gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background:"linear-gradient(135deg, #2a6b6e, #5b9ea0)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0,
              }}>{USER.initials}</div>
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:500, color:"rgba(240,244,248,0.75)", whiteSpace:"nowrap" }}>{USER.name}</span>
            </div>
            <style>{`@media (min-width: 1024px) { #header-user { display: flex !important; } }`}</style>

            <div style={{ position:"relative" }} ref={notifRef}>
              <button onClick={() => setNotifOpen(v => !v)} aria-label="Notificaciones"
                style={{ background:"none", border:"none", padding:6, cursor:"pointer", color:"rgba(240,244,248,0.7)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", touchAction:"manipulation", transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color="#f0f4f8"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(240,244,248,0.7)"}
              >
                <FiBell size={22} />
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div className="notif-panel notif-panel-desktop">
                  <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid rgba(176,207,208,0.3)" }}>
                    <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", margin:0 }}>Notificaciones</p>
                  </div>
                  {[
                    { title:"Expensa cargada",  desc:"Mayo 2025 disponible",   time:"hace 2h", dot:"#5b9ea0" },
                    { title:"Nuevo reclamo",    desc:"Unidad 4B — Filtración", time:"hace 5h", dot:"#f9b17a" },
                    { title:"Votación activa",  desc:"Pintura pasillo",         time:"ayer",    dot:"#5b9ea0" },
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
          </div>
        </header>

        <main className="main-content" style={{ flex:1, overflowY:"auto", background:"#ffffff", paddingTop:"28px", paddingLeft:"24px", paddingRight:"24px", paddingBottom:"28px" }}>
          <style>{`.main-content { padding-bottom: 28px; } @media (max-width: 1023px) { .main-content { padding-bottom: 84px !important; } }`}</style>
          <Outlet />
        </main>
      </div>

      {/* ══════════ NOTIF SIDEBAR mobile ══════════ */}
      {notifOpen && (
        <>
          <div onClick={() => setNotifOpen(false)} className="notif-overlay-mobile"
            style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(26,31,62,0.55)", backdropFilter:"blur(2px)", animation:"fadeIn 0.2s ease" }}
          />
          <aside className="notif-sidebar-mobile" style={{
            position:"fixed", top:0, right:0, bottom:0, zIndex:50,
            width:"100%", background:"#ffffff", display:"flex", flexDirection:"column",
            animation:"slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)",
            boxShadow:"-4px 0 24px rgba(45,50,80,0.12)",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 16px", background:"#2d3250", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <FiBell size={16} color="#8ecfd1" />
                <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:15, fontWeight:700, color:"#f0f4f8", margin:0 }}>Notificaciones</p>
              </div>
              <button onClick={() => setNotifOpen(false)} aria-label="Cerrar notificaciones"
                style={{ background:"none", border:"none", padding:6, cursor:"pointer", color:"rgba(240,244,248,0.5)", display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation", transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color="#f0f4f8"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(240,244,248,0.5)"}
              >
                <FiX size={22} />
              </button>
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {[
                { title:"Expensa cargada",  desc:"Mayo 2025 disponible",   time:"hace 2h", dot:"#5b9ea0" },
                { title:"Nuevo reclamo",    desc:"Unidad 4B — Filtración", time:"hace 5h", dot:"#f9b17a" },
                { title:"Votación activa",  desc:"Pintura pasillo",         time:"ayer",    dot:"#5b9ea0" },
              ].map((n, i) => (
                <div key={i} className="notif-item" style={{ padding:"16px" }}>
                  <span style={{ width:9, height:9, borderRadius:"50%", background:n.dot, flexShrink:0, marginTop:4 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:14, fontWeight:600, color:"#2d3250", margin:"0 0 3px" }}>{n.title}</p>
                    <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:0 }}>{n.desc}</p>
                  </div>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"rgba(91,122,138,0.55)", margin:0, flexShrink:0 }}>{n.time}</p>
                </div>
              ))}
            </div>
            <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(176,207,208,0.3)" }}>
              <button style={{ background:"none", border:"none", fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:600, color:"#2a6b6e", cursor:"pointer", padding:0, touchAction:"manipulation", width:"100%", textAlign:"center" }}
                onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
                onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
              >Ver todas →</button>
            </div>
          </aside>
        </>
      )}

      {/* ══════════ DRAWER mobile ══════════ */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(26,31,62,0.55)", backdropFilter:"blur(2px)", animation:"fadeIn 0.2s ease" }}
          />
          <aside style={{
            position:"fixed", top:0, left:0, bottom:0, zIndex:50,
            width:"100%", background:"#edf2f4", borderRight:"none",
            display:"flex", flexDirection:"column",
            animation:"slideIn 0.22s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <button
              onClick={() => { navigate("/perfil"); setDrawerOpen(false); }}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"#2d3250", border:"none", width:"100%", cursor:"pointer", touchAction:"manipulation", transition:"background 0.15s", textAlign:"left" }}
              onMouseEnter={e => e.currentTarget.style.background="#3a4060"}
              onMouseLeave={e => e.currentTarget.style.background="#2d3250"}
              aria-label="Ir a Mi Perfil"
            >
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg, #2a6b6e, #5b9ea0)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Raleway', sans-serif", fontSize:16, fontWeight:700, color:"#fff", flexShrink:0, boxShadow:"0 4px 14px rgba(42,107,110,0.35)" }}>
                  {USER.initials}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:15, fontWeight:700, color:"#f0f4f8", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{USER.name}</p>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:400, color:"rgba(240,244,248,0.4)", margin:"2px 0 0", textTransform:"capitalize", letterSpacing:"0.03em" }}>{USER.role}</p>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#8ecfd1", margin:"4px 0 0", letterSpacing:"0.01em" }}>Mi Perfil &rsaquo;</p>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setDrawerOpen(false); }}
                aria-label="Cerrar menú"
                style={{ background:"none", border:"none", padding:6, cursor:"pointer", color:"rgba(240,244,248,0.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, touchAction:"manipulation", transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color="#f0f4f8"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(240,244,248,0.5)"}
              >
                <FiX size={22} />
              </button>
            </button>

            <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(45,50,80,0.3)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 10px", padding:"0 8px" }}>Principal</p>
              {SIDEBAR_ITEMS.filter(i => i.id !== "configuracion").map(item => (
                <button key={item.id} onClick={() => { navigate(item.path); setDrawerOpen(false); }} className={`nav-item-light ${isActive(item.path) ? "active" : ""}`}>
                  <item.icon size={20} style={{ flexShrink:0 }} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div style={{ marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(45,50,80,0.08)" }}>
                <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"rgba(45,50,80,0.3)", letterSpacing:"0.12em", textTransform:"uppercase", margin:"4px 4px 10px", padding:"0 8px" }}>Sistema</p>
                {SIDEBAR_ITEMS.filter(i => i.id === "configuracion").map(item => (
                  <button key={item.id} onClick={() => { navigate(item.path); setDrawerOpen(false); }} className={`nav-item-light ${isActive(item.path) ? "active" : ""}`}>
                    <item.icon size={20} style={{ flexShrink:0 }} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button onClick={handleLogout} className="logout-btn-light">
                  <FiLogOut size={20} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* ══════════ BOTTOM NAV mobile ══════════ */}
      <nav className="bottom-nav" aria-label="Navegación principal">
        {BOTTOM_ITEMS.map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            className={`bottom-nav-item ${isActive(item.path) ? "active" : ""}`}
            aria-label={item.label}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}