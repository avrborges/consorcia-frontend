import React from "react";
import { FiArrowRight } from "react-icons/fi";
import logoConsorcia from "../../assets/img/consorcia.png";
import { SHAPES, FEATURES } from "./homeConstants";

/* ── SVG grid pattern (reemplaza el canvas) ── */
function GridBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
          {/* Líneas */}
          <path
            d="M 52 0 L 0 0 0 52"
            fill="none"
            stroke="rgba(91,158,160,0.07)"
            strokeWidth="0.8"
          />
          {/* Punto en la intersección */}
          <circle cx="0" cy="0" r="1.4" fill="rgba(91,158,160,0.12)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function HomeHero({ ready, onLogin, onRegister }) {
  return (
    <>
      {/* Grid SVG */}
      <GridBackground />

      {/* Radial glow blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] -top-[15%] -right-[10%] rounded-full bg-[radial-gradient(circle,rgba(42,107,110,0.18)_0%,transparent_70%)]" />
        <div className="absolute w-[500px] h-[500px] -bottom-[10%] -left-[8%] rounded-full bg-[radial-gradient(circle,rgba(249,177,122,0.10)_0%,transparent_70%)]" />
        <div className="absolute w-[300px] h-[300px] top-[40%] left-[42%] rounded-full bg-[radial-gradient(circle,rgba(91,158,160,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Floating shapes — top/left/size/delay son dinámicos, inline inevitable */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute pointer-events-none border border-[rgba(91,158,160,0.12)] ${i % 2 === 0 ? "rounded-[24px]" : "rounded-full"}`}
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            opacity: 0.3,
            animationName: i % 2 === 0 ? "floatA" : "floatB",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Hero content */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-20 flex-1">

        {/* Headline */}
        <div
          className="mb-8"
          style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
        >
          <img src={logoConsorcia} alt="Logo" className="w-20 h-20 mx-auto mb-6 select-none" />
          <h1 className="font-['Urbanist'] font-extrabold text-[clamp(36px,5vw,64px)] text-[#f0f4f8] mb-5 leading-[1.1] tracking-[0.02em]">
            Tu edificio,{" "}
            <em className="italic text-[#f9b17a] not-italic">sin papeles</em>
            <br />ni sorpresas.
          </h1>
          <p className="font-['Raleway'] font-light text-[clamp(15px,1.8vw,18px)] text-[rgba(240,244,248,0.55)] mx-auto max-w-[520px] leading-[1.7]">
            La plataforma que conecta propietarios, inquilinos y administradores en un solo lugar.
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="flex gap-3 flex-wrap justify-center mb-12"
          style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
        >
          <button
            onClick={onRegister}
            className="
              flex items-center gap-2
              px-8 py-[14px] rounded-xl
              bg-[#2a6b6e] border border-[rgba(91,158,160,0.4)]
              text-white text-[15px] font-['Raleway'] font-bold tracking-[0.04em]
              cursor-pointer touch-manipulation
              transition-all duration-[180ms]
              hover:bg-[#235b5e] hover:shadow-[0_8px_32px_rgba(42,107,110,0.45)] hover:-translate-y-px
              active:scale-[0.97]
            "
          >
            Comenzar gratis <FiArrowRight size={16} />
          </button>
          <button
            onClick={onLogin}
            className="
              px-8 py-[14px] rounded-xl
              bg-[rgba(91,158,160,0.08)] border border-[rgba(91,158,160,0.2)]
              text-[#8ecfd1] text-[15px] font-['Raleway'] font-bold tracking-[0.04em]
              cursor-pointer touch-manipulation
              transition-all duration-[180ms]
              hover:bg-[rgba(91,158,160,0.16)] hover:border-[rgba(91,158,160,0.4)] hover:-translate-y-px
              active:scale-[0.97]
            "
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Feature pills */}
        <div
          className="flex gap-2 flex-wrap justify-center max-w-[600px]"
          style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.6s 0.6s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
        >
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="
                flex items-center gap-[6px]
                px-[14px] py-[7px] rounded-full
                bg-[rgba(255,255,255,0.04)] border border-[rgba(91,158,160,0.15)]
                text-[rgba(240,244,248,0.65)] text-[12px] font-['Raleway']
                transition-all duration-[180ms]
                hover:bg-[rgba(91,158,160,0.12)] hover:border-[rgba(91,158,160,0.35)] hover:text-[#e0f2f2]
              "
              style={{
                opacity: 0,
                animation: ready ? `pillIn 0.5s ${0.65 + i * 0.07}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
              }}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </div>
          ))}
        </div>

        {/* Download badges */}
        <div
          className="flex flex-col items-center gap-3 mt-12"
          style={{ opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.6s 0.75s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}
        >
          <p className="font-['Raleway'] font-medium text-[11px] text-[rgba(240,244,248,0.3)] tracking-[0.1em] uppercase m-0">
            Disponible en
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {/* App Store */}
            <button
              type="button"
              className="
                flex items-center gap-[10px] min-w-[150px]
                px-5 py-[10px] rounded-xl
                bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)]
                cursor-pointer touch-manipulation
                transition-all duration-[180ms]
                hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.22)] hover:-translate-y-px
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(240,244,248,0.85)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="font-['Raleway'] text-[9px] text-[rgba(240,244,248,0.45)] tracking-[0.06em] leading-none mb-[2px]">DESCARGAR EN</div>
                <div className="font-['Raleway'] text-[14px] font-semibold text-[rgba(240,244,248,0.88)] leading-none">App Store</div>
              </div>
            </button>

            {/* Google Play */}
            <button
              type="button"
              className="
                flex items-center gap-[10px] min-w-[150px]
                px-5 py-[10px] rounded-xl
                bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)]
                cursor-pointer touch-manipulation
                transition-all duration-[180ms]
                hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.22)] hover:-translate-y-px
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.16.64.19.96.09L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335" />
                <path d="M20.47 10.28l-2.8-1.6-3.99 3.58 3.99 3.58 2.83-1.62c.81-.46.81-1.48-.03-1.94z" fill="#FBBC04" />
                <path d="M3.18.24C2.84.08 2.46.1 2.14.31L14.86 12 11 15.86 3.18.24z" fill="#34A853" />
                <path d="M2.14.31C1.82.52 1.6.9 1.6 1.4v21.2c0 .5.22.88.54 1.09L14.86 12 2.14.31z" fill="#4285F4" />
              </svg>
              <div className="text-left">
                <div className="font-['Raleway'] text-[9px] text-[rgba(240,244,248,0.45)] tracking-[0.06em] leading-none mb-[2px]">DISPONIBLE EN</div>
                <div className="font-['Raleway'] text-[14px] font-semibold text-[rgba(240,244,248,0.88)] leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}