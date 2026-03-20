import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated } from "../../hooks/useLogin";
import LoginBranding from "./LoginBranding";
import LoginPanel from "./LoginPanel";

export default function LoginPage({ onRegister }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Redirige al dashboard si ya hay sesión activa
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const handleTabSelect = (id) => {
    setActiveTab(id);
    if (id === "register") onRegister?.();
  };

  return (
    <main
      className="
        min-h-screen relative overflow-hidden
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col lg:flex-row
      "
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
      aria-label="Página de inicio de sesión"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(7deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(16px) rotate(-5deg); } }
      `}</style>

      {/* Glow blobs globales */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-[10%] -right-[5%] rounded-full bg-[radial-gradient(circle,rgba(42,107,110,0.15)_0%,transparent_70%)]" />
        <div className="absolute w-[400px] h-[400px] -bottom-[8%] -left-[6%] rounded-full bg-[radial-gradient(circle,rgba(249,177,122,0.08)_0%,transparent_70%)]" />
      </div>

      <LoginBranding onBack={() => navigate("/")} />

      <LoginPanel
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        onLoginSuccess={() => navigate("/dashboard")}
        onForgotPassword={() => navigate("/forgot-password")}
      />
    </main>
  );
}