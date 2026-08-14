import { useState } from 'react';
import LoginMedicoForm from '../components/LoginMedicoForm';
import CadastroMedicoForm from '../components/CadastroMedicoForm';
import { useMedicoAuth } from '../hooks/useMedicoAuth';

export default function LoginMedico() {
  const [cadastro, setCadastro] = useState(false);
  const { entrar, cadastrar, loading, mensagem, erro } = useMedicoAuth();

  async function fazerLogin(dados) {
    const resultado = await entrar(dados);
    if (resultado) {
      console.log('Token do médico:', resultado.token);
    }
  }

  async function fazerCadastro(dados) {
    const resultado = await cadastrar(dados);
    if (resultado) {
      console.log('Token do médico:', resultado.token);
      setCadastro(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card shadow">
        <div className="brand">
          <h1>BEAUTECH</h1>
          <p>Acesso profissional</p>
        </div>

        <div className="text-center mb-4">
          <h2>{cadastro ? 'Cadastro de médico' : 'Login do médico'}</h2>
          <p className="text-muted">
            {cadastro ? 'Preencha seus dados profissionais.' : 'Entre para acessar a área médica.'}
          </p>
        </div>

        {mensagem && <div className="alert alert-success">{mensagem}</div>}
        {erro && <div className="alert alert-danger">{erro}</div>}

        {cadastro ? (
          <CadastroMedicoForm onSubmit={fazerCadastro} loading={loading} onVoltar={() => setCadastro(false)} />
        ) : (
          <LoginMedicoForm onSubmit={fazerLogin} loading={loading} onCadastrar={() => setCadastro(true)} />
        )}
      </section>
    </main>
  );
}
