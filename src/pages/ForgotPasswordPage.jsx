import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";

const APP_VERSION = "v1.0.0";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setStatus("error"); return; }
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <main
      className="
        min-h-screen relative overflow-hidden bg-[#0F2044]
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col
        lg:flex-row
      "
      aria-label="Página de recuperación de contraseña"
    >
      {/* Borde interno sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.06]"
      />

      {/* ══════════════════════════════
          PANEL IZQUIERDO — Branding
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
          onClick={() => navigate("/login")}
          aria-label="Volver al login"
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

        {/* Branding mobile — logo + título en fila centrada */}
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

        {/* Branding desktop — centrado en panel */}
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

        {/* Botón volver + versión — solo desktop */}
        <div className="hidden lg:flex flex-col items-center gap-2 mt-auto">
          <button
            type="button"
            onClick={() => navigate("/login")}
            aria-label="Volver al login"
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
            Volver al login
          </button>
          <p className="text-white/25 text-[11px] tracking-wide m-0">
            {APP_VERSION}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
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
        <div className="w-full lg:max-w-[400px] flex flex-col flex-1 lg:flex-none">

          {/* Encabezado del form */}
          <div className="mb-6">
            <h2 className="text-[#0F2044] font-extrabold text-[22px] leading-tight m-0">
              Recuperar contraseña
            </h2>
            <p className="text-[#4A5A7A] text-[13px] mt-2 font-light">
              Ingresá tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[#0F2044] text-[13px] font-semibold">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="tu@email.com"
                required
                className="
                  w-full rounded-xl
                  px-3 py-2.5
                  text-[#0F2044] text-[13px]
                  placeholder:text-[#4A5A7A]/50
                  outline-none
                  transition duration-150
                  focus:ring-2 focus:ring-[#0EA5A0]/40
                "
                style={{
                  background: "#ffffff",
                  border: "1px solid #C8D4EE",
                }}
                onFocus={e  => e.target.style.borderColor = "#0EA5A0"}
                onBlur={e   => e.target.style.borderColor = "#C8D4EE"}
              />
            </div>

            {/* Feedback error */}
            {status === "error" && (
              <div
                className="rounded-xl px-3 py-2.5 text-[13px]"
                role="alert"
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  border: "1px solid rgba(185,28,28,0.15)",
                }}
              >
                Ingresá un email válido.
              </div>
            )}

            {/* Feedback enviado */}
            {status === "sent" && (
              <div
                className="rounded-xl px-3 py-2.5 text-[13px]"
                role="status"
                style={{
                  background: "#d0f5f3",
                  color: "#0EA5A0",
                  border: "1px solid rgba(14,165,160,0.20)",
                }}
              >
                Si el email existe, te enviaremos instrucciones en breve.
              </div>
            )}

            {/* Botón CTA */}
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              aria-label="Enviar instrucciones de recuperación"
              className="
                group relative overflow-hidden
                w-full rounded-xl
                px-6 py-[13px]
                font-semibold text-white
                text-[13px] tracking-[0.12em]
                transition-[transform,box-shadow] duration-200 ease-out
                hover:-translate-y-px
                active:scale-[0.97]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0EA5A0]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#F0F4FF]
              "
              style={{
                background: "#1A4DB5",
                border: "1px solid rgba(26,77,181,0.35)",
                boxShadow: "0 4px 20px rgba(26,77,181,0.25)",
                touchAction: "manipulation",
              }}
              onMouseEnter={e => !["sending","sent"].includes(status) && (e.currentTarget.style.boxShadow = "0 6px 28px rgba(26,77,181,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,77,181,0.25)")}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {status === "sending" && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {status === "sending" ? "Enviando…" : "Enviar instrucciones"}
              </span>
            </button>

          </form>

          {/* Botón volver — solo mobile */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              lg:hidden
              flex items-center gap-1.5 mt-6
              text-[#4A5A7A] hover:text-[#1A4DB5]
              text-[13px] font-semibold
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#0EA5A0] rounded-sm
            "
            style={{ touchAction: "manipulation" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver al login
          </button>

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