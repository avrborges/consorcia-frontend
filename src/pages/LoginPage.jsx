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
      className="
        min-h-screen relative overflow-hidden bg-[#0F2044]
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col
        lg:flex-row
      "
      aria-label="Página de inicio de sesión"
    >
      {/* Borde interno sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.06]"
      />

      {/* ══════════════════════════════
          PANEL IZQUIERDO — Branding
          Mobile: header compacto centrado
          Desktop: panel fijo 42%
      ══════════════════════════════ */}
      <div
        className="
          relative z-10 flex flex-col
          px-6 pt-6 pb-8
          lg:w-[42%] lg:min-h-screen
          lg:items-center lg:justify-center
          lg:px-12 lg:py-12
        "
      >
        {/* Botón volver — solo mobile */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio"
          className="
            w-9 h-9 rounded-xl self-start
            flex items-center justify-center
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-[#0EA5A0]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#0F2044]
            lg:hidden
          "
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

        {/* ── Branding mobile: logo + título en fila centrada ── */}
        <div className="flex items-center justify-center gap-3 mt-6 lg:hidden">
          <img
            src={logoConsorcia}
            alt="Logo CONSORCIA"
            className="w-12 h-12 select-none flex-shrink-0"
          />
          <h1 className="text-white font-extrabold text-[26px] tracking-[0.3em] leading-tight m-0">
            CONSOR<span className="text-[#F5A623]">CIA</span>
          </h1>
        </div>

        {/* Divisor + slogan — centrados debajo */}
        <div className="flex flex-col items-center gap-2 mt-3 lg:hidden">
          <div
            aria-hidden="true"
            className="w-10 h-0.5 rounded-sm"
            style={{ background: "linear-gradient(90deg, #1A4DB5, #0EA5A0)" }}
          />
          <p className="text-white/50 text-[11px] font-light tracking-[0.18em] uppercase text-center m-0">
            Gestión moderna para tu edificio
          </p>
        </div>

        {/* ── Branding desktop: centrado en panel ── */}
        <div className="hidden lg:flex flex-col items-center text-center gap-6">
          <img
            src={logoConsorcia}
            alt="Logo CONSORCIA"
            className="w-24 h-24 select-none"
          />
          <h1 className="text-white font-extrabold text-[32px] tracking-[0.3em] leading-tight m-0 text-center">
            CONSOR<span className="text-[#F5A623]">CIA</span>
          </h1>
          <div
            aria-hidden="true"
            className="w-12 h-0.5 rounded-sm"
            style={{ background: "linear-gradient(90deg, #1A4DB5, #0EA5A0)" }}
          />
          <p className="text-white/50 text-[13px] font-light tracking-wide text-center max-w-[220px] m-0">
            Gestión moderna para tu edificio
          </p>
        </div>

        {/* Botón volver + versión — solo desktop, pegados al fondo */}
        <div className="hidden lg:flex flex-col items-center gap-2 mt-auto">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Volver al inicio"
            className="
              flex items-center gap-2
              text-white/50 hover:text-white
              text-[13px] transition-colors duration-150
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#0EA5A0] rounded-sm
            "
            style={{ touchAction: "manipulation" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver al inicio
          </button>
          <p className="text-white/25 text-[11px] tracking-wide m-0">
            {APP_VERSION}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
          Mobile: card pegada abajo
          Desktop: panel fijo 58%
      ══════════════════════════════ */}
      <div
        className="
          relative z-10 flex-1 flex flex-col
          px-6 pt-6 pb-8
          rounded-t-[28px]
          lg:rounded-none
          lg:w-[58%] lg:min-h-screen
          lg:items-center lg:justify-center
          lg:px-16 lg:py-12
        "
        style={{ background: "#F0F4FF" }}
      >
        {/* Contenedor del form — limita ancho en desktop */}
        <div className="w-full lg:max-w-[400px] flex flex-col flex-1 lg:flex-none">

          {/* Saludo — solo desktop */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[#0F2044] font-extrabold text-[26px] leading-tight m-0">
              ¡Bienvenido<br />de nuevo!
            </h2>
            <p className="text-[#4A5A7A] text-[13px] mt-2 font-light">
              Ingresá tus datos para acceder a tu cuenta.
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "rgba(15,32,68,0.08)" }}
            role="tablist"
          >
            {[
              { id: "login",    label: "Ingresar"    },
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
                  background:  activeTab === tab.id ? "#ffffff" : "transparent",
                  color:       activeTab === tab.id ? "#0F2044" : "rgba(15,32,68,0.45)",
                  boxShadow:   activeTab === tab.id ? "0 1px 4px rgba(15,32,68,0.10)" : "none",
                  touchAction: "manipulation",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido según tab */}
          <div className="flex-1 lg:flex-none">
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

          {/* Footer — solo mobile */}
          <footer className="lg:hidden text-center mt-6 text-[11px] text-[#4A5A7A]/60 tracking-[0.04em]">
            by ARTHEMYSA
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#0EA5A0]/70 mx-1.5 align-middle"
            />
            {APP_VERSION}
          </footer>
        </div>
      </div>
    </main>
  );
}