import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterUsuario, removerUsuario } from '../../storage/usuario.storage.js';
import ThemeToggle from '../shared/ThemeToggle.jsx';

export default function Navbar({ publicOnly = false }) {
  const navigate = useNavigate();
  const usuario = publicOnly ? null : obterUsuario();
  const [menuAberto, setMenuAberto] = useState(false);

  function sair() {
    removerUsuario();
    setMenuAberto(false);
    navigate('/');
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <nav className="navbar">
      <Link
        to={usuario ? (usuario.tipo === 'admin' ? '/admin' : '/dashboard') : '/'}
        className="logo"
        onClick={fecharMenu}
      >
        BEAUTECH
      </Link>

      <button
        type="button"
        className="navbar-hamburger"
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto((aberto) => !aberto)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`links ${menuAberto ? 'menu-aberto' : ''}`}>
        {usuario ? <>
          {usuario.tipo === 'admin' ? (
            <>
              <Link to="/admin" onClick={fecharMenu}>Painel</Link>
              <Link to="/medicos" onClick={fecharMenu}>Médicos</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={fecharMenu}>Início</Link>
              <Link to="/agendamentos" onClick={fecharMenu}>Agenda</Link>
              <Link to="/calendario" onClick={fecharMenu}>Calendário</Link>
              <Link to="/medicos" onClick={fecharMenu}>Médicos</Link>
              {usuario.tipo === 'medico' && <Link to="/meus-procedimentos" onClick={fecharMenu}>Procedimentos</Link>}
              <Link to="/perfil" onClick={fecharMenu}>Perfil</Link>
            </>
          )}
          <span className="role">{usuario.tipo}</span>
          <ThemeToggle />
          <button onClick={sair} className="btn-sair">Sair</button>
        </> : <>
          <Link to="/medicos" onClick={fecharMenu}>Médicos</Link>
          <Link to="/login" onClick={fecharMenu}>Entrar</Link>
          <Link to="/cadastro" className="nav-cta" onClick={fecharMenu}>Criar</Link>
          <ThemeToggle />
        </>}
      </div>
    </nav>
  );
}
