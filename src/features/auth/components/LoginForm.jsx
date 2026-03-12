import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm({ onSuccess, onBackHome, onRegister, onForgotPassword }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    submit,
    clearError,
  } = useLogin({ onSuccess });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={submit} className="space-y-4" aria-label="Formulario de login">

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl px-3 py-2.5 text-sm"
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid rgba(185,28,28,0.15)",
          }}
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-[#0F2044] text-[13px] font-semibold">
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
            w-full rounded-xl
            px-3 py-2.5
            text-[#0F2044] text-[13px]
            placeholder:text-[#4A5A7A]/50
            outline-none
            transition duration-150
            focus:ring-2 focus:ring-[#0EA5A0]/40
          "
          style={{
            background: "#ffffff",
            border: "1px solid #C8D4EE",
          }}
          onFocus={e => e.target.style.borderColor = "#0EA5A0"}
          onBlur={e => e.target.style.borderColor = "#C8D4EE"}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-[#0F2044] text-[13px] font-semibold">
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
              w-full rounded-xl
              px-3 py-2.5 pr-20
              text-[#0F2044] text-[13px]
              placeholder:text-[#4A5A7A]/50
              outline-none
              transition duration-150
              focus:ring-2 focus:ring-[#0EA5A0]/40
            "
            style={{
              background: "#ffffff",
              border: "1px solid #C8D4EE",
            }}
            onFocus={e => e.target.style.borderColor = "#0EA5A0"}
            onBlur={e => e.target.style.borderColor = "#C8D4EE"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              px-2.5 py-1 rounded-lg
              text-[#4A5A7A] text-[11px] font-semibold
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#0EA5A0]
            "
            style={{
              background: "#F0F4FF",
              border: "1px solid #C8D4EE",
              touchAction: "manipulation",
            }}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="
            text-[13px] font-semibold
            text-[#1A4DB5] hover:text-[#0EA5A0]
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-[#0EA5A0] rounded-sm
          "
          style={{ touchAction: "manipulation" }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón CTA */}
      <button
        type="submit"
        disabled={loading}
        aria-label="Iniciar sesión"
        className="
          group relative overflow-hidden
          w-full rounded-xl
          px-6 py-[13px]
          font-semibold text-white
          text-[13px] tracking-[0.12em]
          transition-[transform,box-shadow] duration-200 ease-out
          hover:-translate-y-px
          active:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#0EA5A0]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#F0F4FF]
        "
        style={{
          background: "#1A4DB5",
          border: "1px solid rgba(26,77,181,0.35)",
          boxShadow: "0 4px 20px rgba(26,77,181,0.25)",
          touchAction: "manipulation",
        }}
        onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 6px 28px rgba(26,77,181,0.35)")}
        onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,77,181,0.25)")}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {loading ? "Ingresando…" : "INICIAR SESIÓN"}
        </span>
      </button>

    </form>
  );
}