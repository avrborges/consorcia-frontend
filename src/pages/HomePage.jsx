import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";
import {
  FiCreditCard, FiFileText, FiBell,
  FiBarChart2, FiHome, FiZap,
  FiTool, FiCheckSquare, FiArrowRight,
} from "react-icons/fi";

const APP_VERSION = "v1.0.0";

const SHAPES = [
  { size: 180, top: "8%",  left: "72%", delay: 0,   dur: 18, opacity: 0.04 },
  { size: 90,  top: "55%", left: "80%", delay: 3,   dur: 14, opacity: 0.06 },
  { size: 260, top: "65%", left: "-6%", delay: 6,   dur: 22, opacity: 0.03 },
  { size: 60,  top: "20%", left: "15%", delay: 1.5, dur: 16, opacity: 0.05 },
  { size: 120, top: "38%", left: "50%", delay: 9,   dur: 20, opacity: 0.035 },
];

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

/* ── Slider mobile ── */
function MobileSlider({ onLogin, onRegister }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const sliderRef = useRef(null);
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
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:"100svh", background:"#1a1f3e", fontFamily:"'Raleway', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Urbanist:wght@700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatA { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-20px) rotate(7deg); } }
        @keyframes floatB { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(16px) rotate(-5deg); } }
        .slide-content { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .btn-login-mob {
          flex:1; padding:14px; border-radius:12px;
          background:#2a6b6e; border:1px solid rgba(91,158,160,0.4);
          font-family:'Raleway',sans-serif; font-size:14px; font-weight:700;
          color:#fff; cursor:pointer; touch-action:manipulation;
          transition:background 0.18s; letter-spacing:0.05em;
        }
        .btn-login-mob:active { background:#235b5e; transform:scale(0.97); }
        .btn-register-mob {
          flex:1; padding:14px; border-radius:12px;
          background:rgba(91,158,160,0.08); border:1px solid rgba(91,158,160,0.2);
          font-family:'Raleway',sans-serif; font-size:14px; font-weight:700;
          color:#8ecfd1; cursor:pointer; touch-action:manipulation;
          transition:background 0.18s; letter-spacing:0.05em;
        }
        .btn-register-mob:active { background:rgba(91,158,160,0.18); transform:scale(0.97); }
        .feature-pill-mob {
          display:flex; align-items:center; gap:6px;
          padding:7px 13px; border-radius:100px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(91,158,160,0.15);
          font-family:'Raleway',sans-serif; font-size:12px;
          color:rgba(240,244,248,0.65);
        }
        .testim-card {
          background:rgba(255,255,255,0.05); border:1px solid rgba(91,158,160,0.15);
          border-radius:16px; padding:18px;
        }
      `}</style>

      {/* Slider area */}
      <div
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ flex:1, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}
      >
        {/* Blobs de fondo */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", width:400, height:400, top:"-10%", right:"-15%", borderRadius:"50%", background:"radial-gradient(circle, rgba(42,107,110,0.18) 0%, transparent 70%)" }}/>
          <div style={{ position:"absolute", width:300, height:300, bottom:"-8%", left:"-10%", borderRadius:"50%", background:"radial-gradient(circle, rgba(249,177,122,0.10) 0%, transparent 70%)" }}/>
        </div>

        {/* Slides */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"40px 28px 24px", position:"relative", zIndex:1 }}>

          {/* ── SLIDE 1: Logo + slogan ── */}
          {current === 0 && (
            <div key="s1" className="slide-content" style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:24 }}>
              <img src={logoConsorcia} alt="Logo CONSORCIA" style={{ width:72, height:72 }} />
              <div>
                <h1 style={{ fontFamily:"'Urbanist',sans-serif", fontWeight:800, fontSize:36, color:"#f0f4f8", margin:"0 0 12px", letterSpacing:"0.12em", lineHeight:1 }}>
                  CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
                </h1>
                <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:16, color:"rgba(240,244,248,0.6)", margin:"0 0 6px", lineHeight:1.5 }}>
                  Tu edificio,{" "}
                  <em style={{ fontStyle:"italic", color:"#f9b17a", fontWeight:400 }}>sin papeles</em>
                  {" "}ni sorpresas.
                </p>
                <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:13, color:"rgba(240,244,248,0.35)", margin:0, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                  Gestión moderna de consorcios
                </p>
              </div>
              {/* Divisor decorativo */}
              <div style={{ width:48, height:2, borderRadius:2, background:"linear-gradient(90deg, #5b9ea0, #f9b17a)" }} />
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:13, color:"rgba(240,244,248,0.4)", margin:0 }}>
                Deslizá para conocer más →
              </p>
            </div>
          )}

          {/* ── SLIDE 2: Features ── */}
          {current === 1 && (
            <div key="s2" className="slide-content" style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:20 }}>
              <div>
                <h2 style={{ fontFamily:"'Urbanist',sans-serif", fontWeight:800, fontSize:24, color:"#f0f4f8", margin:"0 0 8px" }}>
                  Todo lo que necesitás
                </h2>
                <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:14, color:"rgba(240,244,248,0.5)", margin:0 }}>
                  En un solo lugar, desde tu celular.
                </p>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                {FEATURES.map(({ icon: Icon, label }) => (
                  <div key={label} className="feature-pill-mob">
                    <Icon size={13} style={{ flexShrink:0 }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SLIDE 3: Estadísticas ── */}
          {current === 2 && (
            <div key="s3" className="slide-content" style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:28 }}>
              <div>
                <h2 style={{ fontFamily:"'Urbanist',sans-serif", fontWeight:800, fontSize:24, color:"#f0f4f8", margin:"0 0 8px" }}>
                  Miles confían en CONSORCIA
                </h2>
                <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:14, color:"rgba(240,244,248,0.5)", margin:0 }}>
                  Números que hablan por sí solos.
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14, width:"100%" }}>
                {[
                  { valor:"1.200+",  label:"Edificios activos",        color:"#8ecfd1" },
                  { valor:"38.000+", label:"Usuarios registrados",     color:"#f9b17a" },
                  { valor:"$4.2M",   label:"Expensas procesadas",      color:"#8ecfd1" },
                  { valor:"99.9%",   label:"Disponibilidad del sistema", color:"#f9b17a" },
                ].map((s, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"14px 20px", borderRadius:14,
                    background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(91,158,160,0.15)",
                  }}>
                    <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:13, fontWeight:500, color:"rgba(240,244,248,0.55)" }}>
                      {s.label}
                    </span>
                    <span style={{ fontFamily:"'Urbanist',sans-serif", fontSize:22, fontWeight:800, color:s.color }}>
                      {s.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, paddingBottom:20, position:"relative", zIndex:1 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              width: i === current ? 20 : 7, height:7, borderRadius:4,
              background: i === current ? "#5b9ea0" : "rgba(91,158,160,0.25)",
              transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}/>
          ))}
        </div>
      </div>

      {/* Botones fijos en el fondo */}
      <div style={{
        padding:"16px 24px",
        paddingBottom:"calc(16px + env(safe-area-inset-bottom))",
        borderTop:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(26,31,62,0.95)",
        backdropFilter:"blur(12px)",
        display:"flex", gap:12,
        position:"sticky", bottom:0, zIndex:10,
      }}>
        <button className="btn-login-mob" onClick={onLogin}>Iniciar sesión</button>
        <button className="btn-register-mob" onClick={onRegister}>Registrarse</button>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"10px 0 14px", background:"#1a1f3e" }}>
        <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:10, color:"rgba(240,244,248,0.15)", letterSpacing:"0.06em" }}>
          by ARTHEMYSA · {APP_VERSION}
        </span>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function HomePage({ onLogin, onRegister }) {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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
      for (let x = 0; x <= W; x += STEP) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y <= H; y += STEP) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.fillStyle = "rgba(91,158,160,0.12)";
      for (let x = 0; x <= W; x += STEP)
        for (let y = 0; y <= H; y += STEP) { ctx.beginPath(); ctx.arc(x,y,1.4,0,Math.PI*2); ctx.fill(); }
    };
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const goLogin    = onLogin    ?? (() => navigate("/login"));
  const goRegister = onRegister ?? (() => navigate("/register"));

  /* ── Mobile: slider ── */
  if (isMobile) {
    return <MobileSlider onLogin={goLogin} onRegister={goRegister} />;
  }

  /* ── Desktop: layout original ── */
  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,600&family=Urbanist:ital,wght@0,700;0,800;1,700;1,800&display=swap');
        @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-24px) rotate(8deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(18px) rotate(-6deg); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pillIn  { from { opacity: 0; transform: scale(0.88) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .animate-pill    { animation: pillIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        .btn-primary-home { background:#2a6b6e; color:#fff; border:1px solid rgba(91,158,160,0.4); transition:background 0.18s,box-shadow 0.18s,transform 0.12s; }
        .btn-primary-home:hover { background:#235b5e; box-shadow:0 8px 32px rgba(42,107,110,0.45); transform:translateY(-1px); }
        .btn-primary-home:active { transform:scale(0.97); }
        .btn-ghost-home { background:rgba(91,158,160,0.08); color:#8ecfd1; border:1px solid rgba(91,158,160,0.2); transition:background 0.18s,border-color 0.18s,transform 0.12s; }
        .btn-ghost-home:hover { background:rgba(91,158,160,0.16); border-color:rgba(91,158,160,0.4); transform:translateY(-1px); }
        .btn-ghost-home:active { transform:scale(0.97); }
        .feature-pill { background:rgba(255,255,255,0.04); border:1px solid rgba(91,158,160,0.15); color:rgba(240,244,248,0.65); transition:background 0.18s,border-color 0.18s,color 0.18s; }
        .feature-pill:hover { background:rgba(91,158,160,0.12); border-color:rgba(91,158,160,0.35); color:#e0f2f2; }
        .stat-card { background:rgba(255,255,255,0.04); border:1px solid rgba(91,158,160,0.12); backdrop-filter:blur(8px); }
        .teal-line { background:linear-gradient(90deg,transparent,#5b9ea0,#f9b17a,#5b9ea0,transparent); }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", width:600, height:600, top:"-15%", right:"-10%", borderRadius:"50%", background:"radial-gradient(circle, rgba(42,107,110,0.18) 0%, transparent 70%)" }}/>
        <div style={{ position:"absolute", width:500, height:500, bottom:"-10%", left:"-8%", borderRadius:"50%", background:"radial-gradient(circle, rgba(249,177,122,0.10) 0%, transparent 70%)" }}/>
        <div style={{ position:"absolute", width:300, height:300, top:"40%", left:"42%", borderRadius:"50%", background:"radial-gradient(circle, rgba(91,158,160,0.08) 0%, transparent 70%)" }}/>
      </div>

      {SHAPES.map((s, i) => (
        <div key={i} aria-hidden="true" style={{
          position:"absolute", width:s.size, height:s.size, top:s.top, left:s.left,
          border:`1px solid rgba(91,158,160,${s.opacity*3})`,
          borderRadius: i%2===0 ? "24px" : "50%",
          opacity: s.opacity*8,
          animationName: i%2===0 ? "floatA" : "floatB",
          animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`,
          animationTimingFunction:"ease-in-out", animationIterationCount:"infinite",
          pointerEvents:"none",
        }}/>
      ))}

      {/* NAV desktop */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-9 h-9 select-none" />
          <span style={{ fontFamily:"'Urbanist',sans-serif", fontWeight:800, fontSize:20, color:"#f0f4f8", letterSpacing:"0.15em" }}>
            CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goLogin} className="btn-ghost-home" style={{ padding:"9px 22px", borderRadius:10, fontSize:13, fontFamily:"'Raleway',sans-serif", fontWeight:600, cursor:"pointer", touchAction:"manipulation" }}>
            Iniciar sesión
          </button>
          <button onClick={goRegister} className="btn-primary-home" style={{ padding:"9px 22px", borderRadius:10, fontSize:13, fontFamily:"'Raleway',sans-serif", fontWeight:600, cursor:"pointer", touchAction:"manipulation", display:"flex", alignItems:"center", gap:6 }}>
            Registrarse <FiArrowRight size={14}/>
          </button>
        </div>
      </nav>

      {/* HERO desktop */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-20 flex-1">
        <div style={{ opacity:ready?1:0, animation:ready?"fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards":"none", marginBottom:32 }}>
          <img src={logoConsorcia} alt="Logo" className="w-20 h-20 mx-auto mb-6 select-none" />
          <h1 style={{ fontFamily:"'Urbanist',sans-serif", fontWeight:800, fontSize:"clamp(36px,5vw,64px)", color:"#f0f4f8", margin:"0 0 20px", lineHeight:1.1, letterSpacing:"0.02em" }}>
            Tu edificio,{" "}
            <em style={{ fontStyle:"italic", color:"#f9b17a" }}>sin papeles</em>
            <br/>ni sorpresas.
          </h1>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:"clamp(15px,1.8vw,18px)", color:"rgba(240,244,248,0.55)", margin:"0 auto", maxWidth:520, lineHeight:1.7 }}>
            La plataforma que conecta propietarios, inquilinos y administradores en un solo lugar.
          </p>
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:48, opacity:ready?1:0, animation:ready?"fadeUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) forwards":"none" }}>
          <button onClick={goRegister} className="btn-primary-home" style={{ padding:"14px 32px", borderRadius:12, fontSize:15, fontFamily:"'Raleway',sans-serif", fontWeight:700, cursor:"pointer", touchAction:"manipulation", display:"flex", alignItems:"center", gap:8, letterSpacing:"0.04em" }}>
            Comenzar gratis <FiArrowRight size={16}/>
          </button>
          <button onClick={goLogin} className="btn-ghost-home" style={{ padding:"14px 32px", borderRadius:12, fontSize:15, fontFamily:"'Raleway',sans-serif", fontWeight:700, cursor:"pointer", touchAction:"manipulation", letterSpacing:"0.04em" }}>
            Ya tengo cuenta
          </button>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", maxWidth:600, opacity:ready?1:0, animation:ready?"fadeUp 0.6s 0.6s cubic-bezier(0.22,1,0.36,1) forwards":"none" }}>
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <div key={label} className="feature-pill animate-pill" style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:100, fontSize:12, fontFamily:"'Raleway',sans-serif", cursor:"default", animationDelay:`${0.65+i*0.07}s`, opacity:0 }}>
              <Icon size={14} style={{ flexShrink:0 }}/>{label}
            </div>
          ))}
        </div>

        {/* Download badges */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginTop:48, opacity:ready?1:0, animation:ready?"fadeUp 0.6s 0.75s cubic-bezier(0.22,1,0.36,1) forwards":"none" }}>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:11, fontWeight:500, color:"rgba(240,244,248,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", margin:0 }}>
            Disponible en
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
            {/* App Store */}
            <button type="button"
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", borderRadius:12, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", transition:"background 0.18s,border-color 0.18s,transform 0.12s", touchAction:"manipulation", minWidth:150 }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(240,244,248,0.85)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:9, color:"rgba(240,244,248,0.45)", letterSpacing:"0.06em", lineHeight:1, marginBottom:2 }}>DESCARGAR EN</div>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:14, fontWeight:600, color:"rgba(240,244,248,0.88)", lineHeight:1 }}>App Store</div>
              </div>
            </button>
            {/* Google Play */}
            <button type="button"
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", borderRadius:12, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", transition:"background 0.18s,border-color 0.18s,transform 0.12s", touchAction:"manipulation", minWidth:150 }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.16.64.19.96.09L14.86 12 11 8.14 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.47 10.28l-2.8-1.6-3.99 3.58 3.99 3.58 2.83-1.62c.81-.46.81-1.48-.03-1.94z" fill="#FBBC04"/>
                <path d="M3.18.24C2.84.08 2.46.1 2.14.31L14.86 12 11 15.86 3.18.24z" fill="#34A853"/>
                <path d="M2.14.31C1.82.52 1.6.9 1.6 1.4v21.2c0 .5.22.88.54 1.09L14.86 12 2.14.31z" fill="#4285F4"/>
              </svg>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:9, color:"rgba(240,244,248,0.45)", letterSpacing:"0.06em", lineHeight:1, marginBottom:2 }}>DISPONIBLE EN</div>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:14, fontWeight:600, color:"rgba(240,244,248,0.88)", lineHeight:1 }}>Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 text-center pb-8" style={{ opacity:ready?1:0, animation:ready?"fadeIn 0.6s 0.8s ease forwards":"none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"'Raleway',sans-serif", fontSize:11, color:"rgba(240,244,248,0.2)", letterSpacing:"0.06em" }}>
          <span>by ARTHEMYSA</span>
          <span style={{ width:4, height:4, borderRadius:"50%", background:"#5b9ea0", opacity:0.6 }}/>
          <span>{APP_VERSION}</span>
        </div>
      </footer>
    </main>
  );
}