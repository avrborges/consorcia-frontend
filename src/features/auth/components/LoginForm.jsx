import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm({ onSuccess, onBackHome, onRegister, onForgotPassword }) {
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    submit, clearError,
  } = useLogin({ onSuccess });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }} aria-label="Formulario de login">

      <style>{`
        .lf-input {
          width: 100%;
          box-sizing: border-box;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 13px;
          font-family: 'Raleway', sans-serif;
          font-weight: 400;
          color: #2d3250;
          background: #ffffff;
          border: 1px solid #b0cfd0;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lf-input::placeholder { color: rgba(91,122,138,0.45); }
        .lf-input:focus {
          border-color: #5b9ea0;
          box-shadow: 0 0 0 3px rgba(91,158,160,0.15);
        }
        .lf-label {
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #2d3250;
          margin-bottom: 6px;
          display: block;
          letter-spacing: 0.02em;
        }
        .lf-btn-cta {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-size: 13px;
          font-family: 'Raleway', sans-serif;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ffffff;
          background: #2a6b6e;
          border: 1px solid rgba(91,158,160,0.4);
          box-shadow: 0 4px 20px rgba(42,107,110,0.25);
          cursor: pointer;
          touch-action: manipulation;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
          position: relative;
          overflow: hidden;
        }
        .lf-btn-cta:hover:not(:disabled) {
          background: #235b5e;
          box-shadow: 0 6px 28px rgba(42,107,110,0.40);
          transform: translateY(-1px);
        }
        .lf-btn-cta:active:not(:disabled) { transform: scale(0.97); }
        .lf-btn-cta:disabled { opacity: 0.6; cursor: not-allowed; }

        .lf-btn-show {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #f0f4f8;
          border: 1px solid #b0cfd0;
          color: #5b7a8a;
          cursor: pointer;
          touch-action: manipulation;
          transition: background 0.15s, color 0.15s;
        }
        .lf-btn-show:hover { background: #e0ecee; color: #2a6b6e; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .lf-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            borderRadius: 10,
            padding: "10px 14px",
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid rgba(185,28,28,0.15)",
            fontFamily: "'Raleway', sans-serif",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="lf-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { clearError(); setEmail(e.target.value); }}
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className="lf-input"
        />
      </div>

      {/* Password */}
      <div>
        <label className="lf-label">Contraseña</label>
        <div style={{ position:"relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { clearError(); setPassword(e.target.value); }}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="lf-input"
            style={{ paddingRight: 48 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="lf-btn-show"
          >
            {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
          </button>
        </div>
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:-8 }}>
        <button
          type="button"
          onClick={onForgotPassword}
          style={{
            background: "none",
            border: "none",
            fontFamily: "'Raleway', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#2a6b6e",
            cursor: "pointer",
            touchAction: "manipulation",
            transition: "color 0.15s",
            padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#5b9ea0"}
          onMouseLeave={e => e.currentTarget.style.color = "#2a6b6e"}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón CTA */}
      <button
        type="submit"
        disabled={loading}
        aria-label="Iniciar sesión"
        className="lf-btn-cta"
      >
        <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loading && <span className="lf-spinner" />}
          {loading ? "Ingresando…" : "INICIAR SESIÓN"}
        </span>
      </button>

    </form>
  );
}