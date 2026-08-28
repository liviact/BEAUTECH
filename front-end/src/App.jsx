import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login.page.jsx';
import Cadastro from './pages/cadastro.page.jsx';
import Dashboard from './pages/dashboard.page.jsx';
import Perfil from './pages/perfil.page.jsx';
import EditarPerfil from './pages/editar_perfil.page.jsx';
import Agendamentos from './pages/agendamentos.page.jsx';
import NovoAgendamento from './pages/novo_agendamento.page.jsx';
import LoginMedico from './pages/loginMedico.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login-medico" element={<LoginMedico />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/perfil/editar" element={<EditarPerfil />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}