import { useCallback, useState } from "react";

/* ─────────────────────────────────────────
   Helpers de validación
───────────────────────────────────────── */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

function isValidPassword(value) {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value)
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─────────────────────────────────────────
   Tabla de credenciales mock
   Agregá o modificá entradas para testear
   distintos roles y escenarios.
───────────────────────────────────────── */
const MOCK_CREDENTIALS = [
  { email: "admin@consorcia.com",   password: "Admin123",   role: "admin",   name: "Administrador"   },
  { email: "council@consorcia.com", password: "Council1",   role: "council", name: "Consejo"         },
  { email: "owner@consorcia.com",   password: "Owner123",   role: "owner",   name: "Propietario"     },
  { email: "error@consorcia.com",   password: "Error123",   role: null,      name: null, forceError: "El servidor no está disponible. Intentá más tarde." },
];

/* ─────────────────────────────────────────
   Helpers de sesión — exportados para
   usar en guards y DashboardLayout
───────────────────────────────────────── */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem("consorcia_user")
             || sessionStorage.getItem("consorcia_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return (
    localStorage.getItem("consorcia_token") ||
    sessionStorage.getItem("consorcia_token") ||
    null
  );
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}

export function logout() {
  ["consorcia_token", "consorcia_user", "consorcia_auth_mode"].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/* ─────────────────────────────────────────
   Builders internos
───────────────────────────────────────── */
function buildMockUser(entry, email) {
  // Si el email no está en la tabla, genera un usuario owner genérico
  if (entry) {
    return {
      id:    "mock-" + Math.random().toString(16).slice(2),
      email: entry.email,
      name:  entry.name,
      role:  entry.role,
    };
  }
  return {
    id:    "mock-" + Math.random().toString(16).slice(2),
    email,
    name:  email.split("@")[0],
    role:  "owner",
  };
}

function buildMockToken(email) {
  // Token ficticio — NO usar en producción
  return "mock.jwt." + btoa(`${email}:${Date.now()}`);
}

/* ─────────────────────────────────────────
   Hook principal
───────────────────────────────────────── */
export function useLogin({ onSuccess } = {}) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const clearError = useCallback(() => setError(""), []);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();

      const trimmedEmail = email.trim();

      // 1) Validaciones — alineadas con LoginForm
      if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
        setError("Ingresá un email válido.");
        return;
      }
      if (!isValidPassword(password)) {
        setError("La contraseña debe tener 8 caracteres, una mayúscula y un número.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // 2) Simulación de latencia de red
        await sleep(800);

        // 3) Buscar en tabla mock
        const entry = MOCK_CREDENTIALS.find(
          (c) => c.email === trimmedEmail && c.password === password
        );

        // 4) Forzar error si la entrada lo indica
        if (entry?.forceError) {
          setError(entry.forceError);
          setLoading(false);
          return;
        }

        // 5) Credenciales incorrectas — email no encontrado o password mal
        const emailExists = MOCK_CREDENTIALS.some((c) => c.email === trimmedEmail);
        if (emailExists && !entry) {
          setError("Contraseña incorrecta. Revisá tus datos.");
          setLoading(false);
          return;
        }

        // 6) Construir sesión
        const user  = buildMockUser(entry, trimmedEmail);
        const token = buildMockToken(trimmedEmail);

        // 7) Persistencia según "recordarme"
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("consorcia_token",     token);
        storage.setItem("consorcia_user",      JSON.stringify(user));
        storage.setItem("consorcia_auth_mode", "mock");

        // 8) Callback post-login
        if (typeof onSuccess === "function") {
          onSuccess({ token, user, mode: "mock" });
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Ocurrió un error inesperado. Intentá de nuevo.");
      }
    },
    [email, password, remember, onSuccess]
  );

  return {
    email,    setEmail,
    password, setPassword,
    remember, setRemember,
    loading,
    error,
    clearError,
    submit,
  };
}