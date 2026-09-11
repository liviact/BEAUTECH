import { Navigate, Outlet } from 'react-router-dom';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function ProtectedRoute({ allowedRoles }) {
  const usuario = obterUsuario();

  if (!usuario) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(usuario.tipo)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
