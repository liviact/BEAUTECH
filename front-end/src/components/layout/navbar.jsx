import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  function sair() {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <h2>Beautéch</h2>

      <div className="links">
        <Link to="/dashboard">Início</Link>
        <Link to="/agendamentos">Agendamentos</Link>
        <Link to="/perfil">Perfil</Link>
        <button onClick={sair}>Sair</button>
      </div>
    </nav>
  )
}