import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getStoredUser } from "../features/auth/hooks/useLogin";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  FiDollarSign, FiMessageSquare, FiPieChart,
  FiFileText, FiAlertCircle, FiDownload,
  FiCheckCircle, FiClock, FiXCircle,
  FiChevronDown, FiChevronUp, FiPaperclip, FiUsers,
  FiZap, FiPlus, FiEdit2, FiStopCircle,
  FiTrash2, FiUpload,
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

/* Expensa — vista admin/consejo (resumen global) */
function CardExpensaGlobal({ navigate, data }) {
  const e      = data?.expensa;
  const total  = e.pagas + e.pendientes + e.vencidas;
  const pct    = Math.round((e.pagas / total) * 100);
  const cobranza = new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(e.cobranzaAcumulada ?? 0);

  return (
    <SectionCard delay={0.1}>
      <CardHeader icon={FiDollarSign} title="Resumen del consorcio" right={e.periodo} />
      <div style={{ padding:"16px 20px" }}>

        {/* ── 4 mini-stats — 4 col desktop / 2x2 mobile ── */}
        <style>{`
          .resumen-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          @media (max-width: 480px) {
            .resumen-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
        <div className="resumen-grid">
          {/* Total unidades */}
          <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(91,158,160,0.07)", border:"1px solid rgba(91,158,160,0.18)" }}>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"#5b7a8a", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Unidades</p>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:22, fontWeight:800, color:"#2d3250", margin:0, lineHeight:1 }}>{total}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a", margin:"3px 0 0" }}>registradas</p>
          </div>
          {/* Pagas */}
          <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(42,107,110,0.07)", border:"1px solid rgba(42,107,110,0.18)" }}>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"#5b7a8a", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Al día</p>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:22, fontWeight:800, color:"#2a6b6e", margin:0, lineHeight:1 }}>{e.pagas}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a", margin:"3px 0 0" }}>{pct}% del total</p>
          </div>
          {/* Pendientes */}
          <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(249,177,122,0.08)", border:"1px solid rgba(249,177,122,0.25)" }}>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"#5b7a8a", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Pendientes</p>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:22, fontWeight:800, color:"#c87941", margin:0, lineHeight:1 }}>{e.pendientes}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a", margin:"3px 0 0" }}>sin abonar</p>
          </div>
          {/* Vencidas */}
          <div style={{ padding:"10px 14px", borderRadius:10, background: e.vencidas > 0 ? "rgba(185,28,28,0.06)" : "rgba(42,107,110,0.07)", border:`1px solid ${e.vencidas > 0 ? "rgba(185,28,28,0.18)" : "rgba(42,107,110,0.18)"}` }}>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:600, color:"#5b7a8a", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Vencidas</p>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:22, fontWeight:800, color: e.vencidas > 0 ? "#b91c1c" : "#2a6b6e", margin:0, lineHeight:1 }}>{e.vencidas}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a", margin:"3px 0 0" }}>{e.vencidas > 0 ? "requieren gestión" : "todo al día"}</p>
          </div>
        </div>

        {/* ── Barra de progreso ── */}
        <div style={{ marginBottom:10 }}>
          <div style={{ display:"flex", gap:2, borderRadius:6, overflow:"hidden", height:7, marginBottom:6 }}>
            <div style={{ width:`${(e.pagas/total)*100}%`,      background:"#2a6b6e", transition:"width 0.5s" }} />
            <div style={{ width:`${(e.pendientes/total)*100}%`, background:"#f9b17a", transition:"width 0.5s" }} />
            <div style={{ width:`${(e.vencidas/total)*100}%`,   background:"#b91c1c", transition:"width 0.5s" }} />
          </div>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {[
              { label:"Pagas",      val:e.pagas,      color:"#2a6b6e" },
              { label:"Pendientes", val:e.pendientes, color:"#c87941" },
              { label:"Vencidas",   val:e.vencidas,   color:"#b91c1c" },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:s.color, flexShrink:0 }} />
                <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>{s.label}:</span>
                <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color:s.color }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cobranza acumulada + CTA ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:"1px solid rgba(176,207,208,0.35)", flexWrap:"wrap", gap:10 }}>
          <div>
            <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Cobranza acumulada del mes </span>
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:14, fontWeight:800, color:"#2a6b6e" }}>{cobranza}</span>
          </div>
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
      <CardHeader icon={FiMessageSquare} title="Anuncios" />
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(91,158,160,0.10)", border:"1px solid rgba(91,158,160,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiMessageSquare size={16} color="#5b9ea0" />
          </div>
          <div>
            <p style={{ fontFamily:"'Urbanist', sans-serif", fontSize:20, fontWeight:800, color:"#2d3250", margin:0, lineHeight:1 }}>{sinLeer}</p>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:"2px 0 0" }}>anuncios sin leer</p>
          </div>
        </div>
        <button onClick={() => navigate("/anuncios")} className="dash-cta">Ver →</button>
      </div>
    </SectionCard>
  );
}

/* Reclamos abiertos — versión básica (owner/admin) */
function CardReclamos({ navigate, delay, data, title = "Reclamos" }) {
  const { abiertos } = data?.reclamos;
  return (
    <SectionCard delay={delay}>
      <CardHeader icon={FiAlertCircle} title={title} />
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
        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={() => navigate("/reclamos/nuevo")}
            style={{ padding:"7px 14px", borderRadius:10, border:"1.5px solid #2a6b6e", background:"transparent", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2a6b6e", cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background="#2a6b6e"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a6b6e"; }}
          >+ Nuevo</button>
          <button onClick={() => navigate("/reclamos")} className="dash-cta">Ver →</button>
        </div>
      </div>
    </SectionCard>
  );
}

/* Reclamos — versión Consejo con antigüedad */
function CardReclamosConsejo({ navigate, delay, data }) {
  const lista = data?.reclamos?.lista ?? [];

  const estadoConfig = {
    abierto:    { label: "Abierto",      color: "#c87941", bg: "rgba(249,177,122,0.12)", border: "rgba(249,177,122,0.3)" },
    en_gestion: { label: "En gestión",   color: "#2a6b6e", bg: "rgba(42,107,110,0.08)",  border: "rgba(42,107,110,0.2)"  },
  };

  const urgencyColor = (dias) => {
    if (dias >= 10) return "#b91c1c";
    if (dias >= 5)  return "#c87941";
    return "#5b7a8a";
  };

  return (
    <SectionCard delay={delay}>
      <CardHeader
        icon={FiAlertCircle}
        title="Reclamos"
        right={lista.length > 0 ? `${lista.length} abiertos` : "Sin reclamos"}
      />
      {lista.length === 0 ? (
        <div style={{ padding:"20px", textAlign:"center" }}>
          <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:0 }}>No hay reclamos abiertos 🎉</p>
        </div>
      ) : (
        <div>
          {lista.map((r, i) => {
            const est = estadoConfig[r.estado] ?? estadoConfig.abierto;
            return (
              <div key={r.id} style={{
                padding:"11px 20px",
                borderBottom: i < lista.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none",
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
              }}>
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", margin:"0 0 5px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {r.titulo}
                  </p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      padding:"2px 8px", borderRadius:20,
                      background: est.bg, border:`1px solid ${est.border}`,
                      fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:700,
                      color: est.color, letterSpacing:"0.04em", textTransform:"uppercase",
                    }}>
                      {r.estado === "en_gestion" ? <FiCheckCircle size={9}/> : <FiAlertCircle size={9}/>}
                      {est.label}
                    </span>
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      fontFamily:"'Raleway', sans-serif", fontSize:11,
                      color: urgencyColor(r.diasAbierto), fontWeight: r.diasAbierto >= 5 ? 600 : 400,
                    }}>
                      <FiClock size={10}/>
                      {r.diasAbierto === 1 ? "Hoy" : `${r.diasAbierto} días`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ padding:"10px 20px", borderTop:"1px solid rgba(176,207,208,0.3)" }}>
            <button onClick={() => navigate("/reclamos")} style={{ background:"none", border:"none", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2a6b6e", cursor:"pointer", padding:0 }}
              onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
              onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
            >Ver todos →</button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/* Aprobaciones pendientes — con expediente expandible */
function CardAprobaciones({ navigate, delay, data }) {
  const lista = data?.aprobaciones ?? [];
  const pendientes = lista.length;
  const [expandido, setExpandido]   = useState(null);   // id del item expandido
  const [revisado,  setRevisado]    = useState({});     // { [id]: true } — ya abrió el detalle
  const [votos,     setVotos]       = useState({});     // { [id]: 'favor' | 'contra' }

  const formatMonto = (m) => m
    ? new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(m)
    : null;

  const toggleExpandido = (id) => {
    const next = expandido === id ? null : id;
    setExpandido(next);
    if (next !== null) setRevisado(r => ({ ...r, [id]: true }));
  };

  const emitirVoto = (id, tipo) => setVotos(v => ({ ...v, [id]: tipo }));

  return (
    <SectionCard delay={delay}>
      <style>{`
        .doc-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 8px;
          border: 1px solid rgba(176,207,208,0.5);
          background: rgba(240,244,248,0.8);
          font-family: 'Raleway', sans-serif; font-size: 11px;
          font-weight: 500; color: #2d3250; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .doc-chip:hover { border-color: #5b9ea0; color: #2a6b6e; background: rgba(91,158,160,0.08); }
        .vote-btn-favor {
          flex: 1; padding: 7px 0; border-radius: 9px;
          border: 1.5px solid #2a6b6e; background: transparent;
          font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 700;
          color: #2a6b6e; cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .vote-btn-favor:hover, .vote-btn-favor.active {
          background: #2a6b6e; color: #fff;
        }
        .vote-btn-contra {
          flex: 1; padding: 7px 0; border-radius: 9px;
          border: 1.5px solid rgba(185,28,28,0.35); background: transparent;
          font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 700;
          color: #b91c1c; cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .vote-btn-contra:hover, .vote-btn-contra.active {
          background: rgba(185,28,28,0.08);
        }
        .vote-btn-favor:disabled, .vote-btn-contra:disabled {
          opacity: 0.35; cursor: not-allowed;
        }
        .hist-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #b0cfd0; flex-shrink: 0; margin-top: 4px;
        }
      `}</style>

      <CardHeader
        icon={FiCheckCircle}
        title="Aprobaciones pendientes"
        right={
          pendientes > 0
            ? <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:18, height:18, borderRadius:"50%", background:"#f9b17a", color:"#2d3250", fontFamily:"'Urbanist', sans-serif", fontSize:11, fontWeight:800 }}>{pendientes}</span>
            : null
        }
      />

      {pendientes === 0 ? (
        <div style={{ padding:"20px", textAlign:"center" }}>
          <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:0 }}>Sin aprobaciones pendientes ✓</p>
        </div>
      ) : (
        <div>
          {lista.map((item, i) => {
            const abierto    = expandido === item.id;
            const yaRevisado = revisado[item.id];
            const miVoto     = votos[item.id];
            const votosMock  = item.votos ?? { favor: 0, contra: 0, total: 3 };
            const totalFavor = votosMock.favor + (miVoto === "favor" ? 1 : 0);
            const tieneMayoria = totalFavor > votosMock.total / 2;

            return (
              <div key={item.id} style={{
                borderBottom: i < lista.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none",
              }}>

                {/* ── Cabecera del ítem ── */}
                <div style={{ padding:"13px 20px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:8 }}>
                    <div style={{ minWidth:0, flex:1 }}>
                      <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2d3250", margin:"0 0 3px", lineHeight:1.3 }}>{item.titulo}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        {formatMonto(item.monto) && (
                          <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color:"#2a6b6e" }}>{formatMonto(item.monto)}</span>
                        )}
                        <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>
                          {item.solicitante} · {item.fecha}
                        </span>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>
                          <FiPaperclip size={10}/>{item.documentos?.length ?? 0} docs
                        </span>
                      </div>
                    </div>
                    {/* Botón expandir */}
                    <button
                      onClick={() => toggleExpandido(item.id)}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"1px solid #b0cfd0", background: abierto ? "rgba(91,158,160,0.08)" : "transparent", fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:600, color: abierto ? "#2a6b6e" : "#5b7a8a", cursor:"pointer", flexShrink:0, transition:"all 0.15s" }}
                    >
                      {abierto ? <><FiChevronUp size={12}/> Cerrar</> : <><FiChevronDown size={12}/> Revisar</>}
                    </button>
                  </div>

                  {/* Indicador de votos */}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <FiUsers size={10} color="#5b7a8a"/>
                    <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>
                      {totalFavor} de {votosMock.total} votos a favor
                    </span>
                    {tieneMayoria && (
                      <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:700, color:"#2a6b6e", letterSpacing:"0.04em", textTransform:"uppercase" }}>· Mayoría alcanzada</span>
                    )}
                  </div>
                </div>

                {/* ── Panel de detalle expandible ── */}
                {abierto && (
                  <div style={{ borderTop:"1px solid rgba(176,207,208,0.3)", background:"rgba(240,244,248,0.5)" }}>

                    {/* Descripción */}
                    <div style={{ padding:"14px 20px 0" }}>
                      <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#5b7a8a", margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Descripción</p>
                      <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#2d3250", margin:0, lineHeight:1.6 }}>{item.descripcion}</p>
                    </div>

                    {/* Documentos adjuntos */}
                    <div style={{ padding:"12px 20px 0" }}>
                      <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#5b7a8a", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Documentos adjuntos</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {item.documentos?.map((doc, di) => (
                          <button key={di} className="doc-chip">
                            {doc.tipo === "pdf" ? <FiFileText size={11} color="#5b9ea0"/> : <FiDownload size={11} color="#5b9ea0"/>}
                            {doc.nombre}
                            <span style={{ color:"#5b7a8a", fontWeight:400 }}>· {doc.fecha}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Presupuestos comparativos */}
                    {item.presupuestos?.length > 0 && (
                      <div style={{ padding:"12px 20px 0" }}>
                        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#5b7a8a", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Presupuestos comparativos</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                          {item.presupuestos.map((p, pi) => {
                            const esMinimo = p.monto === Math.min(...item.presupuestos.map(x => x.monto));
                            return (
                              <div key={pi} style={{
                                display:"flex", alignItems:"center", justifyContent:"space-between",
                                padding:"8px 12px", borderRadius:8,
                                background: esMinimo ? "rgba(42,107,110,0.06)" : "rgba(255,255,255,0.7)",
                                border: `1px solid ${esMinimo ? "rgba(42,107,110,0.2)" : "rgba(176,207,208,0.3)"}`,
                                flexWrap:"wrap", gap:6,
                              }}>
                                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                  {esMinimo && <span style={{ fontSize:9, fontWeight:700, color:"#2a6b6e", textTransform:"uppercase", letterSpacing:"0.05em" }}>★ menor</span>}
                                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight: esMinimo ? 600 : 400, color:"#2d3250" }}>{p.proveedor}</span>
                                </div>
                                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                                  <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color: esMinimo ? "#2a6b6e" : "#2d3250" }}>{formatMonto(p.monto)}</span>
                                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Plazo: {p.plazo}</span>
                                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Garantía: {p.garantia}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Historial */}
                    {item.historial?.length > 0 && (
                      <div style={{ padding:"12px 20px 0" }}>
                        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#5b7a8a", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Historial</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:6, paddingLeft:4 }}>
                          {item.historial.map((h, hi) => (
                            <div key={hi} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                              <div className="hist-dot" />
                              <div>
                                <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a", marginRight:6 }}>{h.fecha}</span>
                                <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#2d3250" }}>{h.evento}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de voto */}
                    <div style={{ padding:"14px 20px" }}>
                      {!yaRevisado ? (
                        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a", margin:0, textAlign:"center" }}>Revisá la documentación antes de votar</p>
                      ) : miVoto ? (
                        <div style={{ padding:"8px 12px", borderRadius:9, background: miVoto === "favor" ? "rgba(42,107,110,0.08)" : "rgba(185,28,28,0.06)", border:`1px solid ${miVoto === "favor" ? "rgba(42,107,110,0.2)" : "rgba(185,28,28,0.2)"}`, textAlign:"center" }}>
                          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color: miVoto === "favor" ? "#2a6b6e" : "#b91c1c" }}>
                            {miVoto === "favor" ? "✓ Votaste a favor" : "✗ Votaste en contra"}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display:"flex", gap:8 }}>
                          <button className="vote-btn-favor" onClick={() => emitirVoto(item.id, "favor")}>
                            <FiCheckCircle size={12}/> Aprobar
                          </button>
                          <button className="vote-btn-contra" onClick={() => emitirVoto(item.id, "contra")}>
                            <FiXCircle size={12}/> Rechazar
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

/* Acciones rápidas — exclusivo Admin */
function CardAccionesRapidas({ navigate }) {
  const acciones = [
    {
      icon: FiPlus,
      label: "Nueva Expensa",
      desc: "Generar liquidación",
      path: "/expensas/nueva",
      color: "#2a6b6e",
      bg: "rgba(42,107,110,0.07)",
      border: "rgba(42,107,110,0.2)",
      hoverBg: "rgba(42,107,110,0.13)",
    },
    {
      icon: FiMessageSquare,
      label: "Nuevo Anuncio",
      desc: "Comunicar al consorcio",
      path: "/anuncios/nuevo",
      color: "#5b9ea0",
      bg: "rgba(91,158,160,0.07)",
      border: "rgba(91,158,160,0.2)",
      hoverBg: "rgba(91,158,160,0.13)",
    },
    {
      icon: FiAlertCircle,
      label: "Ver Reclamos",
      desc: "Gestionar pendientes",
      path: "/reclamos",
      color: "#c87941",
      bg: "rgba(249,177,122,0.08)",
      border: "rgba(249,177,122,0.25)",
      hoverBg: "rgba(249,177,122,0.16)",
    },
  ];

  return (
    <SectionCard delay={0.15}>
      <CardHeader icon={FiZap} title="Acciones rápidas" />
      <div style={{ padding:"14px 16px", display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
        {acciones.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            style={{
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:8, padding:"14px 8px", borderRadius:12,
              background: a.bg, border:`1px solid ${a.border}`,
              cursor:"pointer", transition:"all 0.18s", textAlign:"center",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = a.hoverBg; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(45,50,80,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = a.bg; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.7)", border:`1px solid ${a.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <a.icon size={16} color={a.color} />
            </div>
            <div>
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:700, color:"#2d3250", margin:"0 0 2px", lineHeight:1.2 }}>{a.label}</p>
              <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a", margin:0, lineHeight:1.2 }}>{a.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

/* Expensa personal — versión compacta (para Consejo al final) */
function CardExpensaPersonalCompacta({ navigate, expensa: expensaProp, data }) {
  const e = expensaProp ?? data?.expensa;
  const estado = ESTADO_CONFIG[e.estado];
  const monto = new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(e.monto);
  return (
    <SectionCard delay={0.45}>
      <div style={{
        padding:"12px 20px", display:"flex", alignItems:"center",
        justifyContent:"space-between", gap:12, flexWrap:"wrap",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"rgba(91,158,160,0.08)", border:"1px solid rgba(91,158,160,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiDollarSign size={15} color="#5b9ea0" />
          </div>
          <div>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a", margin:"0 0 1px", letterSpacing:"0.02em" }}>Mi expensa · {e.periodo}</p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:16, fontWeight:800, color:"#2d3250" }}>{monto}</span>
              <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:20, background:estado.bg, border:`1px solid ${estado.border}`, fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:700, color:estado.color, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:estado.dot }} />
                {estado.label}
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/expensas")} className="dash-cta">Ver detalle →</button>
      </div>
    </SectionCard>
  );
}

/* Encuesta activa — versión propietario/inquilino */
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

/* Encuesta — versión Consejo con resultados en tiempo real */
function CardEncuestaConsejo({ navigate, delay, data }) {
  const enc = data?.encuesta;
  if (!enc) return null;

  const { titulo, vence, estado, totalUnidades, participantes, opciones = [] } = enc;
  const pct = Math.round((participantes / totalUnidades) * 100);
  const totalVotos = opciones.reduce((s, o) => s + o.votos, 0);

  const OPCION_COLORS = ["#2a6b6e", "#5b9ea0", "#8ecfd1", "#b0cfd0"];

  const estadoBadge = {
    activa:   { label: "Activa",   bg: "rgba(42,107,110,0.08)",   border: "rgba(42,107,110,0.2)",   color: "#2a6b6e" },
    cerrada:  { label: "Cerrada",  bg: "rgba(91,122,138,0.08)",   border: "rgba(91,122,138,0.2)",   color: "#5b7a8a" },
    borrador: { label: "Borrador", bg: "rgba(249,177,122,0.10)",  border: "rgba(249,177,122,0.3)",  color: "#c87941" },
  };
  const badge = estadoBadge[estado] ?? estadoBadge.activa;

  return (
    <SectionCard delay={delay}>
      <CardHeader
        icon={FiPieChart}
        title="Encuesta activa"
        right={
          <span style={{
            padding:"2px 8px", borderRadius:20,
            background: badge.bg, border:`1px solid ${badge.border}`,
            fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:700,
            color: badge.color, letterSpacing:"0.04em", textTransform:"uppercase",
          }}>{badge.label}</span>
        }
      />
      <div style={{ padding:"14px 20px 0" }}>

        {/* Título + vencimiento */}
        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:600, color:"#2d3250", margin:"0 0 10px", lineHeight:1.3 }}>{titulo}</p>

        {/* Barra de participación */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
            <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Participación</span>
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color:"#2d3250" }}>
              {participantes} / {totalUnidades} unidades
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:400, color:"#5b7a8a" }}> · {pct}%</span>
            </span>
          </div>
          <div style={{ height:6, borderRadius:4, background:"rgba(176,207,208,0.3)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"#2a6b6e", borderRadius:4, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>
        </div>

        {/* Resultados por opción */}
        <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:14 }}>
          {opciones.map((op, i) => {
            const opPct = totalVotos > 0 ? Math.round((op.votos / totalVotos) * 100) : 0;
            const isLeader = op.votos === Math.max(...opciones.map(o => o.votos)) && op.votos > 0;
            const color = OPCION_COLORS[i % OPCION_COLORS.length];
            return (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
                    <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#2d3250", fontWeight: isLeader ? 600 : 400 }}>{op.label}</span>
                    {isLeader && <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:9, fontWeight:700, color:color, letterSpacing:"0.05em", textTransform:"uppercase" }}>· líder</span>}
                  </div>
                  <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:11, fontWeight:700, color:color }}>{op.votos} votos · {opPct}%</span>
                </div>
                <div style={{ height:4, borderRadius:3, background:"rgba(176,207,208,0.25)", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${opPct}%`, background:color, borderRadius:3, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer con acciones */}
      <div style={{ borderTop:"1px solid rgba(176,207,208,0.4)", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Vence {vence}</span>
        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={() => navigate("/encuestas/nueva")}
            style={{ padding:"6px 12px", borderRadius:8, border:"1.5px solid #b0cfd0", background:"transparent", fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:600, color:"#5b7a8a", cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#5b9ea0"; e.currentTarget.style.color="#2a6b6e"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#b0cfd0"; e.currentTarget.style.color="#5b7a8a"; }}
          >+ Nueva</button>
          <button onClick={() => navigate("/encuestas")} className="dash-cta">Ver resultados →</button>
        </div>
      </div>
    </SectionCard>
  );
}

/* Encuesta — versión Admin con controles operativos */
function CardEncuestaAdmin({ navigate, delay, data }) {
  const enc = data?.encuesta;
  if (!enc) return null;

  const { titulo, vence, estado, totalUnidades, participantes, opciones = [] } = enc;
  const pct        = Math.round((participantes / totalUnidades) * 100);
  const totalVotos = opciones.reduce((s, o) => s + o.votos, 0);
  const opcionLider = opciones.reduce((a, b) => b.votos > (a?.votos ?? -1) ? b : a, null);

  const estadoBadge = {
    activa:   { label: "Activa",   bg: "rgba(42,107,110,0.08)",  border: "rgba(42,107,110,0.2)",  color: "#2a6b6e" },
    cerrada:  { label: "Cerrada",  bg: "rgba(91,122,138,0.08)",  border: "rgba(91,122,138,0.2)",  color: "#5b7a8a" },
    borrador: { label: "Borrador", bg: "rgba(249,177,122,0.10)", border: "rgba(249,177,122,0.3)", color: "#c87941" },
  };
  const badge = estadoBadge[estado] ?? estadoBadge.activa;

  return (
    <SectionCard delay={delay}>
      <CardHeader
        icon={FiPieChart}
        title="Encuesta activa"
        right={
          <span style={{
            padding:"2px 8px", borderRadius:20,
            background: badge.bg, border:`1px solid ${badge.border}`,
            fontFamily:"'Raleway', sans-serif", fontSize:10, fontWeight:700,
            color: badge.color, letterSpacing:"0.04em", textTransform:"uppercase",
          }}>{badge.label}</span>
        }
      />
      <div style={{ padding:"14px 20px" }}>

        {/* Título */}
        <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:13, fontWeight:600, color:"#2d3250", margin:"0 0 12px", lineHeight:1.3 }}>{titulo}</p>

        {/* Barra de participación */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
            <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Participación</span>
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color:"#2d3250" }}>
              {participantes} / {totalUnidades}
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:400, color:"#5b7a8a" }}> · {pct}%</span>
            </span>
          </div>
          <div style={{ height:6, borderRadius:4, background:"rgba(176,207,208,0.3)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"#2a6b6e", borderRadius:4, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>
        </div>

        {/* Opción líder */}
        {opcionLider && totalVotos > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:10, background:"rgba(42,107,110,0.06)", border:"1px solid rgba(42,107,110,0.15)" }}>
            <FiCheckCircle size={13} color="#2a6b6e" style={{ flexShrink:0 }} />
            <div style={{ minWidth:0 }}>
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Opción líder · </span>
              <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:600, color:"#2d3250" }}>{opcionLider.label}</span>
            </div>
            <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:12, fontWeight:700, color:"#2a6b6e", marginLeft:"auto", flexShrink:0 }}>
              {Math.round((opcionLider.votos / totalVotos) * 100)}%
            </span>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid rgba(176,207,208,0.4)", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>Vence {vence}</span>
        <button onClick={() => navigate("/encuestas")} className="dash-cta">Gestionar →</button>
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

/* Documentos — versión Admin con subir y eliminar */
function CardDocumentosAdmin({ navigate, delay, data }) {
  const [docs, setDocs] = useState(data?.documentos ?? []);

  const eliminar = (i) => setDocs(prev => prev.filter((_, idx) => idx !== i));

  return (
    <SectionCard delay={delay}>
      <CardHeader
        icon={FiFileText}
        title="Documentos recientes"
        right={
          <button
            onClick={() => navigate("/documentos/subir")}
            style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:8, border:"1.5px solid #2a6b6e", background:"transparent", fontFamily:"'Raleway', sans-serif", fontSize:11, fontWeight:700, color:"#2a6b6e", cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#2a6b6e"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a6b6e"; }}
          >
            <FiUpload size={11}/> Subir
          </button>
        }
      />
      <div>
        {docs.length === 0 ? (
          <div style={{ padding:"20px", textAlign:"center" }}>
            <p style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, color:"#5b7a8a", margin:0 }}>No hay documentos cargados aún.</p>
          </div>
        ) : (
          docs.map((doc, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"11px 20px",
              borderBottom: i < docs.length - 1 ? "1px solid rgba(176,207,208,0.3)" : "none",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0, flex:1 }}>
                <FiFileText size={13} color="#5b9ea0" style={{ flexShrink:0 }} />
                <div style={{ minWidth:0 }}>
                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:500, color:"#2d3250", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{doc.nombre}</span>
                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:10, color:"#5b7a8a" }}>{doc.fecha}</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0, marginLeft:10 }}>
                {/* Descargar */}
                <button
                  title="Descargar"
                  style={{ background:"none", border:"none", padding:"5px 6px", borderRadius:7, cursor:"pointer", color:"#5b9ea0", display:"flex", alignItems:"center", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(91,158,160,0.1)"; e.currentTarget.style.color="#2a6b6e"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="#5b9ea0"; }}
                >
                  <FiDownload size={14} />
                </button>
                {/* Eliminar */}
                <button
                  title="Eliminar"
                  onClick={() => eliminar(i)}
                  style={{ background:"none", border:"none", padding:"5px 6px", borderRadius:7, cursor:"pointer", color:"#b0cfd0", display:"flex", alignItems:"center", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(185,28,28,0.07)"; e.currentTarget.style.color="#b91c1c"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="#b0cfd0"; }}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
        <div style={{ padding:"10px 20px", borderTop:"1px solid rgba(176,207,208,0.3)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:11, color:"#5b7a8a" }}>{docs.length} documento{docs.length !== 1 ? "s" : ""}</span>
          <button
            onClick={() => navigate("/documentos")}
            style={{ background:"none", border:"none", fontFamily:"'Raleway', sans-serif", fontSize:12, fontWeight:600, color:"#2a6b6e", cursor:"pointer", padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color="#5b9ea0"}
            onMouseLeave={e => e.currentTarget.style.color="#2a6b6e"}
          >Ver todos →</button>
        </div>
      </div>
    </SectionCard>
  );
}


export default function Dashboard() {
  const navigate                   = useNavigate();
  const outletContext              = useOutletContext();
  const consorcioId                = outletContext?.consorcioId ?? "c1";
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
      <style>{`
        .banner-bienvenida {
          background: #ffffff;
          border: 1px solid #b0cfd0;
          border-radius: 14px;
          padding: 14px 20px;
          box-shadow: 0 2px 8px rgba(45,50,80,0.06);
          animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .banner-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .banner-fecha {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .banner-bienvenida {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .banner-left {
            align-items: baseline;
            flex-wrap: wrap;
          }
          .banner-fecha {
            flex-shrink: unset;
          }
        }
      `}</style>
      <div className="banner-bienvenida">
        <div className="banner-left">
          <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:14, fontWeight:400, color:"#5b7a8a", whiteSpace:"nowrap" }}>{greeting},</span>
          <span style={{ fontFamily:"'Urbanist', sans-serif", fontSize:16, fontWeight:800, color:"#2d3250", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</span>
        </div>
        <div className="banner-fecha">
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
          <CardReclamos navigate={navigate} delay={0.2} data={data} title="Mis Reclamos / Pedidos" />
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
        <CardAprobaciones    navigate={navigate} delay={0.15} data={data} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamosConsejo navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes        navigate={navigate} delay={0.25} data={data} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuestaConsejo navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentos      navigate={navigate} delay={0.35} data={data} />
        </div>
        <CardExpensaPersonalCompacta navigate={navigate} data={data} />
      </>}

      {/* ── Administración ── */}
      {role === "admin" && <>
        <CardExpensaGlobal  navigate={navigate} data={data} />
        <CardAccionesRapidas navigate={navigate} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardReclamos navigate={navigate} delay={0.2}  data={data} />
          <CardMensajes navigate={navigate} delay={0.25} data={data} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          <CardEncuestaAdmin    navigate={navigate} delay={0.3}  data={data} />
          <CardDocumentosAdmin  navigate={navigate} delay={0.35} data={data} />
        </div>
      </>}

      {/* Espaciado final — evita que el bottom nav tape el último elemento */}
      <div style={{ height:16 }} />

    </div>
  );
}