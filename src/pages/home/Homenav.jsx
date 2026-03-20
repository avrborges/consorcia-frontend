import React from "react";
import { FiArrowRight } from "react-icons/fi";
import logoConsorcia from "../../assets/img/consorcia.png";

export default function HomeNav({ onLogin, onRegister }) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logoConsorcia} alt="Logo CONSORCIA" className="w-9 h-9 select-none" />
        <span className="font-['Urbanist'] font-extrabold text-xl text-[#f0f4f8] tracking-[0.15em]">
          CONSOR<span className="text-[#f9b17a]">CIA</span>
        </span>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLogin}
          className="
            px-[22px] py-[9px] rounded-[10px]
            bg-[rgba(91,158,160,0.08)] border border-[rgba(91,158,160,0.2)]
            text-[#8ecfd1] text-[13px] font-['Raleway'] font-semibold
            cursor-pointer touch-manipulation
            transition-all duration-[180ms]
            hover:bg-[rgba(91,158,160,0.16)] hover:border-[rgba(91,158,160,0.4)] hover:-translate-y-px
            active:scale-[0.97]
          "
        >
          Iniciar sesión
        </button>
        <button
          onClick={onRegister}
          className="
            flex items-center gap-[6px]
            px-[22px] py-[9px] rounded-[10px]
            bg-[#2a6b6e] border border-[rgba(91,158,160,0.4)]
            text-white text-[13px] font-['Raleway'] font-semibold
            cursor-pointer touch-manipulation
            transition-all duration-[180ms]
            hover:bg-[#235b5e] hover:shadow-[0_8px_32px_rgba(42,107,110,0.45)] hover:-translate-y-px
            active:scale-[0.97]
          "
        >
          Registrarse <FiArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
}