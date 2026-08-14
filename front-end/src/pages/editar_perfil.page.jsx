import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarCliente, atualizarCliente } from '../services/clienteService.js';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};
  const [form, setForm] = useState({ nome: '', telefone: '', cpf: '', tipo_pele: '', endereco: '' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!sessao.id || sessao.tipo !== 'cliente') return;
    buscarCliente(sessao.id).then((dados) => setForm({
      nome: dados.nome || '', telefone: dados.telefone || '', cpf: dados.cpf || '', tipo_pele: dados.tipo_pele || '', endereco: dados.endereco || ''
    })).catch((err) => setErro(err.response?.data?.message || 'Erro ao carregar dados.'));
  }, [sessao.id, sessao.tipo]);

  function handleChange(e) { setForm((atual) => ({ ...atual, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setErro(''); setMensagem('');
    try {
      await atualizarCliente(sessao.id, { ...form, cpf: form.cpf.replace(/\D/g, '') });
      setMensagem('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/perfil'), 500);
    } catch (err) {
      setErro(err.response?.data?.message || err.response?.data?.error || 'Erro ao atualizar perfil.');
    }
  }

  return <><Navbar /><div className="container"><Card><h1>Editar Perfil</h1>{mensagem && <div className="alert success">{mensagem}</div>}{erro && <div className="alert error">{erro}</div>}
    <form onSubmit={handleSubmit} className="form grid-form">
      <div><label>Nome</label><Input name="nome" value={form.nome} onChange={handleChange} required /></div>
      <div><label>Telefone</label><Input name="telefone" value={form.telefone} onChange={handleChange} required /></div>
      <div><label>CPF</label><Input name="cpf" value={form.cpf} onChange={handleChange} required /></div>
      <div><label>Tipo de pele</label><Input name="tipo_pele" value={form.tipo_pele} onChange={handleChange} /></div>
      <div className="full"><label>Endereço</label><Input name="endereco" value={form.endereco} onChange={handleChange} /></div>
      <Button type="submit">Salvar alterações</Button>
    </form>
  </Card></div></>;
}
