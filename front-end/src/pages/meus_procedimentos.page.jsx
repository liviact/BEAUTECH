import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { listarProcedimentos } from '../services/procedimentoService.js';
import {
  listarProcedimentosMedico,
  adicionarProcedimentoMedico,
  removerProcedimentoMedico
} from '../services/medicoService.js';
import { obterUsuario } from '../storage/usuario.storage.js';

export default function MeusProcedimentos() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [procedimentos, setProcedimentos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [originais, setOriginais] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (sessao.tipo !== 'medico') return;

    Promise.all([
      listarProcedimentos(),
      listarProcedimentosMedico(sessao.id)
    ])
      .then(([todos, vinculados]) => {
        const ids = vinculados.map((item) => Number(item.id_procedimento));
        setProcedimentos(todos);
        setSelecionados(ids);
        setOriginais(ids);
      })
      .catch((err) => {
        setErro(err.response?.data?.message || 'Não foi possível carregar os procedimentos.');
      })
      .finally(() => setCarregando(false));
  }, [sessao.id, sessao.tipo]);

  function alternar(id) {
    const numero = Number(id);
    setSelecionados((atual) =>
      atual.includes(numero)
        ? atual.filter((item) => item !== numero)
        : [...atual, numero]
    );
    setErro('');
    setSucesso('');
  }

  async function salvar() {
    if (selecionados.length === 0) {
      setErro('Selecione pelo menos um procedimento para continuar.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso('');

    try {
      const novos = selecionados.filter((id) => !originais.includes(id));
      const removidos = originais.filter((id) => !selecionados.includes(id));

      await Promise.all([
        ...novos.map((id) => adicionarProcedimentoMedico(sessao.id, id)),
        ...removidos.map((id) => removerProcedimentoMedico(sessao.id, id))
      ]);

      setOriginais([...selecionados]);
      setSucesso('Seus procedimentos foram atualizados com sucesso.');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível salvar os procedimentos.');
    } finally {
      setSalvando(false);
    }
  }

  if (sessao.tipo !== 'medico') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container procedures-page">
        <div className="page-header">
          <div>
            <span className="eyebrow">ÁREA PROFISSIONAL</span>
            <h1>Meus procedimentos</h1>
            <p className="muted">
              Selecione os procedimentos que você realiza na BEAUTECH.
              Eles aparecerão no seu perfil e serão oferecidos ao cliente durante o agendamento.
            </p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/dashboard')}>← Voltar ao dashboard</button>
        </div>

        {erro && <div className="alert error">{erro}</div>}
        {sucesso && <div className="alert success">{sucesso}</div>}

        <Card>
          {carregando ? (
            <p>Carregando procedimentos...</p>
          ) : (
            <>
              <div className="procedure-selection-header">
                <div>
                  <h2>Procedimentos realizados</h2>
                  <p className="muted">Marque todos os procedimentos que fazem parte da sua atuação.</p>
                </div>
                <strong>{selecionados.length} selecionado(s)</strong>
              </div>

              <div className="procedure-selection-grid">
                {procedimentos.map((procedimento) => {
                  const marcado = selecionados.includes(Number(procedimento.id_procedimento));
                  return (
                    <label key={procedimento.id_procedimento} className={`procedure-option ${marcado ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => alternar(procedimento.id_procedimento)}
                      />
                      <span>
                        <strong>{procedimento.nome}</strong>
                        {procedimento.descricao && <small>{procedimento.descricao}</small>}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="procedure-selection-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                  Voltar
                </button>
                <button type="button" className="btn" onClick={salvar} disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar procedimentos'}
                </button>
              </div>
            </>
          )}
        </Card>
      </main>
    </>
  );
}
