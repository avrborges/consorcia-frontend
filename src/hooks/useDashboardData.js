import { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   Mock data por consorcio
   Reemplazar por llamadas a la API real
───────────────────────────────────────── */
const MOCK_DATA = {
  c1: {
    expensa: {
      periodo: "Mayo 2025", monto: 42500,
      vencimiento: "10/06/2025", estado: "pendiente",
      totalUnidades: 24, pagas: 18, pendientes: 5, vencidas: 1,
      montoUnitario: 42500,
      cobranzaAcumulada: 765000,
    },
    mensajes:  { sinLeer: 3 },
    reclamos:  {
      abiertos: 5,
      lista: [
        { id: 1, titulo: "Pérdida de agua en medianera",  estado: "abierto",     diasAbierto: 12 },
        { id: 2, titulo: "Luminaria fundida — hall PB",   estado: "en_gestion",  diasAbierto: 4  },
        { id: 3, titulo: "Portero eléctrico sin señal",   estado: "abierto",     diasAbierto: 1  },
      ],
    },
    encuesta: {
      titulo: "Pintura del pasillo", vence: "20/06/2025",
      estado: "activa", totalUnidades: 24, participantes: 14,
      opciones: [
        { label: "Blanco roto",   votos: 7 },
        { label: "Gris perla",    votos: 5 },
        { label: "Beige clásico", votos: 2 },
      ],
    },
    documentos: [
      { nombre: "Reglamento interno", fecha: "01/05/2025" },
      { nombre: "Acta reunión abril", fecha: "15/04/2025" },
    ],
    aprobaciones: [
      {
        id: 1,
        titulo: "Presupuesto impermeabilización terraza",
        monto: 380000,
        solicitante: "Administración",
        fecha: "08/06/2025",
        descripcion: "La terraza presenta filtraciones en el sector NE que afectan al depto 8A. Se solicita aprobación del presupuesto de Impermeabilizaciones Del Sur para iniciar trabajos en julio.",
        documentos: [
          { nombre: "Presupuesto_DelSur.pdf",   tipo: "pdf",   fecha: "07/06/2025" },
          { nombre: "Fotos_filtracion.jpg",      tipo: "img",   fecha: "06/06/2025" },
        ],
        presupuestos: [
          { proveedor: "Impermeabilizaciones Del Sur", monto: 380000, plazo: "10 días", garantia: "2 años" },
          { proveedor: "Tec-Obra S.R.L.",              monto: 425000, plazo: "7 días",  garantia: "1 año"  },
          { proveedor: "Grupo Construir",              monto: 360000, plazo: "15 días", garantia: "1 año"  },
        ],
        historial: [
          { fecha: "01/06/2025", evento: "Reclamo recibido — Depto 8A reporta humedad" },
          { fecha: "04/06/2025", evento: "Inspección técnica realizada por administración" },
          { fecha: "07/06/2025", evento: "3 presupuestos solicitados y recibidos" },
          { fecha: "08/06/2025", evento: "Solicitud enviada al Consejo para aprobación" },
        ],
        votos: { favor: 1, contra: 0, total: 3 },
      },
      {
        id: 2,
        titulo: "Contrato empresa de limpieza nueva",
        monto: null,
        solicitante: "Administración",
        fecha: "05/06/2025",
        descripcion: "El contrato vigente con CleanPro vence el 30/06. Se propone renovar con LimpiezaTotal S.A. que ofrece mejor precio y frecuencia diaria. Se adjunta comparativa y referencias.",
        documentos: [
          { nombre: "Contrato_LimpiezaTotal.pdf", tipo: "pdf", fecha: "04/06/2025" },
          { nombre: "Referencias_LimpiezaTotal.pdf", tipo: "pdf", fecha: "04/06/2025" },
        ],
        presupuestos: [
          { proveedor: "CleanPro (actual)",    monto: 85000,  plazo: "Mensual", garantia: "—" },
          { proveedor: "LimpiezaTotal S.A.",   monto: 72000,  plazo: "Mensual", garantia: "6 meses" },
        ],
        historial: [
          { fecha: "20/05/2025", evento: "Aviso de vencimiento de contrato CleanPro" },
          { fecha: "28/05/2025", evento: "Cotizaciones solicitadas a 2 proveedores" },
          { fecha: "04/06/2025", evento: "Propuesta de LimpiezaTotal recibida con referencias" },
          { fecha: "05/06/2025", evento: "Solicitud enviada al Consejo para aprobación" },
        ],
        votos: { favor: 0, contra: 0, total: 3 },
      },
    ],
  },
  c2: {
    expensa: {
      periodo: "Mayo 2025", monto: 55000,
      vencimiento: "15/06/2025", estado: "vencido",
      totalUnidades: 12, pagas: 8, pendientes: 2, vencidas: 2,
      montoUnitario: 55000,
      cobranzaAcumulada: 440000,
    },
    mensajes:  { sinLeer: 7 },
    reclamos:  {
      abiertos: 2,
      lista: [
        { id: 1, titulo: "Ascensor fuera de servicio",    estado: "en_gestion",  diasAbierto: 2  },
        { id: 2, titulo: "Humedad en cochera subsuelo",   estado: "abierto",     diasAbierto: 9  },
      ],
    },
    encuesta: {
      titulo: "Reglamento uso del SUM", vence: "25/06/2025",
      estado: "activa", totalUnidades: 12, participantes: 5,
      opciones: [
        { label: "Opción A — hasta 22hs", votos: 3 },
        { label: "Opción B — hasta 00hs", votos: 2 },
      ],
    },
    documentos: [
      { nombre: "Acta asamblea mayo", fecha: "10/05/2025" },
      { nombre: "Presupuesto 2025",   fecha: "02/01/2025" },
    ],
    aprobaciones: [
      {
        id: 1,
        titulo: "Reemplazo bomba de agua",
        monto: 145000,
        solicitante: "Administración",
        fecha: "10/06/2025",
        descripcion: "La bomba principal presenta fallas recurrentes desde abril. El técnico certificado recomienda reemplazo inmediato para evitar corte de servicio. Se adjunta informe técnico y presupuesto.",
        documentos: [
          { nombre: "Informe_tecnico_bomba.pdf", tipo: "pdf", fecha: "09/06/2025" },
          { nombre: "Presupuesto_Hidraulica.pdf", tipo: "pdf", fecha: "10/06/2025" },
        ],
        presupuestos: [
          { proveedor: "Hidráulica Martínez",  monto: 145000, plazo: "48hs", garantia: "1 año" },
          { proveedor: "AguaServ S.R.L.",      monto: 162000, plazo: "72hs", garantia: "1 año" },
        ],
        historial: [
          { fecha: "15/04/2025", evento: "Primera falla reportada por encargado" },
          { fecha: "02/06/2025", evento: "Falla recurrente — intervención de emergencia" },
          { fecha: "09/06/2025", evento: "Informe técnico emitido: reemplazo necesario" },
          { fecha: "10/06/2025", evento: "Solicitud enviada al Consejo para aprobación" },
        ],
        votos: { favor: 0, contra: 0, total: 3 },
      },
    ],
  },
  c3: {
    expensa: {
      periodo: "Mayo 2025", monto: 31000,
      vencimiento: "05/06/2025", estado: "pago",
      totalUnidades: 8, pagas: 7, pendientes: 1, vencidas: 0,
      montoUnitario: 31000,
      cobranzaAcumulada: 217000,
    },
    mensajes:  { sinLeer: 1 },
    reclamos:  {
      abiertos: 0,
      lista: [],
    },
    encuesta: {
      titulo: "Elección de administrador", vence: "30/06/2025",
      estado: "activa", totalUnidades: 8, participantes: 3,
      opciones: [
        { label: "Administración Gómez", votos: 2 },
        { label: "Administración López", votos: 1 },
      ],
    },
    documentos: [
      { nombre: "Reglamento de copropiedad", fecha: "15/03/2025" },
      { nombre: "Acta reunión marzo",        fecha: "20/03/2025" },
    ],
    aprobaciones: [],
  },
};

const MOCK_UNIDADES = {
  // Consorcio c1 — Edificio Las Acacias
  // Juan Pérez (owner): 3B y 7A
  // Laura Martínez (owner2): ninguna en c1
  c1: [
    { id:"3b", label:"Unidad 3B", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:42500, vencimiento:"10/06/2025", estado:"pendiente" } },
    { id:"7a", label:"Unidad 7A", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:38000, vencimiento:"10/06/2025", estado:"pago"      } },
    { id:"2c", label:"Unidad 2C", userId:"other",                expensa:{ periodo:"Mayo 2025", monto:41000, vencimiento:"10/06/2025", estado:"pago"      } },
  ],
  // Consorcio c2 — Torre San Martín
  // Juan Pérez (owner): 5D
  // Laura Martínez (owner2): ninguna en c2
  c2: [
    { id:"5d", label:"Unidad 5D", userId:"owner@consorcia.com",  expensa:{ periodo:"Mayo 2025", monto:55000, vencimiento:"15/06/2025", estado:"vencido"   } },
    { id:"1a", label:"Unidad 1A", userId:"other",                expensa:{ periodo:"Mayo 2025", monto:52000, vencimiento:"15/06/2025", estado:"pago"      } },
  ],
  // Consorcio c3 — Complejo Los Olivos
  // Laura Martínez (owner2): 4A
  c3: [
    { id:"4a", label:"Unidad 4A", userId:"owner2@consorcia.com",   expensa:{ periodo:"Mayo 2025", monto:31000, vencimiento:"05/06/2025", estado:"pago"      } },
    { id:"6b", label:"Unidad 6B", userId:"council2@consorcia.com", expensa:{ periodo:"Mayo 2025", monto:31000, vencimiento:"05/06/2025", estado:"pendiente" } },
  ],
};

/* ─────────────────────────────────────────
   Hook principal
   
   Uso:
     const { data, unidades, loading, error } = useDashboardData(consorcioId, role);
   
   Cuando conectes el backend:
   1. Reemplazá el bloque "MOCK" por fetch/axios
   2. El resto del componente no cambia
───────────────────────────────────────── */
export function useDashboardData(consorcioId, role, userEmail) {
  const [data,     setData]     = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!consorcioId) return;

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const mockData = MOCK_DATA[consorcioId] ?? MOCK_DATA["c1"];
      const todasUnidades = MOCK_UNIDADES[consorcioId] ?? [];

      // Para roles propietario/inquilino: filtrar solo sus unidades
      // Para admin/council: no aplica filtro de unidades
      const unidadesFiltradas = (role === "owner" || role === "tenant")
        ? todasUnidades.filter(u => u.userId === userEmail)
        : todasUnidades;

      setData(mockData);
      setUnidades(unidadesFiltradas);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [consorcioId, role, userEmail]);

  return { data, unidades, loading, error };
}