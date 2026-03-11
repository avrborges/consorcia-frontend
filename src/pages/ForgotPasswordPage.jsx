import { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // ✅ Simulación sin backend
    await new Promise((r) => setTimeout(r, 900));

    setStatus("sent");
  };

  return (
    <main
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br from-[#0b1530] via-[#0f2044] to-[#0a1430]
        text-white
      "
    >
      <section className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl  p-6 ring-1 ring-white/15">
          <h1 className="text-2xl font-semibold !mb-4 !text-white/90">
            Recuperar contraseña
          </h1>

          <p className="text-sm !text-white/70 !mb-6">
            Ingresá tu email y te enviaremos instrucciones para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-white/80 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="tu@email.com"
                className="
                  w-full rounded-xl px-3 py-2.5
                  bg-white/10 border border-white/20
                  placeholder:text-white/40
                  focus:outline-none focus:ring-2 focus:ring-sky-500
                "
                required
              />
            </div>

            {/* Feedback */}
            {status === "error" && (
              <div className="text-sm text-red-300">
                Ingresá un email válido.
              </div>
            )}

            {status === "sent" && (
              <div className="text-sm text-emerald-300">
                Si el email existe, te enviaremos instrucciones en breve.
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="
                w-full rounded-xl py-3 font-semibold
                bg-gradient-to-r from-sky-500 to-blue-600
                transition-all
                hover:shadow-lg hover:-translate-y-[1px]
                active:scale-95
                disabled:opacity-60
              "
            >
              {status === "sending"
                ? "Enviando…"
                : "Enviar instrucciones"}
            </button>
          </form>

          {/* Back */}
            <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 text-white/65 mt-6 hover:text-white transition"
            >
            <IoChevronBackOutline className="text-lg" />
            <span>Volver</span>
            </button>
        </div>
      </section>
    </main>
  );
}