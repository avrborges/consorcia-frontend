import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm({ onSuccess, onBackHome, onRegister, onForgotPassword }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    // remember,
    // setRemember,
    loading,
    error,
    submit,
    clearError,
  } = useLogin({ onSuccess });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={submit} className="space-y-4" aria-label="Formulario de login">
      {/* Error */}
      {error ? (
        <div
          className="
            rounded-xl px-3 py-2
            bg-red-500/15 text-red-100
            ring-1 ring-red-400/20
            text-sm
          "
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* Email */}
      <div className="space-y-1">
        <label className="text-white/80 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            clearError();
            setEmail(e.target.value);
          }}
          placeholder="tu@email.com"
          autoComplete="email"
          className="
            w-full rounded-xl
            bg-white/10 text-white
            placeholder:text-white/45
            border border-white/15
            px-3 py-2.5
            outline-none
            transition
            focus:border-sky-400/60
            focus:ring-4 focus:ring-sky-400/20
          "
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-white/80 text-sm font-medium">Contraseña</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              clearError();
              setPassword(e.target.value);
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            className="
              w-full rounded-xl
              bg-white/10 text-white
              placeholder:text-white/45
              border border-white/15
              px-3 py-2.5 pr-12
              outline-none
              transition
              focus:border-sky-400/60
              focus:ring-4 focus:ring-sky-400/20
            "
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              px-2 py-1 rounded-lg
              text-white/70 text-xs font-semibold
              bg-white/10 hover:bg-white/15
              transition
              focus:outline-none focus:ring-2 focus:ring-sky-400/40
            "
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {/* Remember */}
      <div className="flex items-center justify-center">
        {/* <label className="flex items-center gap-2 text-white/75 text-sm select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="
              h-4 w-4 rounded
              border-white/30 bg-white/10
              text-sky-500
              focus:ring-4 focus:ring-sky-400/20
            "
          />
          Recordarme
        </label> */}

        {/* Placeholder sin backend: link informativo */}
        <span className="text-white/55 text-center gap-1.5 text-sm w-full">
          ¿Olvidaste tu contraseña?{" "}
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            Recuperala
          </button>
        </span>
      </div>

      {/* CTA con micro-interacciones */}
      <button
        type="submit"
        disabled={loading}
        aria-label="Iniciar sesión"
        className="
          group relative overflow-hidden
          w-full rounded-xl
          px-6 py-3
          font-semibold text-white tracking-wide
          bg-gradient-to-r from-sky-500 to-blue-600
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
          transition-all duration-300 ease-out

          hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]
          hover:-translate-y-[1px]
          active:scale-[0.98]

          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none
          focus-visible:ring-4 focus-visible:ring-[rgba(14,165,160,0.35)]
          will-change-transform
        "
      >
        {/* Shine overlay */}
        <span
          aria-hidden="true"
          className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.18)_35%,transparent_70%)]
          "
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <span
              className="
                h-4 w-4 animate-spin rounded-full
                border-2 border-white border-t-transparent
              "
            />
          )}
          {loading ? "Ingresando…" : "INICIAR SESIÓN"}
        </span>
      </button>

      {/* Secondary actions */}
      <div className="pt-1 flex items-center justify-between text-sm">

        <button
        type="button"
        onClick={onBackHome}
        className="flex items-center gap-1 text-white/65 hover:text-white transition"
        >
        <IoChevronBackOutline className="text-lg" />
        <span>Volver</span>
        </button>


        <p className="!text-white/70">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="
              font-semibold text-amber-400
              hover:text-amber-300
              transition
            "
          >
            Registrate
          </button>
        </p>
      </div>

      {/* Hint (demo credentials)
      <div className="pt-2 text-xs text-white/50 leading-relaxed">
        Tip demo: cualquier email válido y contraseña ≥ 4 caracteres.
      </div> */}
    </form>
  );
}