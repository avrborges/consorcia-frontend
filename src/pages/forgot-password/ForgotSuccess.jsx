import React from "react";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";

export default function ForgotSuccess({ email, onBack }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">

      {/* Ícono */}
      <div className="w-14 h-14 rounded-full bg-[rgba(42,107,110,0.10)] border border-[rgba(91,158,160,0.25)] flex items-center justify-center">
        <FiCheckCircle size={26} className="text-[#2a6b6e]" />
      </div>

      {/* Mensaje */}
      <div>
        <p className="font-['Raleway'] text-[14px] font-semibold text-[#2d3250] mb-1">
          ¡Listo! Revisá tu email
        </p>
        <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0">
          Si <strong className="font-semibold">{email}</strong> está registrado,
          recibirás el enlace en breve.
        </p>
      </div>

      {/* Volver */}
      <button
        type="button"
        onClick={onBack}
        className="
          mt-2 inline-flex items-center gap-[5px]
          bg-transparent border-none
          font-['Raleway'] text-[13px] font-semibold text-[#2a6b6e]
          cursor-pointer touch-manipulation
          transition-colors duration-150
          hover:text-[#5b9ea0]
        "
      >
        <FiArrowLeft size={13} />
        Volver al login
      </button>

    </div>
  );
}