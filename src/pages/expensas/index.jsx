import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { getStoredUser } from "../../hooks/useLogin";
import { useExpensasData } from "../../hooks/useExpensasData";
import ExpensasHeader from "./ExpensasHeader";
import ExpensasFiltros from "./ExpensasFiltros";
import ExpensasSaldo from "./ExpensasSaldo";
import FilaExpensa from "./FilaExpensa";

export default function Expensas() {
  const outletContext = useOutletContext();
  const consorcioId   = outletContext?.consorcioId ?? "c1";
  const storedUser    = getStoredUser();
  const email         = storedUser?.email ?? "";

  const {
    historial,
    resumen,
    tendencias,
    itemMorosidad,
    ultimoPeriodoKey,
    loading,
    error,
    periodoToKey,
  } = useExpensasData(consorcioId, email);

  const [filtroEstado, setFiltroEstado] = useState("todas");
  useEffect(() => setFiltroEstado("todas"), [email, consorcioId]);

  const saldoEnRojo = resumen.vencidas > 0;

  const historialFiltrado = useMemo(() => {
    if (filtroEstado === "todas") return historial;
    if (filtroEstado === "pago")
      return historial.filter((e) =>
        ["pago", "pago_con_recargo", "vencido_pagado"].includes(e.estado)
      );
    return historial.filter((e) => e.estado === filtroEstado);
  }, [historial, filtroEstado]);

  const handlePaid = (id) => {
    console.log("Pago realizado:", id);
  };

  return (
    <div className="min-h-full font-['Raleway'] flex flex-col gap-5">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <ExpensasHeader vencidas={resumen.vencidas} />

      {/* Loading / Error */}
      {loading && (
        <div className="px-4 py-3 font-['Raleway'] text-[14px] text-[#5b7a8a]">
          Cargando expensas…
        </div>
      )}
      {error && (
        <div className="px-4 py-3 font-['Raleway'] text-[14px] text-[#b91c1c]">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filtros */}
          {historial.length > 0 && (
            <ExpensasFiltros
              filtroEstado={filtroEstado}
              setFiltroEstado={setFiltroEstado}
              resumen={resumen}
              total={historial.length}
            />
          )}

          {/* Saldo pendiente */}
          {historial.length > 0 && (
            <div className="grid gap-[10px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <ExpensasSaldo saldo={resumen.saldo} enRojo={saldoEnRojo} />
            </div>
          )}

          {/* Lista */}
          {historial.length === 0 ? (
            <div className="bg-white border border-[#b0cfd0] rounded-[16px] px-5 py-12 text-center">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(176,207,208,0.15)] border border-[rgba(176,207,208,0.3)] flex items-center justify-center mx-auto mb-[14px]">
                <FiCalendar size={22} color="#b0cfd0" />
              </div>
              <p className="font-['Urbanist'] text-[15px] font-bold text-[#2d3250] m-0 mb-1">Sin expensas</p>
              <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] m-0">
                No hay liquidaciones registradas para este consorcio.
              </p>
            </div>
          ) : historialFiltrado.length === 0 ? (
            <div className="bg-white border border-[#b0cfd0] rounded-[16px] px-5 py-[42px] text-center">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(91,158,160,0.10)] border border-[rgba(91,158,160,0.22)] flex items-center justify-center mx-auto mb-[14px]">
                <FiCalendar size={22} color="#5b9ea0" />
              </div>
              <p className="font-['Urbanist'] text-[15px] font-extrabold text-[#2d3250] m-0 mb-1">Sin resultados</p>
              <p className="font-['Raleway'] text-[12px] text-[#5b7a8a] m-0">
                No hay expensas para el filtro seleccionado.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[10px]">
              {historialFiltrado.map((exp, i) => {
                const isUltimoMes = periodoToKey(exp.periodo) === ultimoPeriodoKey;
                return (
                  <FilaExpensa
                    key={`${filtroEstado}-${exp.id}`}
                    exp={exp}
                    defaultOpen={isUltimoMes && i === 0}
                    index={i}
                    isUltimoMes={isUltimoMes}
                    onPaid={handlePaid}
                    tendencia={tendencias[exp.id] ?? null}
                    itemMorosidad={isUltimoMes ? itemMorosidad : null}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="h-4" />
    </div>
  );
}