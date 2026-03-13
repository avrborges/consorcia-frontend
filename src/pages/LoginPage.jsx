import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logoConsorcia from "../assets/img/consorcia.png";
import LoginForm from "../features/auth/components/LoginForm";

const APP_VERSION = "v1.0.0";

const SHAPES = [
  { size: 140, top: "8%",  left: "65%", delay: 0,   dur: 18, opacity: 0.05 },
  { size: 70,  top: "55%", left: "75%", delay: 3,   dur: 14, opacity: 0.07 },
  { size: 200, top: "70%", left: "-8%", delay: 6,   dur: 22, opacity: 0.03 },
  { size: 50,  top: "22%", left: "10%", delay: 1.5, dur: 16, opacity: 0.06 },
];

export default function LoginPage({ onRegister }) {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);
  const [activeTab, setActiveTab] = useState("login");

  /* ── Canvas grid — solo panel izquierdo ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
      ctx.fillStyle = "rgba(91,158,160,0.12)";
      for (let x = 0; x <= W; x += STEP)
        for (let y = 0; y <= H; y += STEP) {
          ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
        }
    };
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <main
      className="
        min-h-screen relative overflow-hidden
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col lg:flex-row
      "
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
      aria-label="Página de inicio de sesión"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatA  { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(7deg); } }
        @keyframes floatB  { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(16px) rotate(-5deg); } }
      `}</style>

      {/* Glow blobs de fondo */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{
          position:"absolute", width:500, height:500,
          top:"-10%", right:"-5%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(42,107,110,0.15) 0%, transparent 70%)",
        }}/>
        <div style={{
          position:"absolute", width:400, height:400,
          bottom:"-8%", left:"-6%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(249,177,122,0.08) 0%, transparent 70%)",
        }}/>
      </div>

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
        style={{ overflow:"hidden", animation:"fadeIn 0.5s ease forwards" }}
      >
        {/* Canvas grid */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Radial glow blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position:"absolute", width:400, height:400,
            top:"-15%", right:"-10%", borderRadius:"50%",
            background:"radial-gradient(circle, rgba(42,107,110,0.18) 0%, transparent 70%)",
          }}/>
          <div style={{
            position:"absolute", width:350, height:350,
            bottom:"-10%", left:"-8%", borderRadius:"50%",
            background:"radial-gradient(circle, rgba(249,177,122,0.10) 0%, transparent 70%)",
          }}/>
          <div style={{
            position:"absolute", width:220, height:220,
            top:"40%", left:"35%", borderRadius:"50%",
            background:"radial-gradient(circle, rgba(91,158,160,0.08) 0%, transparent 70%)",
          }}/>
        </div>

        {/* Floating shapes */}
        {SHAPES.map((s, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position:"absolute",
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              borderRadius: i % 2 === 0 ? "38% 62% 55% 45% / 45% 38% 62% 55%" : "50%",
              border: `1px solid rgba(91,158,160,${s.opacity * 1.8})`,
              background: `rgba(91,158,160,${s.opacity})`,
              animation: `${i % 2 === 0 ? "floatA" : "floatB"} ${s.dur}s ${s.delay}s ease-in-out infinite`,
              pointerEvents:"none",
            }}
          />
        ))}
        {/* Contenido sobre el canvas */}
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", flex:1, width:"100%" }}>

        {/* Botón volver — solo mobile */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio"
          className="lg:hidden self-start"
          style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"7px 12px", borderRadius:10,
            background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.10)",
            color:"rgba(240,244,248,0.6)",
            fontSize:12, fontFamily:"'Raleway', sans-serif", fontWeight:500,
            cursor:"pointer", touchAction:"manipulation",
            transition:"background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.color="#f0f4f8"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(240,244,248,0.6)"; }}
        >
          <FiArrowLeft size={14} />
          Volver
        </button>

        {/* Branding mobile */}
        <div className="flex items-center justify-center gap-3 mt-6 lg:hidden">
          <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-12 h-12 select-none flex-shrink-0" />
          <div>
            <h1 style={{
              fontFamily:"'Urbanist', sans-serif",
              fontWeight:800, fontSize:24, margin:0,
              color:"#f0f4f8", letterSpacing:"0.15em",
            }}>
              CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
            </h1>
            <p style={{
              fontFamily:"'Raleway', sans-serif",
              fontSize:10, fontWeight:300, margin:"3px 0 0",
              color:"rgba(240,244,248,0.4)",
              letterSpacing:"0.15em", textTransform:"uppercase",
            }}>
              Gestión moderna
            </p>
          </div>
        </div>

        {/* Branding desktop */}
        <div className="hidden lg:flex flex-col items-center text-center gap-6">
          <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-24 h-24 select-none" />
          <h1 style={{
            fontFamily:"'Urbanist', sans-serif",
            fontWeight:800, fontSize:32, margin:0,
            color:"#f0f4f8", letterSpacing:"0.2em",
          }}>
            CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
          </h1>
          <div aria-hidden="true" style={{
            width:48, height:2, borderRadius:2,
            background:"linear-gradient(90deg, #5b9ea0, #f9b17a)",
          }} />
          <p style={{
            fontFamily:"'Raleway', sans-serif",
            fontSize:13, fontWeight:300, margin:0,
            color:"rgba(240,244,248,0.45)",
            letterSpacing:"0.06em", maxWidth:200, lineHeight:1.6,
          }}>
            Gestión moderna para tu edificio
          </p>
        </div>

        {/* Download badges — solo desktop */}
        <div className="hidden lg:flex flex-col items-center gap-3 mt-8">
          <p style={{
            fontFamily:"'Raleway', sans-serif",
            fontSize:10, fontWeight:500, margin:0,
            color:"rgba(240,244,248,0.25)",
            letterSpacing:"0.12em", textTransform:"uppercase",
          }}>
            Disponible en
          </p>
          <div style={{ display:"flex", gap:10 }}>

            {/* App Store */}
            <button
              type="button"
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"8px 16px", borderRadius:10,
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.10)",
                cursor:"pointer", touchAction:"manipulation",
                transition:"background 0.18s, border-color 0.18s, transform 0.12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(240,244,248,0.8)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:8, color:"rgba(240,244,248,0.4)", letterSpacing:"0.06em", lineHeight:1, marginBottom:2 }}>DESCARGAR EN</div>
                <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"rgba(240,244,248,0.85)", lineHeight:1 }}>App Store</div>
              </div>
            </button>

            {/* Play Store */}
            <button
              type="button"
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"8px 16px", borderRadius:10,
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.10)",
                cursor:"pointer", touchAction:"manipulation",
                transition:"background 0.18s, border-color 0.18s, transform 0.12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.16.64.19.96.09L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.47 10.28l-2.8-1.6-3.99 3.58 3.99 3.58 2.83-1.62c.81-.46.81-1.48-.03-1.94z" fill="#FBBC04"/>
                <path d="M3.18.24C2.84.08 2.46.1 2.14.31L14.86 12 11 15.86 3.18.24z" fill="#34A853"/>
                <path d="M2.14.31C1.82.52 1.6.9 1.6 1.4v21.2c0 .5.22.88.54 1.09L14.86 12 2.14.31z" fill="#4285F4"/>
              </svg>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:8, color:"rgba(240,244,248,0.4)", letterSpacing:"0.06em", lineHeight:1, marginBottom:2 }}>DISPONIBLE EN</div>
                <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"rgba(240,244,248,0.85)", lineHeight:1 }}>Google Play</div>
              </div>
            </button>

          </div>
        </div>

        {/* Footer desktop — igual que HomePage */}
        <div className="hidden lg:flex flex-col items-center gap-1 mt-auto">
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            fontFamily:"'Raleway', sans-serif",
            fontSize:11,
            color:"rgba(240,244,248,0.2)",
            letterSpacing:"0.06em",
          }}>
            <span>by ARTHEMYSA</span>
            <span style={{
              width:4, height:4, borderRadius:"50%",
              background:"#5b9ea0", opacity:0.6,
              display:"inline-block",
            }}/>
            <span>{APP_VERSION}</span>
          </div>
        </div>
        </div>{/* fin contenido sobre canvas */}
      </div>{/* fin panel izquierdo */}

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
          Mobile: card pegada abajo
          Desktop: panel fijo 58%
      ══════════════════════════════ */}
      <div
        className="
          relative z-10 flex-1 flex flex-col
          px-6 pt-7 pb-8
          rounded-t-[28px] lg:rounded-none
          lg:w-[58%] lg:min-h-screen
          lg:items-center lg:justify-center
          lg:px-16 lg:py-12
        "
        style={{
          background:"#f0f4f8",
          backgroundImage:"radial-gradient(circle, rgba(42,107,110,0.05) 1px, transparent 1px)",
          backgroundSize:"24px 24px",
          animation:"fadeIn 0.5s 0.1s ease both",
        }}
      >
        <div
          className="w-full lg:max-w-[400px] flex flex-col flex-1 lg:flex-none"
          style={{ animation:"fadeUp 0.55s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}
        >

          {/* Saludo — solo desktop */}
          <div className="hidden lg:block" style={{ marginBottom:28 }}>
            <h2 style={{
              fontFamily:"'Urbanist', sans-serif",
              fontWeight:800, fontSize:28, margin:"0 0 6px",
              color:"#2d3250", lineHeight:1.2,
            }}>
              ¡Bienvenido<br />
              <span style={{ color:"#2a6b6e" }}>de nuevo!</span>
            </h2>
            <p style={{
              fontFamily:"'Raleway', sans-serif",
              fontSize:13, fontWeight:300, margin:0,
              color:"#5b7a8a",
            }}>
              Ingresá tus datos para acceder a tu cuenta.
            </p>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            style={{
              display:"flex", gap:4,
              background:"rgba(45,50,80,0.07)",
              borderRadius:14, padding:4,
              marginBottom:24,
            }}
          >
            {[
              { id:"login",    label:"Ingresar"    },
              { id:"register", label:"Registrarse" },
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
                style={{
                  flex:1, padding:"9px 0",
                  borderRadius:10, border:"none",
                  fontSize:13, fontFamily:"'Raleway', sans-serif", fontWeight:600,
                  cursor:"pointer", touchAction:"manipulation",
                  transition:"all 0.2s", outline:"none",
                  background: activeTab === tab.id ? "#ffffff" : "transparent",
                  color:      activeTab === tab.id ? "#2d3250" : "rgba(45,50,80,0.4)",
                  boxShadow:  activeTab === tab.id
                    ? "0 1px 4px rgba(45,50,80,0.10), inset 0 -2px 0 #5b9ea0"
                    : "none",
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
              <div style={{
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"48px 0", textAlign:"center",
              }}>
                <p style={{
                  fontFamily:"'Raleway', sans-serif",
                  fontSize:13, color:"#5b7a8a",
                  margin:"0 0 16px",
                }}>
                  El registro estará disponible próximamente.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  style={{
                    background:"none", border:"none",
                    fontFamily:"'Raleway', sans-serif",
                    fontSize:13, fontWeight:600,
                    color:"#2a6b6e", cursor:"pointer",
                    transition:"color 0.15s", touchAction:"manipulation",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
                  onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
                >
                  ← Volver al login
                </button>
              </div>
            )}
          </div>

          {/* Footer — solo mobile */}
          <footer
            className="lg:hidden"
            style={{
              textAlign:"center", marginTop:24,
              fontFamily:"'Raleway', sans-serif",
              fontSize:11, color:"rgba(45,50,80,0.35)",
              letterSpacing:"0.04em",
            }}
          >
            by ARTHEMYSA
            <span aria-hidden="true" style={{
              display:"inline-block", width:4, height:4,
              borderRadius:"50%", background:"#5b9ea0",
              opacity:0.6, margin:"0 6px", verticalAlign:"middle",
            }} />
            {APP_VERSION}
          </footer>

        </div>
      </div>
    </main>
  );
}