import { Routes, Route } from 'react-router-dom'

import Login from './pages/login.page'
import Cadastro from './pages/cadastro.page'
import Dashboard from './pages/dashboard.page'
import Perfil from './pages/perfil.page'
import EditarPerfil from './pages/editar_perfil.page'
import Agendamentos from './pages/agendamentos.page'
import NovoAgendamento from './pages/novo_agendamento.page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/perfil/editar" element={<EditarPerfil />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
    </Routes>
  )
}