import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("consorcia_token") ||
    sessionStorage.getItem("consorcia_token");

  // 🚫 No logueado → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logueado → renderiza
  return children;
}