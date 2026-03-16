import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../features/auth/hooks/useLogin";
import {
  FiDollarSign, FiMessageSquare, FiPieChart,
  FiFileText, FiAlertCircle, FiHome, FiPhone, FiDownload,
} from "react-icons/fi";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const ROLE_LABELS = {
  admin:   "Administrador",
  council: "Consejo",
  owner:   "Propietario",
  tenant:  "Inquilino",
};

/* ─────────────────────────────────────────
   Mock data — reemplazar por API
───────────────────────────────────────── */
const MOCK = {
  expensa: {
    periodo: "Mayo 2025", monto: 42500,
    vencimiento: "10/06/2025", estado: "pendiente",
    // Para admin — resumen global
    totalUnidades: 24, pagas: 18, pendientes: 5, vencidas: 1,
  },
  mensajes:   { sinLeer: 3 },
  reclamos:   { abiertos: 5 },
  encuesta:   { titulo: "Pintura del pasillo", vence: "20/06/2025", participantes: 8 },
  documentos: [
    { nombre: "Reglamento interno",  fecha: "01/05/2025" },
    { nombre: "Acta reunión abril",  fecha: "15/04/2025" },
  ],
  accesosRapidos: [
    { label: "Expensas",   icon: FiDollarSign,   path: "/expensas"   },
    { label: "Mensajes",   icon: FiMessageSquare, path: "/mensajes"   },
    { label: "Documentos", icon: FiFileText,      path: "/documentos" },
    { label: "Encuestas",  icon: FiPieChart,      path: "/encuestas"  },
    { label: "Reclamos",   icon: FiAlertCircle,   path: "/reclamos"   },
    { label: "Contactos",  icon: FiPhone,         path: "/contactos"  },
  ],
};

const ESTADO_CONFIG = {
  pago:      { label:"Pagado",    bg:"rgba(42,107,110,0.08)",  border:"rgba(42,107,110,0.2)",   color:"#2a6b6e", dot:"#2a6b6e" },
  pendiente: { label:"Pendiente", bg:"rgba(249,177,122,0.10)", border:"rgba(249,177,122,0.35)", color:"#c87941", dot:"#f9b17a" },
  vencido:   { label:"Vencido",   bg:"rgba(185,28,28,0.07)",   border:"rgba(185,28,28,0.2)",    color:"#b91c1c", dot:"#b91c1c" },
};

/* ─────────────────────────────────────────
   Sub-componentes de sección
───────────────────────────────────────── */

/* Card wrapper genérico */
function SectionCard({ children, delay = 0 }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #b0cfd0", borderRadius: 14,
      overflow: "hidden", boxShadow: "0 2px 8px rgba(45,50,80,0.06)",
      animation: `fadeUp 0.35s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
    }}>
      {children}
    </div>
  );
}

/* Header de card */
function CardHeader({ icon: Icon, title, right }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"13px 20px", borderBottom:"1px solid rgba(176,207,208,0.4)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <Icon size={14} color="#5b9ea0" />
        <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", letterSpacing:"0.02em" }}>
          {title}
        </span>
      </div>
      {right && <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:500, color:"#5b7a8a" }}>{right}</span>}
    </div>
  );
}

/* Expensa — vista propietario / inquilino */
function CardExpensaPersonal({ navigate }) {
  const e = MOCK.expensa;
  const estado = ESTADO_CONFIG[e.estado];
  const monto = new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(e.monto);
  return (
    <SectionCard delay={0.1}>
      <CardHeader icon={FiDollarSign} title="Expensa del mes" right={e.periodo} />
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:28, fontWeight:800, color:"#2d3250", margin:"0 0 4px", lineHeight:1 }}>{monto}</p>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5b7a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a" }}>Vence el {e.vencimiento}</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:20, background:estado.bg, border:`1px solid ${estado.border}`, fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:estado.color, letterSpacing:"0.05em", textTransform:"uppercase" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:estado.dot }} />
            {estado.label}
          </span>
          <button onClick={() => navigate("/expensas")} className="dash-cta">Ver detalle →</button>
        </div>
      </div>
    </SectionCard>
  );
}

/* Expensa — vista admin (resumen global) */
function CardExpensaGlobal({ navigate }) {
  const e = MOCK.expensa;
  const total = e.pagas + e.pendientes + e.vencidas;
  const pct   = Math.round((e.pagas / total) * 100);
  return (
    <SectionCard delay={0.1}>
      <CardHeader icon={FiDollarSign} title="Expensas — resumen global" right={e.periodo} />
      <div style={{ padding:"16px 20px" }}>
        {/* Barra de progreso */}
        <div style={{ display:"flex", gap:2, borderRadius:6, overflow:"hidden", height:8, marginBottom:14 }}>
          <div style={{ width:`${(e.pagas/total)*100}%`,     background:"#2a6b6e", transition:"width 0.5s" }} />
          <div style={{ width:`${(e.pendientes/total)*100}%`, background:"#f9b17a", transition:"width 0.5s" }} />
          <div style={{ width:`${(e.vencidas/total)*100}%`,   background:"#b91c1c", transition:"width 0.5s" }} />
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:14 }}>
          {[
            { label:"Pagas",     val:e.pagas,     color:"#2a6b6e" },
            { label:"Pendientes",val:e.pendientes, color:"#c87941" },
            { label:"Vencidas",  val:e.vencidas,   color:"#b91c1c" },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:s.color, flexShrink:0 }} />
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a" }}>{s.label}:</span>
              <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:13, fontWeight:700, color:s.color }}>{s.val}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a" }}>{pct}% cobrado de {total} unidades</span>
          <button onClick={() => navigate("/expensas")} className="dash-cta">Ver detalle →</button>
        </div>
      </div>
    </SectionCard>
  );
}

/* Mensajes sin leer */
function CardMensajes({ navigate, delay }) {
  const { sinLeer } = MOCK.mensajes;
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiMessageSquare} title="Mensajes" />
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(91,158,160,0.10)", border:"1px solid rgba(91,158,160,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiMessageSquare size={16} color="#5b9ea0" />
          </div>
          <div>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:20, fontWeight:800, color:"#2d3250", margin:0, lineHeight:1 }}>{sinLeer}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:"2px 0 0" }}>mensajes sin leer</p>
          </div>
        </div>
        <button onClick={() => navigate("/mensajes")} className="dash-cta">Ver →</button>
      </div>
    </SectionCard>
  );
}

/* Reclamos abiertos */
function CardReclamos({ navigate, delay }) {
  const { abiertos } = MOCK.reclamos;
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiAlertCircle} title="Reclamos" />
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(249,177,122,0.10)", border:"1px solid rgba(249,177,122,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiAlertCircle size={16} color="#c87941" />
          </div>
          <div>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:20, fontWeight:800, color:"#2d3250", margin:0, lineHeight:1 }}>{abiertos}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:"2px 0 0" }}>reclamos abiertos</p>
          </div>
        </div>
        <button onClick={() => navigate("/reclamos")} className="dash-cta">Ver →</button>
      </div>
    </SectionCard>
  );
}

/* Encuesta activa */
function CardEncuesta({ navigate, delay }) {
  const { titulo, vence, participantes } = MOCK.encuesta;
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiPieChart} title="Encuesta activa" />
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ minWidth:0 }}>
          <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:600, color:"#2d3250", margin:"0 0 4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{titulo}</p>
          <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a", margin:0 }}>{participantes} respuestas · vence {vence}</p>
        </div>
        <button onClick={() => navigate("/encuestas")} className="dash-cta">Participar →</button>
      </div>
    </SectionCard>
  );
}

/* Documentos recientes */
function CardDocumentos({ navigate, delay }) {
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiFileText} title="Documentos recientes" />
      <div>
        {MOCK.documentos.map((doc, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"11px 20px",
            borderBottom: i < MOCK.documentos.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
              <FiFileText size={13} color="#5b9ea0" style={{ flexShrink:0 }} />
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, color:"#2d3250", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.nombre}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0, marginLeft:12 }}>
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>{doc.fecha}</span>
              <button
                title="Descargar"
                style={{ background:"none", border:"none", padding:4, cursor:"pointer", color:"#5b9ea0", display:"flex", alignItems:"center", touchAction:"manipulation", transition:"color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color="#2a6b6e"}
                onMouseLeave={e => e.currentTarget.style.color="#5b9ea0"}
              >
                <FiDownload size={14} />
              </button>
            </div>
          </div>
        ))}
        <div style={{ padding:"10px 20px", borderTop:"1px solid rgba(176,207,208,0.3)" }}>
          <button onClick={() => navigate("/documentos")} style={{ background:"none", border:"none", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2a6b6e", cursor:"pointer", padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
            onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
          >Ver todos →</button>
        </div>
      </div>
    </SectionCard>
  );
}

/* Accesos rápidos — solo admin */
function CardAccesosRapidos({ navigate, delay }) {
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiHome} title="Accesos rápidos" />
      <div style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10 }}>
        {MOCK.accesosRapidos.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"16px 8px", borderRadius:12, background:"#f0f4f8", border:"1px solid #b0cfd0", cursor:"pointer", touchAction:"manipulation", transition:"background 0.15s, border-color 0.15s", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(91,158,160,0.10)"; e.currentTarget.style.borderColor="#5b9ea0"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#f0f4f8"; e.currentTarget.style.borderColor="#b0cfd0"; }}
          >
            <a.icon size={20} color="#5b9ea0" />
            {a.label}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────
   Componente principal
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate      = useNavigate();
  const storedUser    = getStoredUser();
  const name          = storedUser?.name ?? "Usuario";
  const role          = storedUser?.role ?? "owner";
  const greeting      = useMemo(() => getGreeting(), []);
  const date          = useMemo(() => getFormattedDate(), []);
  const dateFormatted = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <div style={{ minHeight:"100%", fontFamily:"'Raleway', sans-serif", display:"flex", flexDirection:"column", gap:16 }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .dash-cta {
          padding: 7px 14px; border-radius: 10px;
          background: #2a6b6e; border: none;
          font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 600;
          color: #ffffff; cursor: pointer; touch-action: manipulation;
          transition: background 0.15s; white-space: nowrap; flex-shrink: 0;
        }
        .dash-cta:hover { background: #235b5e; }
      `}</style>

      {/* ── Banner bienvenida — todos los roles ── */}
      <div style={{
        background: "#ffffff", border: "1px solid #b0cfd0", borderRadius: 14,
        padding: "14px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12,
        boxShadow: "0 2px 8px rgba(45,50,80,0.06)",
        animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:14, fontWeight:400, color:"#5b7a8a", whiteSpace:"nowrap" }}>{greeting},</span>
          <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:16, fontWeight:800, color:"#2d3250", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5b9ea0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:400, color:"#5b7a8a", whiteSpace:"nowrap" }}>{dateFormatted}</span>
        </div>
      </div>

      {/* ── Propietario ── */}
      {role === "owner" && <>
        <CardExpensaPersonal navigate={navigate} />
      </>}

      {/* ── Inquilino ── */}
      {role === "tenant" && <>
        <CardExpensaPersonal navigate={navigate} />
        <CardMensajes navigate={navigate} delay={0.2} />
      </>}

      {/* ── Consejo ── */}
      {role === "council" && <>
        <CardExpensaPersonal navigate={navigate} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2} />
          <CardMensajes navigate={navigate} delay={0.25} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuesta   navigate={navigate} delay={0.3} />
          <CardDocumentos navigate={navigate} delay={0.35} />
        </div>
      </>}

      {/* ── Administración ── */}
      {role === "admin" && <>
        <CardExpensaGlobal  navigate={navigate} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2} />
          <CardMensajes navigate={navigate} delay={0.25} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuesta   navigate={navigate} delay={0.3} />
          <CardDocumentos navigate={navigate} delay={0.35} />
        </div>
        <CardAccesosRapidos navigate={navigate} delay={0.4} />
      </>}

      {/* Espaciado final — evita que el bottom nav tape el último elemento */}
      <div style={{ height:16 }} />

    </div>
  );
}