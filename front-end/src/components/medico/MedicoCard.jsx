import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterUsuario } from '../../storage/usuario.storage.js';
import { urlFoto } from '../../services/medicoService.js';

export default function MedicoCard({ medico }) {
  const navigate = useNavigate();
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const foto = urlFoto(medico.foto_perfil);
  const usuario = obterUsuario();
  const podeAgendar = usuario?.tipo === 'cliente';
  const procedimentos = medico.procedimentos || [];
  const exibidos = mostrarTodos ? procedimentos : procedimentos.slice(0, 3);

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
          {procedimentos.length ? (
            <>
              <div className="doctor-procedure-tags">
                {exibidos.map((procedimento) => (
                  <span key={procedimento}>{procedimento}</span>
                ))}
              </div>
              {procedimentos.length > 3 && (
                <button type="button" className="doctor-more-button" onClick={() => setMostrarTodos((valor) => !valor)}>
                  {mostrarTodos ? 'Ver menos' : 'Ver mais'}
                </button>
              )}
            </>
          ) : <small>Nenhum procedimento informado.</small>}
        </div>
        <div className={`doctor-card-actions ${podeAgendar ? '' : 'single-action'}`}>
          <button
            className="doctor-profile-button"
            onClick={() => navigate(`/medicos/${medico.id_usuario}`)}
          >
            Perfil
          </button>

          {podeAgendar && (
            <button
              className="doctor-schedule-button"
              onClick={() => navigate(`/agendamentos/novo?medico=${medico.id_usuario}`)}
            >
              Agendar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
