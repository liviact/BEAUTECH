import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth.page.jsx';
import Medicos from './pages/medicos.page.jsx';
import MedicoPerfil from './pages/medico-perfil.page.jsx';
import Dashboard from './pages/dashboard.page.jsx';
import Perfil from './pages/perfil.page.jsx';
import EditarPerfil from './pages/editar_perfil.page.jsx';
import Agendamentos from './pages/agendamentos.page.jsx';
import NovoAgendamento from './pages/novo_agendamento.page.jsx';
import ReagendarAgendamento from './pages/reagendar_agendamento.page.jsx';
import MeusProcedimentos from './pages/meus_procedimentos.page.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/medicos" element={<Medicos />} />
      <Route path="/medicos/:id" element={<MedicoPerfil />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<EditarPerfil />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
        <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
        <Route path="/agendamentos/:id/reagendar" element={<ReagendarAgendamento />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['medico']} />}>
        <Route path="/meus-procedimentos" element={<MeusProcedimentos />} />
      </Route>

      <Route path="/cadastro" element={<Navigate to="/?modo=cadastro" replace />} />
      <Route path="/login-medico" element={<Navigate to="/?tipo=medico" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
