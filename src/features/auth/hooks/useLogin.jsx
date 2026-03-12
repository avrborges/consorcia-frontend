import { useCallback, useState } from "react";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildMockUser(email) {
  const lower = email.toLowerCase();

  // Mini heurística para pruebas locales (sin backend):
  // - admin@... => role "admin"
  // - council@... => role "council"
  // - owner@... => role "owner"
  // - default => "owner"
  let role = "owner";
  if (lower.startsWith("admin@")) role = "admin";
  if (lower.startsWith("council@")) role = "council";
  if (lower.startsWith("owner@")) role = "owner";

  return {
    id: "mock-" + Math.random().toString(16).slice(2),
    email,
    name: email.split("@")[0],
    role,
  };
}

function buildMockToken(email) {
  // Token ficticio (NO seguro). Solo para desarrollo sin backend.
  return "mock.jwt." + btoa(`${email}:${Date.now()}`);
}

export function useLogin({ onSuccess } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();

      const trimmedEmail = email.trim();

      // 1) Validaciones UI
      if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
        setError("Ingresá un email válido.");
        return;
      }

      if (!password || password.length < 4) {
        setError("Ingresá una contraseña (mínimo 4 caracteres).");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // 2) Simulación de red
        await sleep(800);

        // 3) Simulación de un error común (para testear)
        // si la contraseña es "0000" => error
        if (password === "0000") {
          setError("Credenciales incorrectas (demo). Probá otra contraseña.");
          setLoading(false);
          return;
        }

        // 4) Crear user/token mock
        const user = buildMockUser(trimmedEmail);
        const token = buildMockToken(trimmedEmail);

        // 5) Persistencia
        const storage = sessionStorage;
        storage.setItem("consorcia_token", token);
        storage.setItem("consorcia_user", JSON.stringify(user));
        storage.setItem("consorcia_auth_mode", "mock");

        // 6) Callback post-login
        if (typeof onSuccess === "function") {
          onSuccess({ token, user, mode: "mock" });
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Ocurrió un error inesperado en el login (demo).");
      }
    },
    [email, password, onSuccess]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    // remember,
    // setRemember,
    loading,
    error,
    clearError,
    submit,
  };
}