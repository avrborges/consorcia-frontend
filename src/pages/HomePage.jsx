import React from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";

/* =====================
   Constantes
===================== */
const APP_VERSION = "v1.0.0";
const SLOGAN = "Gestión moderna para tu edificio";

export default function HomePage({ onLogin, onRegister }) {
  const navigate = useNavigate();
  return (
    <section
      role="main"
      className="
        min-h-screen relative overflow-hidden
        flex flex-col items-center justify-center
        px-6 py-10
        bg-[radial-gradient(1200px_600px_at_-10%_-10%,#1a4db5_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#0ea5a0_0%,transparent_55%),linear-gradient(135deg,#0b1530_0%,#0f2044_45%,#0a1430_100%)]
      "
    >
      {/* Textura suave */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.05),transparent_60%)]
        "
      />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-[520px] text-center flex flex-col items-center">
        {/* Logo */}
        <img
          src={logoConsorcia}
          alt="Logo de CONSORCIA"
          className="w-[96px] max-w-full mb-4 select-none"
        />

        {/* Nombre */}
        <h1
          className="
            font-extrabold text-[32px] sm:text-[34px]
            tracking-[0.4em] sm:tracking-[0.6em]
            leading-tight !text-white
          "
        >
          CONSOR
          <span className="text-amber-400">CIA</span>
        </h1>

        {/* Slogan */}
        <p
          className="
            !mt-4 !mb-6
            uppercase font-light text-[12px]
            tracking-[0.18em]
            !text-white/80
          "
        >
          {SLOGAN}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/login")}
          type="button"
          className="
            group relative overflow-hidden
            w-full max-w-sm
            rounded-xl
            bg-gradient-to-r from-sky-500 to-blue-600
            px-6 py-3
            text-white font-semibold tracking-wide
            shadow-md
            transition-all duration-300 ease-out

            hover:shadow-lg
            hover:-translate-y-[1px]

            active:scale-95
            active:shadow-sm

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-sky-400
            focus-visible:ring-offset-2
            focus-visible:ring-offset-white
          "
        >
          {/* Glow animado */}
          <span
            className="
              pointer-events-none
              absolute inset-0
              opacity-0
              group-hover:opacity-100
              transition-opacity duration-300
              bg-white/10
            "
          />

          <span className="relative z-10">
            INICIAR SESIÓN
          </span>
        </button>

        {/* Registro */}
        <p className="!mt-4 text-sm !text-white/80">
          ¿No tenés cuenta?{" "}
          <button
            onClick={onRegister}
            className="
              font-semibold text-amber-400
              hover:text-amber-300
              transition
            "
          >
            Registrate
          </button>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center !text-white/50 text-xs leading-relaxed">
        <div>by ARTHEMYSA</div>
        <div className="mt-0.5 tracking-wide">{APP_VERSION}</div>
      </footer>
    </section>
  );
}