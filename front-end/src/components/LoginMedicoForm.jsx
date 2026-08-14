import { useState } from 'react';

export default function LoginMedicoForm({ onSubmit, loading, onCadastrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function enviar(event) {
    event.preventDefault();
    onSubmit({ email, senha });
  }

  return (
    <form onSubmit={enviar}>
      <div className="mb-3">
        <label className="form-label">E-mail</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="medico@email.com"
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Senha</label>
        <input
          type="password"
          className="form-control"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          placeholder="Digite sua senha"
          required
        />
      </div>

      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <button type="button" className="btn btn-link w-100 mt-2" onClick={onCadastrar}>
        Ainda não sou cadastrado
      </button>
    </form>
  );
}
