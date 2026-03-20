import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const {
    email, setEmail,
    password, setPassword,
    remember, setRemember,
    loading, error,
    submit, clearError,
  } = useLogin({ onSuccess });

  const [showPassword, setShowPassword] = useState(false);

  const emailValido   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passLongitud  = password.length >= 8;
  const passMayuscula = /[A-Z]/.test(password);
  const passNumero    = /[0-9]/.test(password);
  const formValido    = emailValido && passLongitud && passMayuscula && passNumero;

  const CONDITIONS = [
    { ok: passLongitud,  label: "Mínimo 8 caracteres"   },
    { ok: passMayuscula, label: "Al menos una mayúscula" },
    { ok: passNumero,    label: "Al menos un número"     },
  ];

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" aria-label="Formulario de login">

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
        <input
          type="email"
          value={email}
          onChange={(e) => { clearError(); setEmail(e.target.value); }}
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className="
            w-full box-border rounded-xl px-[14px] py-[11px]
            text-[13px] font-['Raleway'] font-normal text-[#2d3250]
            bg-white border border-[#b0cfd0] outline-none
            placeholder:text-[rgba(91,122,138,0.45)]
            transition-[border-color,box-shadow] duration-150
            focus:border-[#5b9ea0] focus:shadow-[0_0_0_3px_rgba(91,158,160,0.15)]
          "
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-['Raleway'] text-[12px] font-semibold text-[#2d3250] mb-[6px] tracking-[0.02em]">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { clearError(); setPassword(e.target.value); }}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="
              w-full box-border rounded-xl px-[14px] py-[11px] pr-[48px]
              text-[13px] font-['Raleway'] font-normal text-[#2d3250]
              bg-white border border-[#b0cfd0] outline-none
              placeholder:text-[rgba(91,122,138,0.45)]
              transition-[border-color,box-shadow] duration-150
              focus:border-[#5b9ea0] focus:shadow-[0_0_0_3px_rgba(91,158,160,0.15)]
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              flex items-center justify-center w-[30px] h-[30px] rounded-lg
              bg-[#f0f4f8] border border-[#b0cfd0] text-[#5b7a8a]
              cursor-pointer touch-manipulation
              transition-[background,color] duration-150
              hover:bg-[#e0ecee] hover:text-[#2a6b6e]
            "
          >
            {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
          </button>
        </div>

        {/* Indicadores de condiciones */}
        {password.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            {CONDITIONS.map(({ ok, label }) => (
              <div key={label} className="flex items-center gap-[6px]">
                <span
                  className="w-[6px] h-[6px] rounded-full shrink-0 transition-colors duration-200"
                  style={{ background: ok ? "#2a6b6e" : "rgba(45,50,80,0.2)" }}
                />
                <span
                  className="font-['Raleway'] text-[11px] font-medium transition-colors duration-200"
                  style={{ color: ok ? "#2a6b6e" : "rgba(45,50,80,0.4)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="
            bg-transparent border-none
            font-['Raleway'] text-[12px] font-semibold text-[#2a6b6e]
            cursor-pointer touch-manipulation p-0
            transition-colors duration-150
            hover:text-[#5b9ea0]
          "
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón CTA */}
      <button
        type="submit"
        disabled={loading || !formValido}
        aria-label="Iniciar sesión"
        className="
          w-full py-[13px] rounded-xl
          text-[13px] font-['Raleway'] font-bold tracking-[0.1em] text-white
          bg-[#2a6b6e] border border-[rgba(91,158,160,0.4)]
          shadow-[0_4px_20px_rgba(42,107,110,0.25)]
          cursor-pointer touch-manipulation
          transition-all duration-[180ms]
          hover:not-disabled:bg-[#235b5e] hover:not-disabled:shadow-[0_6px_28px_rgba(42,107,110,0.40)] hover:not-disabled:-translate-y-px
          active:not-disabled:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <span className="w-[15px] h-[15px] rounded-full border-2 border-[rgba(255,255,255,0.35)] border-t-white animate-spin shrink-0" />
          )}
          {loading ? "Ingresando…" : "INICIAR SESIÓN"}
        </span>
      </button>

    </form>
  );
}