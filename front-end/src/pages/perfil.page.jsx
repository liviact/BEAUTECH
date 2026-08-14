import { Link } from 'react-router-dom'
import Navbar from '../components/layout/navbar.jsx'
import Card from '../components/shared/card.jsx'
import { obterUsuario } from '../storage/usuario.storage'

export default function Perfil() {
  const usuario = obterUsuario() || {}

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Meu Perfil</h1>

        <Card>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>E-mail:</strong> {usuario.email}</p>
          <p><strong>Telefone:</strong> {usuario.telefone}</p>

          <br />

          <Link to="/perfil/editar" className="btn-link">
            Editar Perfil
          </Link>
        </Card>
      </div>
    </>
  )
}