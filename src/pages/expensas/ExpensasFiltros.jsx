import React from "react";

export default function ExpensasFiltros({ filtroEstado, setFiltroEstado, resumen, total }) {
  const FILTROS = [
    { key: "todas",                label: "Todas",                   count: total                    },
    { key: "pendiente",            label: "Pendientes",              count: resumen.pendientes       },
    { key: "vencido",              label: "Vencidas",                count: resumen.vencidas         },
    { key: "parcial",              label: "Parciales",               count: resumen.parciales        },
    { key: "pendiente_validacion", label: "Pendiente validación",    count: resumen.pendienteValidacion },
    { key: "comprobante_rechazado",label: "Comprobante rechazado",   count: resumen.rechazados       },
    { key: "pago",                 label: "Pagadas",                 count: resumen.pagas            },
  ].filter((f) => f.key === "todas" || f.count > 0);

  return (
    <div className="flex flex-wrap gap-2">
      {FILTROS.map((f) => {
        const active = filtroEstado === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => setFiltroEstado(f.key)}
            aria-pressed={active}
            className={`
              inline-flex items-center gap-2
              px-3 py-[7px] rounded-full border
              cursor-pointer touch-manipulation
              transition-all duration-150
              hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(45,50,80,0.06)]
              active:translate-y-0
              ${active
                ? "border-[rgba(91,158,160,0.35)] bg-[rgba(91,158,160,0.06)]"
                : "border-[rgba(176,207,208,0.55)] bg-[rgba(255,255,255,0.65)]"
              }
            `}
          >
            <span
              className={`font-['Raleway'] text-[11px] font-bold ${active ? "text-[#2d3250]" : "text-[#5b7a8a]"}`}
            >
              {f.label}
            </span>
            <span className="font-['Urbanist'] text-[12px] font-black text-[#2d3250]">
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}