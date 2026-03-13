import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";
import logoConsorcia from "../assets/img/consorcia.png";

const APP_VERSION = "v1.0.0";

const SHAPES = [
  { size: 140, top: "8%",  left: "65%", delay: 0,   dur: 18, opacity: 0.05 },
  { size: 70,  top: "55%", left: "75%", delay: 3,   dur: 14, opacity: 0.07 },
  { size: 200, top: "70%", left: "-8%", delay: 6,   dur: 22, opacity: 0.03 },
  { size: 50,  top: "22%", left: "10%", delay: 1.5, dur: 16, opacity: 0.06 },
];

export default function ForgotPasswordPage() {
  const navigate   = useNavigate();
  const canvasRef  = useRef(null);
  const [email,    setEmail]   = useState("");
  const [sending,  setSending] = useState(false);
  const [sent,     setSent]    = useState(false);
  const [error,    setError]   = useState("");

  /* ── Canvas grid ── */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  return (
    <main
      className="
        min-h-screen relative overflow-hidden
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col lg:flex-row
      "
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
      aria-label="Recuperar contraseña"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatA  { 0%,100% { transform:translateY(0px) rotate(0deg) } 50% { transform:translateY(-20px) rotate(7deg) } }
        @keyframes floatB  { 0%,100% { transform:translateY(0px) rotate(0deg) } 50% { transform:translateY(16px) rotate(-5deg) } }
        @keyframes spin    { to { transform:rotate(360deg) } }

        .fp-input {
          width: 100%; box-sizing: border-box;
          border-radius: 12px; padding: 11px 14px 11px 40px;
          font-size: 13px; font-family: 'Raleway', sans-serif; font-weight: 400;
          color: #2d3250; background: #ffffff;
          border: 1px solid #b0cfd0; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .fp-input::placeholder { color: rgba(91,122,138,0.45); }
        .fp-input:focus {
          border-color: #5b9ea0;
          box-shadow: 0 0 0 3px rgba(91,158,160,0.15);
        }

        .fp-btn-cta {
          width: 100%; padding: 13px;
          border-radius: 12px;
          font-size: 13px; font-family: 'Raleway', sans-serif;
          font-weight: 700; letter-spacing: 0.1em;
          color: #ffffff; background: #2a6b6e;
          border: 1px solid rgba(91,158,160,0.4);
          box-shadow: 0 4px 20px rgba(42,107,110,0.25);
          cursor: pointer; touch-action: manipulation;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
        }
        .fp-btn-cta:hover:not(:disabled) {
          background: #235b5e;
          box-shadow: 0 6px 28px rgba(42,107,110,0.40);
          transform: translateY(-1px);
        }
        .fp-btn-cta:active:not(:disabled) { transform: scale(0.97); }
        .fp-btn-cta:disabled { opacity: 0.6; cursor: not-allowed; }

        .fp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
      `}</style>

      {/* Glow blobs */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:500, height:500, top:"-10%", right:"-5%", borderRadius:"50%", background:"radial-gradient(circle, rgba(42,107,110,0.15) 0%, transparent 70%)" }}/>
        <div style={{ position:"absolute", width:400, height:400, bottom:"-8%", left:"-6%", borderRadius:"50%", background:"radial-gradient(circle, rgba(249,177,122,0.08) 0%, transparent 70%)" }}/>
      </div>

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
        style={{ overflow:"hidden", animation:"fadeIn 0.5s ease forwards" }}
      >
        {/* Canvas grid */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

        {/* Radial glow blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:"absolute", width:400, height:400, top:"-15%", right:"-10%", borderRadius:"50%", background:"radial-gradient(circle, rgba(42,107,110,0.18) 0%, transparent 70%)" }}/>
          <div style={{ position:"absolute", width:350, height:350, bottom:"-10%", left:"-8%", borderRadius:"50%", background:"radial-gradient(circle, rgba(249,177,122,0.10) 0%, transparent 70%)" }}/>
          <div style={{ position:"absolute", width:220, height:220, top:"40%", left:"35%", borderRadius:"50%", background:"radial-gradient(circle, rgba(91,158,160,0.08) 0%, transparent 70%)" }}/>
        </div>

        {/* Floating shapes */}
        {SHAPES.map((s, i) => (
          <div key={i} aria-hidden="true" style={{
            position:"absolute", top:s.top, left:s.left,
            width:s.size, height:s.size,
            borderRadius: i % 2 === 0 ? "38% 62% 55% 45% / 45% 38% 62% 55%" : "50%",
            border:`1px solid rgba(91,158,160,${s.opacity * 1.8})`,
            background:`rgba(91,158,160,${s.opacity})`,
            animation:`${i % 2 === 0 ? "floatA" : "floatB"} ${s.dur}s ${s.delay}s ease-in-out infinite`,
            pointerEvents:"none",
          }} />
        ))}

        {/* Contenido sobre el canvas */}
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", flex:1, width:"100%" }}>

          {/* Botón volver — solo mobile */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            aria-label="Volver al login"
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
              <h1 style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:24, margin:0, color:"#f0f4f8", letterSpacing:"0.15em" }}>
                CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
              </h1>
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:300, margin:"3px 0 0", color:"rgba(240,244,248,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>
                Gestión moderna
              </p>
            </div>
          </div>

          {/* Branding desktop */}
          <div className="hidden lg:flex flex-col items-center text-center gap-6">
            <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-24 h-24 select-none" />
            <h1 style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:32, margin:0, color:"#f0f4f8", letterSpacing:"0.2em" }}>
              CONSOR<span style={{ color:"#f9b17a" }}>CIA</span>
            </h1>
            <div style={{ width:48, height:2, borderRadius:2, background:"linear-gradient(90deg, #5b9ea0, #f9b17a)" }} />
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:300, margin:0, color:"rgba(240,244,248,0.45)", letterSpacing:"0.06em", maxWidth:200, lineHeight:1.6 }}>
              Gestión moderna para tu edificio
            </p>
          </div>

          {/* Download badges — solo desktop */}
          <div className="hidden lg:flex flex-col items-center gap-3 mt-8">
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:500, margin:0, color:"rgba(240,244,248,0.25)", letterSpacing:"0.12em", textTransform:"uppercase" }}>
              Disponible en
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button type="button" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.10)", cursor:"pointer", touchAction:"manipulation", transition:"background 0.18s, border-color 0.18s, transform 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.20)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.10)"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(240,244,248,0.8)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:8, color:"rgba(240,244,248,0.4)", letterSpacing:"0.06em", lineHeight:1, marginBottom:2 }}>DESCARGAR EN</div>
                  <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"rgba(240,244,248,0.85)", lineHeight:1 }}>App Store</div>
                </div>
              </button>
              <button type="button" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.10)", cursor:"pointer", touchAction:"manipulation", transition:"background 0.18s, border-color 0.18s, transform 0.12s" }}
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

          {/* Footer desktop */}
          <div className="hidden lg:flex flex-col items-center gap-1 mt-auto">
            <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"'Raleway', sans-serif", fontSize:11, color:"rgba(240,244,248,0.2)", letterSpacing:"0.06em" }}>
              <span>by ARTHEMYSA</span>
              <span style={{ width:4, height:4, borderRadius:"50%", background:"#5b9ea0", opacity:0.6, display:"inline-block" }}/>
              <span>{APP_VERSION}</span>
            </div>
          </div>

        </div>{/* fin contenido sobre canvas */}
      </div>{/* fin panel izquierdo */}

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
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

          {/* Encabezado */}
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontFamily:"'Urbanist', sans-serif", fontWeight:800, fontSize:26, color:"#2d3250", margin:"0 0 6px", lineHeight:1.2 }}>
              Recuperar<br/>
              <span style={{ color:"#2a6b6e" }}>contraseña</span>
            </h2>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:300, color:"#5b7a8a", margin:0 }}>
              {sent
                ? "Revisá tu casilla de correo."
                : "Ingresá tu email y te enviamos un enlace para restablecer tu contraseña."
              }
            </p>
          </div>

          {/* ── Estado: enviado ── */}
          {sent ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:"32px 0", textAlign:"center" }}>
              <div style={{
                width:56, height:56, borderRadius:"50%",
                background:"rgba(42,107,110,0.10)",
                border:"1px solid rgba(91,158,160,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <FiCheckCircle size={26} color="#2a6b6e" />
              </div>
              <div>
                <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:14, fontWeight:600, color:"#2d3250", margin:"0 0 4px" }}>
                  ¡Listo! Revisá tu email
                </p>
                <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:300, color:"#5b7a8a", margin:0 }}>
                  Si <strong style={{ fontWeight:600 }}>{email}</strong> está registrado, recibirás el enlace en breve.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  marginTop:8,
                  display:"inline-flex", alignItems:"center", gap:6,
                  background:"none", border:"none",
                  fontFamily:"'Raleway', sans-serif",
                  fontSize:13, fontWeight:600,
                  color:"#2a6b6e", cursor:"pointer",
                  transition:"color 0.15s", touchAction:"manipulation",
                }}
                onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
                onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
              >
                <FiArrowLeft size={13} />
                Volver al login
              </button>
            </div>

          ) : (
            /* ── Estado: formulario ── */
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Error */}
              {error && (
                <div role="alert" style={{ borderRadius:10, padding:"10px 14px", background:"#fee2e2", color:"#b91c1c", border:"1px solid rgba(185,28,28,0.15)", fontFamily:"'Raleway', sans-serif", fontSize:13 }}>
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", marginBottom:6, display:"block", letterSpacing:"0.02em" }}>
                  Email
                </label>
                <div style={{ position:"relative" }}>
                  <FiMail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#5b9ea0", pointerEvents:"none" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setError(""); setEmail(e.target.value); }}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                    className="fp-input"
                  />
                </div>
              </div>

              {/* CTA */}
              <button type="submit" disabled={sending} className="fp-btn-cta" style={{ marginTop:4 }}>
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {sending && <span className="fp-spinner" />}
                  {sending ? "Enviando…" : "ENVIAR ENLACE"}
                </span>
              </button>

              {/* Volver */}
              <div style={{ display:"flex", justifyContent:"center", marginTop:4 }}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background:"none", border:"none",
                    fontFamily:"'Raleway', sans-serif",
                    fontSize:12, fontWeight:600,
                    color:"#5b7a8a", cursor:"pointer",
                    display:"inline-flex", alignItems:"center", gap:5,
                    transition:"color 0.15s", touchAction:"manipulation",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color="#2a6b6e"}
                  onMouseLeave={e => e.currentTarget.style.color="#5b7a8a"}
                >
                  <FiArrowLeft size={12} />
                  Volver al login
                </button>
              </div>

            </form>
          )}

          {/* Footer — solo mobile */}
          <footer className="lg:hidden" style={{ textAlign:"center", marginTop:"auto", paddingTop:24, fontFamily:"'Raleway', sans-serif", fontSize:11, color:"rgba(45,50,80,0.35)", letterSpacing:"0.04em" }}>
            by ARTHEMYSA
            <span style={{ display:"inline-block", width:4, height:4, borderRadius:"50%", background:"#5b9ea0", opacity:0.6, margin:"0 6px", verticalAlign:"middle" }} />
            {APP_VERSION}
          </footer>

        </div>
      </div>
    </main>
  );
}