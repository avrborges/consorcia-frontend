import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getStoredUser } from "../features/auth/hooks/useLogin";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  FiDollarSign, FiMessageSquare, FiPieChart,
  FiFileText, FiAlertCircle, FiDownload,
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
   Indexado por consorcioId para simular
   datos distintos por consorcio
───────────────────────────────────────── */

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
function CardExpensaPersonal({ navigate, expensa: expensaProp, data }) {
  const e = expensaProp ?? data?.expensa;
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
function CardExpensaGlobal({ navigate, data }) {
  const e = data?.expensa;
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
function CardMensajes({ navigate, delay, data }) {
  const { sinLeer } = data?.mensajes;
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
function CardReclamos({ navigate, delay, data }) {
  const { abiertos } = data?.reclamos;
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
function CardEncuesta({ navigate, delay, data }) {
  const { titulo, vence, participantes } = data?.encuesta;
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
function CardDocumentos({ navigate, delay, data }) {
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiFileText} title="Documentos recientes" />
      <div>
        {data?.documentos.map((doc, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"11px 20px",
            borderBottom: i < data?.documentos.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none",
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

/* ─────────────────────────────────────────
   Componente principal
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate                   = useNavigate();
  const { consorcioId = "c1" }     = useOutletContext() ?? {};
  const storedUser                 = getStoredUser();
  const name                       = storedUser?.name ?? "Usuario";
  const role                       = storedUser?.role ?? "owner";
  const greeting                   = useMemo(() => getGreeting(), []);
  const date                       = useMemo(() => getFormattedDate(), []);
  const dateFormatted              = date.charAt(0).toUpperCase() + date.slice(1);

  /* Datos del consorcio activo via hook */
  const { data, unidades, loading } = useDashboardData(consorcioId, role);

  /* Selector de unidad */
  const [unidadId, setUnidadId]    = useState(null);

  // Inicializa la unidad activa cuando cargan los datos del consorcio
  useEffect(() => {
    if (unidades.length > 0) setUnidadId(unidades[0].id);
  }, [consorcioId, unidades]);

  const unidadActual               = unidades.find(u => u.id === unidadId) ?? unidades[0];
  const tieneMultipleUnidades      = role === "owner" && unidades.length > 1;

  if (loading || !data) return null;

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
        .unidad-tab {
          padding: 6px 14px; border-radius: 8px; border: none;
          font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; touch-action: manipulation; transition: all 0.18s;
          white-space: nowrap;
        }
        .unidad-tab.active {
          background: #2a6b6e; color: #ffffff;
          box-shadow: 0 2px 8px rgba(42,107,110,0.25);
        }
        .unidad-tab:not(.active) {
          background: transparent; color: rgba(45,50,80,0.45);
        }
        .unidad-tab:not(.active):hover { background: rgba(91,158,160,0.08); color: #2a6b6e; }
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
        {tieneMultipleUnidades && (
          <div style={{ background:"#ffffff", border:"1px solid #b0cfd0", borderRadius:14, padding:"12px 16px", boxShadow:"0 2px 8px rgba(45,50,80,0.06)", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", animation:"fadeUp 0.35s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}>
            <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:12, fontWeight:600, color:"#5b7a8a", whiteSpace:"nowrap", letterSpacing:"0.03em" }}>Unidad:</span>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", background:"rgba(45,50,80,0.04)", borderRadius:10, padding:4 }}>
              {unidades.map(u => (
                <button key={u.id} className={`unidad-tab ${u.id === unidadId ? "active" : ""}`} onClick={() => setUnidadId(u.id)}>{u.label}</button>
              ))}
            </div>
          </div>
        )}
        <CardExpensaPersonal navigate={navigate} expensa={unidadActual?.expensa} data={data} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2} data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* ── Inquilino ── */}
      {role === "tenant" && <>
        <CardExpensaPersonal navigate={navigate} data={data} />
        <CardMensajes navigate={navigate} delay={0.2} data={data} />
      </>}

      {/* ── Consejo ── */}
      {role === "council" && <>
        <CardExpensaGlobal   navigate={navigate} data={data} />
        <CardExpensaPersonal navigate={navigate} data={data} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* ── Administración ── */}
      {role === "admin" && <>
        <CardExpensaGlobal  navigate={navigate} data={data} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuesta   navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* Espaciado final — evita que el bottom nav tape el último elemento */}
      <div style={{ height:16 }} />

    </div>
  );
}