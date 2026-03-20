import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBranding from "../login/LoginBranding";
import ForgotPanel from "./ForgotPanel";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  const handleEmailChange = (val) => {
    setError("");
    setEmail(val);
  };

  return (
    <main
      className="
        min-h-screen relative overflow-hidden
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        flex flex-col lg:flex-row
      "
      style={{ background: "#1a1f3e", fontFamily: "'Raleway', system-ui, sans-serif" }}
      aria-label="Recuperar contraseña"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800&family=Raleway:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(7deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(16px) rotate(-5deg); } }
      `}</style>

      {/* Glow blobs globales */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-[10%] -right-[5%] rounded-full bg-[radial-gradient(circle,rgba(42,107,110,0.15)_0%,transparent_70%)]" />
        <div className="absolute w-[400px] h-[400px] -bottom-[8%] -left-[6%] rounded-full bg-[radial-gradient(circle,rgba(249,177,122,0.08)_0%,transparent_70%)]" />
      </div>

      <LoginBranding onBack={() => navigate("/login")} />

      <ForgotPanel
        email={email}
        setEmail={handleEmailChange}
        sending={sending}
        sent={sent}
        error={error}
        onSubmit={handleSubmit}
        onBack={() => navigate("/login")}
      />
    </main>
  );
}