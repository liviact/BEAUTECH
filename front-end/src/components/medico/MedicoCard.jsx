import { useNavigate } from 'react-router-dom';
import { obterUsuario } from '../../storage/usuario.storage.js';
import { urlFoto } from '../../services/medicoService.js';

export default function MedicoCard({ medico }) {
  const navigate = useNavigate();
  const foto = urlFoto(medico.foto_perfil);
  const usuario = obterUsuario();
  const podeAgendar = usuario?.tipo === 'cliente';

  return (
    <article className="doctor-card">
      <div className="doctor-photo-wrap">
        {foto ? (
          <img className="doctor-photo" src={foto} alt={`Foto de ${medico.nome}`} />
        ) : (
          <div className="doctor-photo doctor-photo-placeholder">BT</div>
        )}
      </div>
      <div className="doctor-card-body">
        <span className="doctor-label">PROFISSIONAL BEAUTECH</span>
        <h3>{medico.nome}</h3>
        <p>{medico.especializacao || 'Especialista em estética'}</p>
        <div className="doctor-procedures">
          <span className="doctor-procedures-title">Procedimentos</span>
          {medico.procedimentos?.length ? (
            <div className="doctor-procedure-tags">
              {medico.procedimentos.slice(0, 4).map((procedimento) => (
                <span key={procedimento}>{procedimento}</span>
              ))}
              {medico.procedimentos.length > 4 && <span>+{medico.procedimentos.length - 4}</span>}
            </div>
          ) : <small>Nenhum procedimento informado.</small>}
        </div>
        <div className={`doctor-card-actions ${podeAgendar ? '' : 'single-action'}`}>
          <button
            className="doctor-profile-button"
            onClick={() => navigate(`/medicos/${medico.id_usuario}`)}
          >
            Ver perfil
          </button>

          {podeAgendar && (
            <button
              className="doctor-schedule-button"
              onClick={() => navigate(`/agendamentos/novo?medico=${medico.id_usuario}`)}
            >
              Agendar com este médico
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
