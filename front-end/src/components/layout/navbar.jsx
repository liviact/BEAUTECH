import { Link, useNavigate } from 'react-router-dom';
import { obterUsuario, removerUsuario } from '../../storage/usuario.storage.js';

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = obterUsuario() || {};
  function sair() { removerUsuario(); navigate('/'); }

  return <nav className="navbar"><Link to="/dashboard" className="logo">BEAUTECH</Link><div className="links"><Link to="/dashboard">Início</Link><Link to="/agendamentos">Agendamentos</Link><Link to="/perfil">Perfil</Link><span className="role">{usuario.tipo === 'medico' ? 'Médico' : 'Cliente'}</span><button onClick={sair} className="btn-sair">Sair</button></div></nav>;
}
