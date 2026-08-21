import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginMedicoForm from '../components/medico/LoginMedicoForm.jsx';
import CadastroMedicoForm from '../components/medico/CadastroMedicoForm.jsx';
import { useMedicoAuth } from '../hooks/useMedicoAuth.jsx';
import { salvarSessao } from '../storage/usuario.storage.js';

export default function LoginMedico() {
  const [cadastro, setCadastro] = useState(false);
  const { entrar, cadastrar, loading, mensagem, erro } = useMedicoAuth();
  const navigate = useNavigate();

  async function fazerLogin(dados) {
    const resultado = await entrar(dados);
    if (resultado) { salvarSessao(resultado.token); navigate('/dashboard'); }
  }

  async function fazerCadastro(dados) {
    const resultado = await cadastrar(dados);
    if (resultado) { salvarSessao(resultado.token); navigate('/dashboard'); }
  }

  return <main className="auth-page"><section className="auth-container wide"><div className="brand"><strong>BEAUTECH</strong><span>Acesso profissional</span></div><h1>{cadastro ? 'Cadastro de médico' : 'Login do médico'}</h1><p className="muted">{cadastro ? 'Preencha seus dados profissionais.' : 'Entre para acessar a área médica.'}</p>{mensagem && <div className="alert success">{mensagem}</div>}{erro && <div className="alert error">{erro}</div>}{cadastro ? <CadastroMedicoForm onSubmit={fazerCadastro} loading={loading} onVoltar={() => setCadastro(false)} /> : <LoginMedicoForm onSubmit={fazerLogin} loading={loading} onCadastrar={() => setCadastro(true)} />}<Link className="doctor-link" to="/">← Voltar para acesso do cliente</Link></section></main>;
}