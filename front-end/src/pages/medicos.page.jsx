import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterUsuario } from '../storage/usuario.storage.js';
import { listarMedicos } from '../services/medicoService.js';
import MedicoCard from '../components/medico/MedicoCard.jsx';

export default function Medicos() {
  const navigate = useNavigate();
  const usuario = obterUsuario();

  const [medicos, setMedicos] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarMedicos().then(setMedicos).catch((err) => {
      setErro(err.response?.data?.message || 'Não foi possível carregar os médicos.');
    });
  }, []);

  const filtrados = medicos.filter((medico) =>
    `${medico.nome} ${medico.especializacao || ''}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <div>
          <Link to="/" className="catalog-logo">BEAUTECH</Link>
          <span className="eyebrow">NOSSA EQUIPE</span>
          <h1>Encontre seu profissional</h1>
          <p>Conheça os médicos cadastrados e suas especializações.</p>
        </div>
        <button type="button" className="btn-secondary page-back-button" onClick={() => navigate(usuario?.id ? '/dashboard' : '/')}>← Voltar</button>
      </header>

      <div className="catalog-toolbar">
        <input className="input" placeholder="Buscar por nome ou especialização..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {erro && <div className="alert error">{erro}</div>}

      {filtrados.length === 0 ? (
        <div className="empty-card">Nenhum médico encontrado.</div>
      ) : (
        <section className="doctor-grid">
          {filtrados.map((medico) => <MedicoCard key={medico.id_usuario} medico={medico} />)}
        </section>
      )}
    </main>
  );
}
