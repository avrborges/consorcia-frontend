import React, { useState, useRef } from "react";
import logoConsorcia from "../../assets/img/consorcia.png";
import { APP_VERSION, FEATURES } from "./homeConstants";

const STATS = [
  { valor: "1.200+",  label: "Edificios activos",          color: "#8ecfd1" },
  { valor: "38.000+", label: "Usuarios registrados",       color: "#f9b17a" },
  { valor: "$4.2M",   label: "Expensas procesadas",        color: "#8ecfd1" },
  { valor: "99.9%",   label: "Disponibilidad del sistema", color: "#f9b17a" },
];

export default function MobileSlider({ onLogin, onRegister }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const TOTAL = 3;

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent(v => Math.min(v + 1, TOTAL - 1));
      else          setCurrent(v => Math.max(v - 1, 0));
    }
    startX.current = null;
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#1a1f3e] font-['Raleway']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Urbanist:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .slide-content { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* Slider area */}
      <div
        className="flex-1 relative overflow-hidden flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[400px] h-[400px] -top-[10%] -right-[15%] rounded-full bg-[radial-gradient(circle,rgba(42,107,110,0.18)_0%,transparent_70%)]" />
          <div className="absolute w-[300px] h-[300px] -bottom-[8%] -left-[10%] rounded-full bg-[radial-gradient(circle,rgba(249,177,122,0.10)_0%,transparent_70%)]" />
        </div>

        {/* Slides */}
        <div className="flex-1 flex flex-col justify-center px-7 pt-10 pb-6 relative z-10">

          {/* ── SLIDE 1: Logo + slogan ── */}
          {current === 0 && (
            <div key="s1" className="slide-content flex flex-col items-center text-center gap-6">
              <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-[72px] h-[72px]" />
              <div>
                <h1 className="font-['Urbanist'] font-extrabold text-[36px] text-[#f0f4f8] mb-3 tracking-[0.12em] leading-none">
                  CONSOR<span className="text-[#f9b17a]">CIA</span>
                </h1>
                <p className="font-light text-[16px] text-[rgba(240,244,248,0.6)] mb-[6px] leading-[1.5]">
                  Tu edificio,{" "}
                  <em className="italic text-[#f9b17a] font-normal">sin papeles</em>
                  {" "}ni sorpresas.
                </p>
                <p className="font-light text-[13px] text-[rgba(240,244,248,0.35)] m-0 tracking-[0.06em] uppercase">
                  Gestión moderna de consorcios
                </p>
              </div>
              <div className="w-12 h-[2px] rounded-sm bg-gradient-to-r from-[#5b9ea0] to-[#f9b17a]" />
              <p className="text-[13px] text-[rgba(240,244,248,0.4)] m-0">
                Deslizá para conocer más →
              </p>
            </div>
          )}

          {/* ── SLIDE 2: Features ── */}
          {current === 1 && (
            <div key="s2" className="slide-content flex flex-col items-center text-center gap-5">
              <div>
                <h2 className="font-['Urbanist'] font-extrabold text-[24px] text-[#f0f4f8] mb-2">
                  Todo lo que necesitás
                </h2>
                <p className="font-light text-[14px] text-[rgba(240,244,248,0.5)] m-0">
                  En un solo lugar, desde tu celular.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(91,158,160,0.15)] text-[12px] text-[rgba(240,244,248,0.65)]"
                  >
                    <Icon size={13} className="shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SLIDE 3: Estadísticas ── */}
          {current === 2 && (
            <div key="s3" className="slide-content flex flex-col items-center text-center gap-7">
              <div>
                <h2 className="font-['Urbanist'] font-extrabold text-[24px] text-[#f0f4f8] mb-2">
                  Miles confían en CONSORCIA
                </h2>
                <p className="font-light text-[14px] text-[rgba(240,244,248,0.5)] m-0">
                  Números que hablan por sí solos.
                </p>
              </div>
              <div className="flex flex-col gap-[14px] w-full">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-[14px] rounded-[14px] bg-[rgba(255,255,255,0.05)] border border-[rgba(91,158,160,0.15)]"
                  >
                    <span className="font-medium text-[13px] text-[rgba(240,244,248,0.55)]">{s.label}</span>
                    <span
                      className="font-['Urbanist'] font-extrabold text-[22px]"
                      style={{ color: s.color }}
                    >
                      {s.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-5 relative z-10">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className="h-[7px] rounded-[4px] transition-all duration-300"
              style={{
                width: i === current ? 20 : 7,
                background: i === current ? "#5b9ea0" : "rgba(91,158,160,0.25)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Botones fijos */}
      <div
        className="flex gap-3 px-6 pt-4 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(26,31,62,0.95)] backdrop-blur-md sticky bottom-0 z-10"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onLogin}
          className="flex-1 py-[14px] rounded-xl bg-[#2a6b6e] border border-[rgba(91,158,160,0.4)] text-white text-[14px] font-['Raleway'] font-bold tracking-[0.05em] cursor-pointer touch-manipulation transition-colors duration-[180ms] active:bg-[#235b5e] active:scale-[0.97]"
        >
          Iniciar sesión
        </button>
        <button
          onClick={onRegister}
          className="flex-1 py-[14px] rounded-xl bg-[rgba(91,158,160,0.08)] border border-[rgba(91,158,160,0.2)] text-[#8ecfd1] text-[14px] font-['Raleway'] font-bold tracking-[0.05em] cursor-pointer touch-manipulation transition-colors duration-[180ms] active:bg-[rgba(91,158,160,0.18)] active:scale-[0.97]"
        >
          Registrarse
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-3 bg-[#1a1f3e]">
        <span className="font-['Raleway'] text-[10px] text-[rgba(240,244,248,0.15)] tracking-[0.06em]">
          by ARTHEMYSA · {APP_VERSION}
        </span>
      </div>
    </div>
  );
}