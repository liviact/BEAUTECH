import { Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function Dashboard() {
  const usuario = obterUsuario() || {};
  const medico = usuario.tipo === 'medico';

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <p className="eyebrow">BEAUTECH</p>
          <h1>Olá! Seja bem-vindo.</h1>
          <p>Você está acessando a área {medico ? 'profissional' : 'do cliente'}.</p>
        </div>
        <div className="acoes">
          <Link to="/agendamentos/novo" className="card-acao"><strong>Novo Agendamento</strong><span>Marque seu atendimento.</span></Link>
          <Link to="/agendamentos" className="card-acao"><strong>Meus Agendamentos</strong><span>Veja seus horários.</span></Link>
          <Link to="/perfil" className="card-acao"><strong>Meu Perfil</strong><span>Consulte seus dados.</span></Link>
        </div>
      </div>
    </>
  );
}
