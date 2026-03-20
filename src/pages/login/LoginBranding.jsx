import React, { useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import logoConsorcia from "../../assets/img/consorcia.png";
import { SHAPES, APP_VERSION } from "./LoginConstants";

export default function LoginBranding({ onBack }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      const STEP = 52;
      ctx.strokeStyle = "rgba(91,158,160,0.07)"; ctx.lineWidth = 0.8;
      for (let x = 0; x <= W; x += STEP) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += STEP) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = "rgba(91,158,160,0.12)";
      for (let x = 0; x <= W; x += STEP)
        for (let y = 0; y <= H; y += STEP) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill(); }
    };
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="
        relative z-10 flex flex-col overflow-hidden
        px-6 pt-6 pb-8
        lg:w-[42%] lg:min-h-screen
        lg:items-center lg:justify-center
        lg:px-12 lg:py-12
      "
      style={{ animation: "fadeIn 0.5s ease forwards" }}
    >
      {/* Canvas grid */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      {/* Radial glow blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] -top-[15%] -right-[10%] rounded-full bg-[radial-gradient(circle,rgba(42,107,110,0.18)_0%,transparent_70%)]" />
        <div className="absolute w-[350px] h-[350px] -bottom-[10%] -left-[8%] rounded-full bg-[radial-gradient(circle,rgba(249,177,122,0.10)_0%,transparent_70%)]" />
        <div className="absolute w-[220px] h-[220px] top-[40%] left-[35%] rounded-full bg-[radial-gradient(circle,rgba(91,158,160,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Floating shapes */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute pointer-events-none border border-[rgba(91,158,160,0.12)] ${i % 2 === 0 ? "rounded-[38%_62%_55%_45%/45%_38%_62%_55%]" : "rounded-full"}`}
          style={{
            width: s.size, height: s.size,
            top: s.top, left: s.left,
            opacity: 0.35,
            animationName: i % 2 === 0 ? "floatA" : "floatB",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Contenido sobre el canvas */}
      <div className="relative z-10 flex flex-col flex-1 w-full">

        {/* Botón volver — solo mobile */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="
            lg:hidden self-start
            inline-flex items-center gap-[6px]
            px-3 py-[7px] rounded-[10px]
            bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.10)]
            text-[rgba(240,244,248,0.6)] text-[12px] font-['Raleway'] font-medium
            cursor-pointer touch-manipulation
            transition-all duration-150
            hover:bg-[rgba(255,255,255,0.12)] hover:text-[#f0f4f8]
          "
        >
          <FiArrowLeft size={14} />
          Volver
        </button>

        {/* Branding mobile */}
        <div className="flex items-center justify-center gap-3 mt-6 lg:hidden">
          <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-12 h-12 select-none shrink-0" />
          <div>
            <h1 className="font-['Urbanist'] font-extrabold text-[24px] text-[#f0f4f8] tracking-[0.15em] m-0">
              CONSOR<span className="text-[#f9b17a]">CIA</span>
            </h1>
            <p className="font-['Raleway'] font-light text-[10px] text-[rgba(240,244,248,0.4)] tracking-[0.15em] uppercase mt-[3px] mb-0">
              Gestión moderna
            </p>
          </div>
        </div>

        {/* Botón volver — solo desktop */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="
            hidden lg:inline-flex self-start items-center gap-[6px]
            px-3 py-[7px] rounded-[10px]
            bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.10)]
            text-[rgba(240,244,248,0.6)] text-[12px] font-['Raleway'] font-medium
            cursor-pointer touch-manipulation mb-6
            transition-all duration-150
            hover:bg-[rgba(255,255,255,0.12)] hover:text-[#f0f4f8]
          "
        >
          <FiArrowLeft size={14} />
          Volver
        </button>

        {/* Branding desktop */}
        <div className="hidden lg:flex flex-col items-center text-center gap-6">
          <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-24 h-24 select-none" />
          <h1 className="font-['Urbanist'] font-extrabold text-[32px] text-[#f0f4f8] tracking-[0.2em] m-0">
            CONSOR<span className="text-[#f9b17a]">CIA</span>
          </h1>
          <div className="w-12 h-[2px] rounded-sm bg-gradient-to-r from-[#5b9ea0] to-[#f9b17a]" />
          <p className="font-['Raleway'] font-light text-[13px] text-[rgba(240,244,248,0.45)] tracking-[0.06em] max-w-[200px] leading-[1.6] m-0">
            Gestión moderna para tu edificio
          </p>
        </div>

        {/* Download badges — solo desktop */}
        <div className="hidden lg:flex flex-col items-center gap-3 mt-8">
          <p className="font-['Raleway'] font-medium text-[10px] text-[rgba(240,244,248,0.25)] tracking-[0.12em] uppercase m-0">
            Disponible en
          </p>
          <div className="flex gap-[10px]">
            {/* App Store */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] cursor-pointer touch-manipulation transition-all duration-[180ms] hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)] hover:-translate-y-px"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(240,244,248,0.8)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="font-['Raleway'] text-[8px] text-[rgba(240,244,248,0.4)] tracking-[0.06em] leading-none mb-[2px]">DESCARGAR EN</div>
                <div className="font-['Raleway'] text-[12px] font-semibold text-[rgba(240,244,248,0.85)] leading-none">App Store</div>
              </div>
            </button>

            {/* Google Play */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] cursor-pointer touch-manipulation transition-all duration-[180ms] hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)] hover:-translate-y-px"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.16.64.19.96.09L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335" />
                <path d="M20.47 10.28l-2.8-1.6-3.99 3.58 3.99 3.58 2.83-1.62c.81-.46.81-1.48-.03-1.94z" fill="#FBBC04" />
                <path d="M3.18.24C2.84.08 2.46.1 2.14.31L14.86 12 11 15.86 3.18.24z" fill="#34A853" />
                <path d="M2.14.31C1.82.52 1.6.9 1.6 1.4v21.2c0 .5.22.88.54 1.09L14.86 12 2.14.31z" fill="#4285F4" />
              </svg>
              <div className="text-left">
                <div className="font-['Raleway'] text-[8px] text-[rgba(240,244,248,0.4)] tracking-[0.06em] leading-none mb-[2px]">DISPONIBLE EN</div>
                <div className="font-['Raleway'] text-[12px] font-semibold text-[rgba(240,244,248,0.85)] leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer desktop */}
        <div className="hidden lg:flex flex-col items-center gap-1 mt-auto">
          <div className="flex items-center gap-2 font-['Raleway'] text-[11px] text-[rgba(240,244,248,0.2)] tracking-[0.06em]">
            <span>by ARTHEMYSA</span>
            <span className="w-1 h-1 rounded-full bg-[#5b9ea0] opacity-60 inline-block" />
            <span>{APP_VERSION}</span>
          </div>
        </div>

      </div>
    </div>
  );
}