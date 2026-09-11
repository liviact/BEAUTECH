import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarCliente } from '../services/clienteService.js';
import { buscarMedico, urlFoto } from '../services/medicoService.js';

export default function Perfil() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = sessao.tipo === 'medico'
          ? await buscarMedico(sessao.id)
          : await buscarCliente(sessao.id);
        setUsuario(dados);
      } catch (err) {
        setErro(err.response?.data?.message || 'Não foi possível carregar o perfil.');
      }
    };
    if (sessao.id) carregar();
  }, [sessao.id, sessao.tipo]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">MINHA CONTA</span>
            <h1>Meu Perfil</h1>
            <p className="muted">Consulte seus dados e informações da conta.</p>
          </div>
          <button type="button" className="btn-secondary page-back-button" onClick={() => navigate('/dashboard')}>← Voltar ao dashboard</button>
        </div>
        {erro && <div className="alert error">{erro}</div>}
        <Card>
          {usuario?.foto_perfil && <img className="profile-photo" src={urlFoto(usuario.foto_perfil)} alt={`Foto de ${usuario.nome}`} />}
          <p><strong>Nome:</strong> {usuario?.nome || 'Carregando...'}</p>
          <p><strong>E-mail:</strong> {usuario?.email || '—'}</p>
          <p><strong>CPF:</strong> {usuario?.cpf || '—'}</p>
          <p><strong>Telefone:</strong> {usuario?.telefone || '—'}</p>
          <p><strong>Data de nascimento:</strong> {usuario?.data_nascimento ? String(usuario.data_nascimento).slice(0, 10) : '—'}</p>
          <p><strong>Endereço:</strong> {usuario?.endereco || '—'}</p>
          {sessao.tipo === 'cliente' ? <p><strong>Tipo de pele:</strong> {usuario?.tipo_pele || '—'}</p> : <><p><strong>CRM:</strong> {usuario?.crm || '—'}</p><p><strong>Especialização:</strong> {usuario?.especializacao || '—'}</p></>}
          <p><strong>Status:</strong> {usuario?.ativo ? 'Ativo' : 'Inativo'}</p>
          <Link to="/perfil/editar" className="btn-link">Editar Perfil</Link>
        </Card>
      </div>
    </>
  );
}
