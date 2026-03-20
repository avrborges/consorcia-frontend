import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import ForgotForm from "./ForgotForm";
import ForgotSuccess from "./ForgotSuccess";

export default function ForgotPanel({
  email, setEmail,
  sending, sent, error,
  onSubmit, onBack,
}) {
  return (
    <div
      className="
        relative z-10 flex-1 flex flex-col
        px-6 pt-7 pb-8
        rounded-t-[28px] lg:rounded-none
        lg:w-[58%] lg:min-h-screen
        lg:items-center lg:justify-center
        lg:px-16 lg:py-12
      "
      style={{
        background: "#f0f4f8",
        backgroundImage: "radial-gradient(circle, rgba(42,107,110,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        animation: "fadeIn 0.5s 0.1s ease both",
      }}
    >
      <div
        className="w-full lg:max-w-[400px] flex flex-col flex-1 lg:flex-none"
        style={{ animation: "fadeUp 0.55s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Encabezado */}
        <div className="mb-7">
          <h2 className="font-['Urbanist'] font-extrabold text-[26px] text-[#2d3250] leading-[1.2] mb-[6px]">
            Recuperar<br />
            <span className="text-[#2a6b6e]">contraseña</span>
          </h2>
          <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0">
            {sent
              ? "Revisá tu casilla de correo."
              : "Ingresá tu email y te enviamos un enlace para restablecer tu contraseña."
            }
          </p>
        </div>

        {/* Contenido: formulario o confirmación */}
        {sent ? (
          <ForgotSuccess email={email} onBack={onBack} />
        ) : (
          <>
            <ForgotForm
              email={email}
              setEmail={setEmail}
              sending={sending}
              error={error}
              onSubmit={onSubmit}
            />

            {/* Volver al login */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={onBack}
                className="
                  inline-flex items-center gap-[5px]
                  bg-transparent border-none
                  font-['Raleway'] text-[12px] font-semibold text-[#5b7a8a]
                  cursor-pointer touch-manipulation
                  transition-colors duration-150
                  hover:text-[#2a6b6e]
                "
              >
                <FiArrowLeft size={12} />
                Volver al login
              </button>
            </div>
          </>
        )}

        {/* Footer mobile */}
        <footer className="lg:hidden text-center mt-auto pt-6 font-['Raleway'] text-[11px] text-[rgba(45,50,80,0.35)] tracking-[0.04em]">
          by ARTHEMYSA
          <span className="inline-block w-1 h-1 rounded-full bg-[#5b9ea0] opacity-60 mx-[6px] align-middle" />
          v1.0.0
        </footer>
      </div>
    </div>
  );
}