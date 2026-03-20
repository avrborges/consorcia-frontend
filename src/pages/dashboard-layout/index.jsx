import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { getStoredUser, logout } from "../../hooks/useLogin";
import { MOCK_CONSORCIOS, MOCK_CONSORCIOS_POR_USUARIO } from "./DashboardConstants";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardDrawer from "./DashboardDrawer";
import DashboardBottomNav from "./DashboardBottomNav";
import DashboardNotifSidebar from "./DashboardNotifSidebar";

export default function DashboardLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [collapsed,     setCollapsed]     = useState(false);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [consorcioOpen, setConsorcioOpen] = useState(false);

  const storedUser = getStoredUser();
  const user = {
    name:     storedUser?.name  ?? "Usuario",
    initials: storedUser?.name  ? storedUser.name.slice(0, 2).toUpperCase() : "U",
    role:     storedUser?.role  ?? "owner",
    email:    storedUser?.email ?? "",
  };

  // Consorcios habilitados para este usuario
  const idsHabilitados    = MOCK_CONSORCIOS_POR_USUARIO[user.email] ?? [MOCK_CONSORCIOS[0].id];
  const consorciosUsuario = MOCK_CONSORCIOS.filter(c => idsHabilitados.includes(c.id));

  // Inicializador estable — evita render con consorcio incorrecto
  const [consorcioId, setConsorcioId] = useState(() => consorciosUsuario[0]?.id ?? MOCK_CONSORCIOS[0].id);

  const consorcioActual         = consorciosUsuario.find(c => c.id === consorcioId) ?? consorciosUsuario[0];
  const tieneMultipleConsorcios = consorciosUsuario.length > 1 && user.role !== "tenant";

  const isActive    = (path) => location.pathname.startsWith(path);
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex h-screen overflow-hidden bg-white font-['Raleway']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn       { from { opacity:0 }               to { opacity:1 } }
        @keyframes slideIn      { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes slideInRight { from { transform:translateX(100%) }  to { transform:translateX(0) } }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,158,160,0.25); border-radius: 4px; }
      `}</style>

      {/* Sidebar desktop */}
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        role={user.role}
        isActive={isActive}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {/* Columna principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          user={user}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(v => !v)}
          onOpenDrawer={() => setDrawerOpen(true)}
          consorcioActual={consorcioActual}
          consorciosUsuario={consorciosUsuario}
          consorcioId={consorcioId}
          tieneMultipleConsorcios={tieneMultipleConsorcios}
          consorcioOpen={consorcioOpen}
          onToggleConsorcio={setConsorcioOpen}
          onSelectConsorcio={(id) => { setConsorcioId(id); setConsorcioOpen(false); }}
          notifOpen={notifOpen}
          onToggleNotif={setNotifOpen}
        />

        <main
          className="flex-1 overflow-y-auto bg-white px-6 pt-7"
          style={{ paddingBottom: 28 }}
        >
          <style>{`@media (max-width: 1023px) { .dash-main { padding-bottom: 84px !important; } }`}</style>
          <div className="dash-main" style={{ paddingBottom: 28 }}>
            <Outlet context={{ consorcioId }} />
          </div>
        </main>
      </div>

      {/* Drawer mobile */}
      {drawerOpen && (
        <DashboardDrawer
          user={user}
          isActive={isActive}
          onNavigate={navigate}
          onLogout={handleLogout}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {/* Notif sidebar mobile */}
      {notifOpen && (
        <DashboardNotifSidebar onClose={() => setNotifOpen(false)} />
      )}

      {/* Bottom nav mobile */}
      <DashboardBottomNav isActive={isActive} onNavigate={navigate} />
    </div>
  );
}