import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Card from '../components/shared/card.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarCliente } from '../services/clienteService.js';

export default function Perfil() {
  const sessao = obterUsuario() || {};
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarCliente(sessao.id);
        setUsuario(dados);
      } catch (err) {
        setErro(err.response?.data?.message || 'Não foi possível carregar o perfil.');
      }
    }
    if (sessao.id && sessao.tipo === 'cliente') carregar();
  }, [sessao.id, sessao.tipo]);

  if (sessao.tipo === 'medico') {
    return <><Navbar /><div className="container"><Card><h1>Área médica</h1><p>O perfil do médico é administrado pelos endpoints profissionais do BEAUTECH.</p></Card></div></>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Meu Perfil</h1>
        {erro && <div className="alert error">{erro}</div>}
        <Card>
          <p><strong>Nome:</strong> {usuario?.nome || 'Carregando...'}</p>
          <p><strong>CPF:</strong> {usuario?.cpf || '—'}</p>
          <p><strong>Telefone:</strong> {usuario?.telefone || '—'}</p>
          <p><strong>Tipo de pele:</strong> {usuario?.tipo_pele || '—'}</p>
          <p><strong>Endereço:</strong> {usuario?.endereco || '—'}</p>
          <Link to="/perfil/editar" className="btn-link">Editar Perfil</Link>
        </Card>
      </div>
    </>
  );
}