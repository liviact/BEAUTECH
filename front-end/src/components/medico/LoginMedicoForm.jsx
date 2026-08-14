import { useState } from 'react';

export default function LoginMedicoForm({ onSubmit, loading, onCadastrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function enviar(event) {
    event.preventDefault();
    onSubmit({ email, senha });
  }

  return <form onSubmit={enviar} className="form">
    <label>E-mail</label>
    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="medico@email.com" required />
    <label>Senha</label>
    <input className="input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" required />
    <button className="btn" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
    <button type="button" className="btn-link" onClick={onCadastrar}>Ainda não sou cadastrado</button>
  </form>;
}
