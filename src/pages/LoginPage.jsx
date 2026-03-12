import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";
import LoginForm from "../features/auth/components/LoginForm";

const APP_VERSION = "v1.0.0";

export default function LoginPage({ onRegister }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col bg-[#0F2044] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Página de inicio de sesión"
    >
      {/* Borde interno sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.06]"
      />

      {/* ── Header ── */}
      <div className="relative z-10 px-6 pt-6 pb-8">

        {/* Botón volver */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2044]"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
            touchAction: "manipulation",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Título */}
        <div className="mt-6 flex items-center gap-4">

          {/* Logo */}
          <img
            src={logoConsorcia}
            alt="Logo CONSORCIA"
            className="w-12 h-12 select-none flex-shrink-0"
          />

          <div>
            <h1 className="text-white font-extrabold text-[26px] leading-tight tracking-tight m-0">
              Bienvenido<br />
              a <span className="text-[#F5A623]">CONSORCIA</span>
            </h1>
            <p className="text-white/50 text-[12px] mt-1 font-light tracking-wide">
              Ingresá tus datos para acceder a tu cuenta.
            </p>
          </div>
        </div>
      </div>

      {/* ── Card ── */}
      <div
        className="relative z-10 flex-1 rounded-t-[28px] px-6 pt-6 pb-8 flex flex-col"
        style={{ background: "#F0F4FF", minHeight: "60vh" }}
      >
        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: "rgba(15,32,68,0.08)" }}
          role="tablist"
        >
          {[
            { id: "login", label: "Ingresar" },
            { id: "register", label: "Registrarse" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "register") onRegister?.();
              }}
              className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 focus:outline-none"
              style={{
                background: activeTab === tab.id ? "#ffffff" : "transparent",
                color: activeTab === tab.id ? "#0F2044" : "rgba(15,32,68,0.45)",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(15,32,68,0.10)" : "none",
                touchAction: "manipulation",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido según tab */}
        <div className="flex-1">
          {activeTab === "login" ? (
            <LoginForm
              onSuccess={() => navigate("/dashboard")}
              onBackHome={() => navigate("/")}
              onForgotPassword={() => navigate("/forgot-password")}
              onRegister={() => navigate("/register")}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-[#4A5A7A] text-[13px]">
                El registro estará disponible próximamente.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="mt-4 text-[13px] font-semibold text-[#1A4DB5] hover:text-[#0EA5A0] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A0] rounded-sm"
                style={{ touchAction: "manipulation" }}
              >
                Volver al login
              </button>
            </div>
          )}
        </div>

        {/* TODO: separador "O ingresar con" + botones Google/Facebook */}

        {/* Footer */}
        <footer className="text-center mt-6 text-[11px] text-[#4A5A7A]/60 tracking-[0.04em]">
          by ARTHEMYSA
          <span
            aria-hidden="true"
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#0EA5A0]/70 mx-1.5 align-middle"
          />
          {APP_VERSION}
        </footer>
      </div>
    </main>
  );
}