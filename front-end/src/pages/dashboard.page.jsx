import { Link } from 'react-router-dom'
import Navbar from '../components/layout/navbar.jsx'

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Bem-vinda ao Beautéch</h1>

        <div className="acoes">
          <Link to="/agendamentos/novo" className="card-acao">
            Novo Agendamento
          </Link>

          <Link to="/agendamentos" className="card-acao">
            Meus Agendamentos
          </Link>

          <Link to="/perfil" className="card-acao">
            Meu Perfil
          </Link>
        </div>
      </div>
    </>
  )
}