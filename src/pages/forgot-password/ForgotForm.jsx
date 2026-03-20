import React from "react";
import { FiMail } from "react-icons/fi";

export default function ForgotForm({ email, setEmail, sending, error, onSubmit }) {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-[10px] px-[14px] py-[10px] bg-[#fee2e2] text-[#b91c1c] border border-[rgba(185,28,28,0.15)] font-['Raleway'] text-[13px]"
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block font-['Raleway'] text-[12px] font-semibold text-[#2d3250] mb-[6px] tracking-[0.02em]">
          Email
        </label>
        <div className="relative">
          <FiMail
            size={15}
            className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#5b9ea0] pointer-events-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            required
            className="
              w-full box-border rounded-xl pl-[40px] pr-[14px] py-[11px]
              text-[13px] font-['Raleway'] font-normal text-[#2d3250]
              bg-white border border-[#b0cfd0] outline-none
              placeholder:text-[rgba(91,122,138,0.45)]
              transition-[border-color,box-shadow] duration-150
              focus:border-[#5b9ea0] focus:shadow-[0_0_0_3px_rgba(91,158,160,0.15)]
            "
          />
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={sending || !emailValido}
        className="
          w-full mt-1 py-[13px] rounded-xl
          text-[13px] font-['Raleway'] font-bold tracking-[0.1em] text-white
          bg-[#2a6b6e] border border-[rgba(91,158,160,0.4)]
          shadow-[0_4px_20px_rgba(42,107,110,0.25)]
          cursor-pointer touch-manipulation
          transition-all duration-[180ms]
          hover:enabled:bg-[#235b5e] hover:enabled:shadow-[0_6px_28px_rgba(42,107,110,0.40)] hover:enabled:-translate-y-px
          active:enabled:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        <span className="flex items-center justify-center gap-2">
          {sending && (
            <span className="w-[15px] h-[15px] rounded-full border-2 border-[rgba(255,255,255,0.35)] border-t-white animate-spin shrink-0" />
          )}
          {sending ? "Enviando…" : "ENVIAR ENLACE"}
        </span>
      </button>

    </form>
  );
}