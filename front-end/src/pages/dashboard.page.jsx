import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { listarMedicos } from '../services/medicoService.js';
import MedicoCard from '../components/medico/MedicoCard.jsx';

export default function Dashboard() {
  const usuario = obterUsuario() || {};
  const [medicos, setMedicos] = useState([]);

  useEffect(() => { listarMedicos().then(setMedicos).catch(() => setMedicos([])); }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <section className="hero">
          <p className="eyebrow">BEAUTECH</p>
          <h1>Olá, {usuario.nome || 'seja bem-vindo'}!</h1>
          <p>Você está na área {usuario.tipo === 'medico' ? 'profissional' : 'do cliente'}.</p>
        </section>

        <div className="acoes">
          {usuario.tipo === 'cliente' && <Link to="/agendamentos/novo" className="card-acao"><strong>Novo Agendamento</strong><span>Marque seu atendimento.</span></Link>}
          <Link to="/agendamentos" className="card-acao"><strong>{usuario.tipo === 'medico' ? 'Minha Agenda' : 'Meus Agendamentos'}</strong><span>Acompanhe suas consultas.</span></Link>
          {usuario.tipo === 'medico' && <Link to="/meus-procedimentos" className="card-acao"><strong>Meus Procedimentos</strong><span>Escolha os procedimentos que você realiza.</span></Link>}
          <Link to="/perfil" className="card-acao"><strong>Meu Perfil</strong><span>Consulte e atualize seus dados.</span></Link>
        </div>

        <section className="catalog-section">
          <div className="section-heading"><div><span className="eyebrow">NOSSA EQUIPE</span><h2>Médicos BEAUTECH</h2><p className="muted">Conheça nossos profissionais e suas especializações.</p></div><Link to="/medicos" className="btn-link compact">Ver todos</Link></div>
          <div className="doctor-grid doctor-grid-preview">{medicos.slice(0, 3).map((medico) => <MedicoCard key={medico.id_usuario} medico={medico} />)}</div>
        </section>
      </div>
    </>
  );
}
