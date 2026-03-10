import React from "react";
import logoConsorcia from "../assets/img/consorcia.png";

export default function HomePage({ onLogin, onRegister }) {
  return (
    <section
      className="
        min-h-screen relative overflow-hidden
        grid place-items-center p-6
        bg-[radial-gradient(1200px_600px_at_-10%_-10%,#1a4db5_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#0ea5a0_0%,transparent_55%),linear-gradient(135deg,#0b1530_0%,#0f2044_45%,#0a1430_100%)]
      "
    >
      {/* Textura suave */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.05),transparent_60%)]"
      />

      <div className="relative z-10 w-full max-w-[520px] text-center flex flex-col items-center">
        {/* Logo */}
        <img
          src={logoConsorcia}
          alt="CONSORCIA"
          className="w-[100px] max-w-full mb-4"
        />

        {/* Nombre */}
        <h1
          className="
            flex items-center justify-center
            font-extrabold text-[34px]
            tracking-[10px] leading-tight
            !text-white
          "
        >
          CONSOR
          <span className="text-amber-400">CIA</span>
        </h1>

        {/* Slogan */}
        <p
          className="
            !mt-2 mb-4
            uppercase font-light text-[12px]
            tracking-[0.2em]
            !text-white/80
          "
        >
          Gestión moderna para tu edificio
        </p>

        {/* CTA */}
        <button
          onClick={onLogin}
          className="
            min-w-[220px] mt-10
            px-6 py-3 rounded-xl font-semibold
            bg-[#3B82F6] text-white
            shadow-[0_10px_30px_rgba(0,0,0,0.25)]
            hover:opacity-90 active:opacity-95
            transition
            focus:outline-none
            focus:ring-4 focus:ring-[rgba(14,165,160,0.35)]
          "
        >
          INICIAR SESIÓN
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

      <div className="absolute bottom-4 text-center text-white/50 text-xs leading-relaxed">
        <div>by ARTHEMYSA</div>
        <div className="mt-0.5 tracking-wide">v1.0.0</div>
      </div>

    </section>
  );
}
``