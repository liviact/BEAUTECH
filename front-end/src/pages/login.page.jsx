import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import { loginCliente } from '../services/authService.js';
import { salvarSessao } from '../storage/usuario.storage.js';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await loginCliente(cpf.replace(/\D/g, ''), senha);
      salvarSessao(resposta.token);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível entrar. Verifique CPF e senha.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="brand"><strong>BEAUTECH</strong><span>Clínica de estética</span></div>
        <h1>Entrar</h1>
        <p className="muted">Acesse sua área de cliente.</p>

        {erro && <div className="alert error">{erro}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label>CPF</label>
          <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Somente números" required />
          <label>Senha</label>
          <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" required />
          <Button type="submit" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</Button>
        </form>

        <p className="auth-links">Não possui conta? <Link to="/cadastro">Cadastre-se</Link></p>
        <Link className="doctor-link" to="/login-medico">Acesso profissional do médico →</Link>
      </div>
    </div>
  );
}
