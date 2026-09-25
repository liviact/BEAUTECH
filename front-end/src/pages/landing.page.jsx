import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import { listarMedicos } from '../services/medicoService.js';
import MedicoCard from '../components/medico/MedicoCard.jsx';

export default function Landing() {
  const [medicos, setMedicos] = useState([]);
  useEffect(() => { listarMedicos().then(setMedicos).catch(() => setMedicos([])); }, []);

  return (
    <>
      <Navbar publicOnly />
      <main className="landing-page">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="eyebrow">CUIDADO • TECNOLOGIA • ACESSO</span>
            <h1>Seu cuidado começa aqui.</h1>
            <p>Tornar o cuidado com a pele acessível a todos é o propósito da BEAUTECH.</p>
            <div className="landing-actions">
              <Link to="/login" className="btn-link">Login & Cadastro</Link>
            </div>
          </div>
          <div className="landing-highlight">
            <div className="landing-icon">✦</div>
            <strong>Cuidado acessível</strong>
            <span>Agendamentos, profissionais e informações em um só lugar.</span>
          </div>
        </section>

        <section className="landing-values">
          <div className="section-heading"><div><span className="eyebrow">BEAUTECH</span><h2>Por que estamos aqui?</h2></div></div>
          <div className="value-grid">
            <article className="card"><span className="value-number">01</span><h3>Acesso</h3><p>Facilitar o acesso ao cuidado com a pele por meio da tecnologia.</p></article>
            <article className="card"><span className="value-number">02</span><h3>Cuidado</h3><p>Organizar consultas e informações para uma experiência mais simples.</p></article>
            <article className="card"><span className="value-number">03</span><h3>Confiança</h3><p>Conectar clientes aos profissionais cadastrados na clínica.</p></article>
          </div>
        </section>

        <section className="landing-team">
          <div className="section-heading"><div><span className="eyebrow">NOSSA EQUIPE</span><h2>Conheça os médicos</h2><p className="muted">Veja profissionais e procedimentos disponíveis.</p></div><Link to="/medicos" className="btn-secondary">Ver todos</Link></div>
          <div className="doctor-grid">{medicos.slice(0, 3).map((medico) => <MedicoCard key={medico.id_usuario} medico={medico} />)}</div>
        </section>
      </main>
    </>
  );
}
