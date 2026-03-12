import React from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";

const APP_VERSION = "v1.0.0";
const SLOGAN = "Gestión moderna para tu edificio";

export default function HomePage({ onLogin, onRegister }) {
  const navigate = useNavigate();

  return (
    <section
      role="main"
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 bg-[#0F2044]"
    >
      {/* Borde interno sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.06]"
      />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-[480px] text-center flex flex-col items-center">

        {/* Brand mark */}
        {/* Logo */}
         <img
           src={logoConsorcia}
           alt="Logo de CONSORCIA"
           className="w-[86px] max-w-full mb-4 select-none"
         />

        {/* Título */}
        <h1 className="font-extrabold text-[30px] tracking-[0.45em] leading-[1.1] text-white m-0">
          CONSOR<span className="text-[#F5A623]">CIA</span>
        </h1>

        {/* Divisor */}
        <div
          aria-hidden="true"
          className="w-9 h-0.5 rounded-sm mx-auto my-3.5"
          style={{ background: "linear-gradient(90deg, #1A4DB5, #0EA5A0)" }}
        />

        {/* Slogan */}
        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white/50 mb-8 mt-0">
          {SLOGAN}
        </p>

        {/* Botón CTA */}
        <button
          type="button"
          onClick={onLogin ?? (() => navigate("/login"))}
          aria-label="Iniciar sesión en CONSORCIA"
          className="
            group relative overflow-hidden
            w-full max-w-[320px]
            rounded-xl px-6 py-[13px]
            text-white font-semibold text-[13px] tracking-[0.12em]
            transition-[transform,box-shadow] duration-200 ease-out
            hover:-translate-y-px
            active:scale-[0.97]
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#0EA5A0]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#0F2044]
            touch-action-manipulation
          "
          style={{
            background: "var(--brand-gradient)",
            border: "1px solid rgba(14, 165, 160, 0.35)",  // Teal sutil
            touchAction: "manipulation",   // elimina delay 300ms en iOS
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"
          />
          <span className="relative z-10">INICIAR SESIÓN</span>
        </button>

        {/* Registro */}
        <p className="mt-4 flex text-[13px] gap-1 text-white/55">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            onClick={onRegister}
            aria-label="Crear una cuenta nueva"
            className="
              font-semibold
              text-[#F5A623] hover:text-[#f7b84b]
              transition-colors duration-150
              bg-transparent border-none
              cursor-pointer p-0
              text-[13px]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#0EA5A0]
              focus-visible:ring-offset-1
              focus-visible:ring-offset-[#0F2044]
              rounded-sm
            "
            style={{ touchAction: "manipulation" }}
          >
            Registrate
          </button>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-[11px] text-white/25 tracking-[0.04em]">
        by ARTHEMYSA
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#0EA5A0]/70 mx-1.5 align-middle"
        />
        {APP_VERSION}
      </footer>
    </section>
  );
}