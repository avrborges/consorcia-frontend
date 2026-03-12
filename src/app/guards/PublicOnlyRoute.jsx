import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * PublicOnlyRoute (invertido)
 * - En mobile: NO bloquea /login (nunca redirige)
 * - En desktop: SI bloquea /login cuando hay sesión -> /dashboard
 *
 * Breakpoint: <= 900 (mismo que usás en DemoPage)
 * Sesión: sessionStorage (Opción 1)
 */
export default function PublicOnlyRoute({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const token = sessionStorage.getItem("consorcia_token");

  // ✅ SOLO DESKTOP redirige si ya hay sesión
  if (!isMobile && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ En mobile siempre permite ver el login
  return children;
}