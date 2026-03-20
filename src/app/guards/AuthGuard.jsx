import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../hooks/useLogin";

export default function AuthGuard({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}