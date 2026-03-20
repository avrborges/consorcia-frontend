import React from "react";
import LoginTabs from "./LoginTabs";
import LoginForm from "./LoginForm";
import { APP_VERSION } from "./LoginConstants";

export default function LoginPanel({ activeTab, onTabSelect, onLoginSuccess, onForgotPassword }) {
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
        {/* Saludo — solo desktop */}
        <div className="hidden lg:block mb-7">
          <h2 className="font-['Urbanist'] font-extrabold text-[28px] text-[#2d3250] leading-[1.2] mb-[6px]">
            ¡Bienvenido<br />
            <span className="text-[#2a6b6e]">de nuevo!</span>
          </h2>
          <p className="font-['Raleway'] font-light text-[13px] text-[#5b7a8a] m-0">
            Ingresá tus datos para acceder a tu cuenta.
          </p>
        </div>

        {/* Tabs */}
        <LoginTabs activeTab={activeTab} onSelect={onTabSelect} />

        {/* Contenido según tab */}
        <div className="flex-1 lg:flex-none">
          {activeTab === "login" ? (
            <LoginForm
              onSuccess={onLoginSuccess}
              onForgotPassword={onForgotPassword}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-['Raleway'] text-[13px] text-[#5b7a8a] mb-4">
                El registro estará disponible próximamente.
              </p>
              <button
                type="button"
                onClick={() => onTabSelect("login")}
                className="
                  bg-transparent border-none
                  font-['Raleway'] text-[13px] font-semibold text-[#2a6b6e]
                  cursor-pointer touch-manipulation
                  transition-colors duration-150
                  hover:text-[#5b9ea0]
                "
              >
                ← Volver al login
              </button>
            </div>
          )}
        </div>

        {/* Footer mobile */}
        <footer className="lg:hidden text-center mt-auto pt-6 font-['Raleway'] text-[11px] text-[rgba(45,50,80,0.35)] tracking-[0.04em]">
          by ARTHEMYSA
          <span className="inline-block w-1 h-1 rounded-full bg-[#5b9ea0] opacity-60 mx-[6px] align-middle" />
          {APP_VERSION}
        </footer>
      </div>
    </div>
  );
}