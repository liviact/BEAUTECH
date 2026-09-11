import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarMedico, listarProcedimentosMedico, urlFoto } from '../services/medicoService.js';

export default function MedicoPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = obterUsuario();
  const [medico, setMedico] = useState(null);
  const [procedimentos, setProcedimentos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    Promise.all([buscarMedico(id), listarProcedimentosMedico(id)])
      .then(([dados, lista]) => { setMedico(dados); setProcedimentos(lista); })
      .catch((err) => setErro(err.response?.data?.message || 'Não foi possível carregar o médico.'));
  }, [id]);

  if (erro) return <main className="catalog-page"><div className="alert error">{erro}</div><Link to="/medicos" className="btn-link">Voltar</Link></main>;
  if (!medico) return <main className="catalog-page"><p>Carregando...</p></main>;

  return (
    <main className="catalog-page">
      <button type="button" className="back-link back-button" onClick={() => navigate('/medicos')}>← Voltar para médicos</button>
      <section className="doctor-detail">
        <img src={urlFoto(medico.foto_perfil)} alt={`Foto de ${medico.nome}`} />
        <div>
          <span className="doctor-label">PROFISSIONAL BEAUTECH</span>
          <h1>{medico.nome}</h1>
          <h2>{medico.especializacao}</h2>
          <p><strong>CRM:</strong> {medico.crm}</p>
          <h3>Procedimentos</h3>
          {procedimentos.length ? <ul>{procedimentos.map((p) => <li key={p.id_procedimento}>{p.nome}</li>)}</ul> : <p className="muted">Procedimentos ainda não informados.</p>}
          {usuario?.tipo === 'cliente' && (
            <button className="doctor-detail-schedule" onClick={() => navigate(`/agendamentos/novo?medico=${medico.id_usuario}`)}>
              Agendar com este médico
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
