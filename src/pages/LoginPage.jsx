import React from "react";
import { useNavigate } from "react-router-dom";
import logoConsorcia from "../assets/img/consorcia.png";
import LoginForm from "../features/auth/components/LoginForm";

const APP_VERSION = "v1.0.0";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <main
      className="
        min-h-screen relative overflow-hidden
        flex items-center justify-center
        px-6
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        bg-[radial-gradient(1200px_600px_at_-10%_-10%,#1a4db5_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#0ea5a0_0%,transparent_55%),linear-gradient(135deg,#0b1530_0%,#0f2044_45%,#0a1430_100%)]
      "
      aria-label="Página de inicio de sesión"
    >
      {/* Textura suave */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.06),transparent_60%)]
        "
      />

      <section className="relative z-10 w-full max-w-[420px]">
        {/* Branding (coherente con Home) */}
        <div className="text-center mb-5">
          <img
            src={logoConsorcia}
            alt="Logo CONSORCIA"
            className="w-[52px] max-w-full mx-auto mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          />

          <h1 className="!text-white font-extrabold text-[20px] tracking-[0.45em] leading-tight">
            CONSOR<span className="text-amber-400">CIA</span>
          </h1>

          <p className="!mt-2 !text-white/75 text-[12px] uppercase tracking-[0.18em]">
            Acceso a tu consorcio
          </p>
        </div>

        {/* Card / Panel */}
        <div
          className="
            rounded-2xl
            bg-white/8 backdrop-blur-xl
            ring-1 ring-white/15
            p-6
          "
        >
          <LoginForm
            onSuccess={() => navigate("/dashboard")}
            onBackHome={() => navigate("/")}
            onForgotPassword={() => navigate("/forgot-password")}
            // Si aún no creaste RegisterPage, podés dejarlo apuntando a "/"
            onRegister={() => navigate("/")}
          />
        </div>

        {/* Footer mini */}
        <div className="text-center !mt-8 !text-white/45 text-xs leading-relaxed">
          <div>by ARTHEMYSA</div>
          <div className="!mt-0.5 tracking-wide">{APP_VERSION}</div>
        </div>
      </section>
    </main>
  );
}