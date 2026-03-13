import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";
import {
  FiCreditCard, FiFileText, FiBell,
  FiBarChart2, FiHome, FiZap,
  FiTool, FiCheckSquare, FiArrowRight, FiSmartphone,
} from "react-icons/fi";

const APP_VERSION = "v1.0.0";

/* ── Floating geometric shapes (pure CSS animation) ── */
const SHAPES = [
  { size: 180, top: "8%",  left: "72%", delay: 0,    dur: 18, opacity: 0.04 },
  { size: 90,  top: "55%", left: "80%", delay: 3,    dur: 14, opacity: 0.06 },
  { size: 260, top: "65%", left: "-6%", delay: 6,    dur: 22, opacity: 0.03 },
  { size: 60,  top: "20%", left: "15%", delay: 1.5,  dur: 16, opacity: 0.05 },
  { size: 120, top: "38%", left: "50%", delay: 9,    dur: 20, opacity: 0.035 },
];

/* ── Feature pills ── */
const FEATURES = [
  { icon: FiCreditCard,  label: "Expensas digitales"    },
  { icon: FiFileText,    label: "Actas y documentos"    },
  { icon: FiBell,        label: "Avisos al instante"    },
  { icon: FiBarChart2,   label: "Reportes claros"       },
  { icon: FiHome,        label: "Por unidad"            },
  { icon: FiZap,         label: "100% online"           },
  { icon: FiTool,        label: "Gestión de reclamos"   },
  { icon: FiCheckSquare, label: "Encuestas y votaciones"},
];

export default function HomePage({ onLogin, onRegister }) {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);
  const [ready, setReady] = useState(false);

  /* ── Entry animation ── */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── Subtle teal grid on canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    let raf;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const STEP = 52;
      ctx.strokeStyle = "rgba(91,158,160,0.07)";
      ctx.lineWidth   = 0.8;

      for (let x = 0; x <= W; x += STEP) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += STEP) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      /* Accent dots at intersections */
      ctx.fillStyle = "rgba(91,158,160,0.12)";
      for (let x = 0; x <= W; x += STEP) {
        for (let y = 0; y <= H; y += STEP) {
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const goLogin    = onLogin    ?? (() => navigate("/login"));
  const goRegister = onRegister ?? (() => navigate("/register"));

  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,600&family=Urbanist:ital,wght@0,700;0,800;1,700;1,800&display=swap');

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-24px) rotate(8deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(18px) rotate(-6deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pillIn {
          from { opacity: 0; transform: scale(0.88) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-up   { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-fade-in   { animation: fadeIn 0.5s ease forwards; }
        .animate-pill      { animation: pillIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }

        .btn-primary-home {
          background: #2a6b6e;
          color: #fff;
          border: 1px solid rgba(91,158,160,0.4);
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
        }
        .btn-primary-home:hover {
          background: #235b5e;
          box-shadow: 0 8px 32px rgba(42,107,110,0.45);
          transform: translateY(-1px);
        }
        .btn-primary-home:active { transform: scale(0.97); }

        .btn-ghost-home {
          background: rgba(91,158,160,0.08);
          color: #8ecfd1;
          border: 1px solid rgba(91,158,160,0.2);
          transition: background 0.18s, border-color 0.18s, transform 0.12s;
        }
        .btn-ghost-home:hover {
          background: rgba(91,158,160,0.16);
          border-color: rgba(91,158,160,0.4);
          transform: translateY(-1px);
        }
        .btn-ghost-home:active { transform: scale(0.97); }

        .feature-pill {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(91,158,160,0.15);
          color: rgba(240,244,248,0.65);
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .feature-pill:hover {
          background: rgba(91,158,160,0.12);
          border-color: rgba(91,158,160,0.35);
          color: #e0f2f2;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(91,158,160,0.12);
          backdrop-filter: blur(8px);
        }

        .teal-line {
          background: linear-gradient(90deg, transparent, #5b9ea0, #f9b17a, #5b9ea0, transparent);
        }
      `}</style>

      {/* ── Canvas grid background ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Radial glow blobs ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position:"absolute", width:600, height:600,
          top:"-15%", right:"-10%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(42,107,110,0.18) 0%, transparent 70%)",
        }}/>
        <div style={{
          position:"absolute", width:500, height:500,
          bottom:"-10%", left:"-8%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(249,177,122,0.10) 0%, transparent 70%)",
        }}/>
        <div style={{
          position:"absolute", width:300, height:300,
          top:"40%", left:"42%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(91,158,160,0.08) 0%, transparent 70%)",
        }}/>
      </div>

      {/* ── Floating shapes ── */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position:"absolute",
            width: s.size, height: s.size,
            top: s.top, left: s.left,
            border: `1px solid rgba(91,158,160,${s.opacity * 3})`,
            borderRadius: i % 2 === 0 ? "24px" : "50%",
            opacity: s.opacity * 8,
            animationName: i % 2 === 0 ? "floatA" : "floatB",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <header
        className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-12"
        style={{
          opacity: ready ? 1 : 0,
          animation: ready ? "fadeIn 0.4s ease forwards" : "none",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 select-none">
          <img
            src={logoConsorcia}
            alt="Logo CONSORCIA"
            style={{ width: 32, height: 32 }}
          />
          <span style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.18em",
            color: "#f0f4f8",
          }}>
            CONSOR<span style={{ color: "#f9b17a" }}>CIA</span>
          </span>
        </div>

        {/* Nav links desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {["Funciones", "Precios", "Soporte"].map((item) => (
            <button
              key={item}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "rgba(240,244,248,0.5)",
                fontFamily: "'Raleway', sans-serif",
                transition: "color 0.15s",
                padding: "4px 0",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#8ecfd1"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(240,244,248,0.5)"}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* CTA header */}
        <button
          type="button"
          onClick={goLogin}
          className="btn-ghost-home"
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          Ingresar
        </button>
      </header>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 lg:py-24 text-center">

        {/* Badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(42,107,110,0.18)",
            border: "1px solid rgba(91,158,160,0.3)",
            borderRadius: 100,
            padding: "5px 14px",
            marginBottom: 32,
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#5b9ea0",
            display: "inline-block",
            boxShadow: "0 0 6px rgba(91,158,160,0.8)",
          }} />
          <span style={{
            fontSize: 12, color: "#8ecfd1",
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: "0.06em",
          }}>
            Gestión moderna para consorcios
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontSize: "clamp(32px, 5.5vw, 62px)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#f0f4f8",
            maxWidth: 780,
            margin: "0 0 12px",
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.18s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          Tu edificio,{" "}
          <em style={{ fontStyle: "italic", color: "#f9b17a" }}>
            sin papeles
          </em>
          <br />
          ni sorpresas.
        </h1>

        {/* Teal divider line */}
        <div
          className="teal-line"
          style={{
            width: 160, height: 1.5, borderRadius: 2,
            margin: "24px auto",
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeIn 0.6s 0.3s ease forwards" : "none",
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(240,244,248,0.55)",
            maxWidth: 520,
            margin: "0 0 40px",
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.28s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          Expensas, documentos, avisos y reportes en un solo lugar.
          Pensado para administradores, propietarios e inquilinos.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            justifyContent: "center",
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.38s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          <button
            type="button"
            onClick={goLogin}
            className="btn-primary-home"
            style={{
              padding: "13px 32px",
              borderRadius: 12,
              fontSize: 14,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.06em",
              cursor: "pointer",
              touchAction: "manipulation",
            }}
          >
            INICIAR SESIÓN
          </button>

          <button
            type="button"
            onClick={goRegister}
            style={{
              padding: "13px 28px",
              borderRadius: 12,
              fontSize: 14,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              background: "transparent",
              color: "rgba(240,244,248,0.55)",
              border: "1px solid rgba(240,244,248,0.12)",
              transition: "color 0.18s, border-color 0.18s, transform 0.12s",
              touchAction: "manipulation",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#f0f4f8";
              e.currentTarget.style.borderColor = "rgba(240,244,248,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(240,244,248,0.55)";
              e.currentTarget.style.borderColor = "rgba(240,244,248,0.12)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Registrarse <FiArrowRight size={14} style={{ display: "inline", verticalAlign: "middle", marginLeft: 2 }} />
          </button>
        </div>

        {/* ── Stats row ── */}
        <div
          style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 52,
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.5s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          {[
            { value: "+1.200", label: "edificios activos"  },
            { value: "98%",    label: "cobro puntual"      },
            { value: "24/7",   label: "disponibilidad"     },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="stat-card"
              style={{
                borderRadius: 12,
                padding: "16px 24px",
                textAlign: "center",
                minWidth: 110,
              }}
            >
              <div style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#8ecfd1",
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {value}
              </div>
              <div style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 11,
                color: "rgba(240,244,248,0.4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature pills ── */}
        <div
          style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 48,
            maxWidth: 600,
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.6s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="feature-pill animate-pill"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px",
                borderRadius: 100,
                fontSize: 12,
                fontFamily: "'Raleway', sans-serif",
                cursor: "default",
                animationDelay: `${0.65 + i * 0.07}s`,
                opacity: 0,
              }}
            >
              <Icon size={14} style={{ flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>

        {/* ── Download badges ── */}
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 12, marginTop: 52,
            opacity: ready ? 1 : 0,
            animation: ready ? "fadeUp 0.6s 0.75s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        >
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(240,244,248,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            Disponible en
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>

            {/* App Store */}
            <button
              type="button"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                transition: "background 0.18s, border-color 0.18s, transform 0.12s",
                touchAction: "manipulation",
                minWidth: 150,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Apple icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(240,244,248,0.85)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  color: "rgba(240,244,248,0.45)",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  marginBottom: 2,
                }}>
                  DESCARGAR EN
                </div>
                <div style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "rgba(240,244,248,0.88)",
                  lineHeight: 1,
                }}>
                  App Store
                </div>
              </div>
            </button>

            {/* Play Store */}
            <button
              type="button"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                transition: "background 0.18s, border-color 0.18s, transform 0.12s",
                touchAction: "manipulation",
                minWidth: 150,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Google Play icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.16.64.19.96.09L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.47 10.28l-2.8-1.6-3.99 3.58 3.99 3.58 2.83-1.62c.81-.46.81-1.48-.03-1.94z" fill="#FBBC04"/>
                <path d="M3.18.24C2.84.08 2.46.1 2.14.31L14.86 12 11 15.86 3.18.24z" fill="#34A853"/>
                <path d="M2.14.31C1.82.52 1.6.9 1.6 1.4v21.2c0 .5.22.88.54 1.09L14.86 12 2.14.31z" fill="#4285F4"/>
              </svg>
              <div style={{ textAlign: "left" }}>
                <div style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 9,
                  color: "rgba(240,244,248,0.45)",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  marginBottom: 2,
                }}>
                  DISPONIBLE EN
                </div>
                <div style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "rgba(240,244,248,0.88)",
                  lineHeight: 1,
                }}>
                  Google Play
                </div>
              </div>
            </button>

          </div>
        </div>

      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer
        className="relative z-10 text-center pb-8"
        style={{
          opacity: ready ? 1 : 0,
          animation: ready ? "fadeIn 0.6s 0.8s ease forwards" : "none",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8,
          fontFamily: "'Raleway', sans-serif",
          fontSize: 11,
          color: "rgba(240,244,248,0.2)",
          letterSpacing: "0.06em",
        }}>
          <span>by ARTHEMYSA</span>
          <span style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "#5b9ea0",
            opacity: 0.6,
          }} />
          <span>{APP_VERSION}</span>
        </div>
      </footer>

    </main>
  );
}