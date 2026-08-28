import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/navbar.jsx';
import Input from '../components/shared/input.jsx';
import Button from '../components/shared/button.jsx';
import Card from '../components/shared/card.jsx';
import { obterUsuario } from '../storage/usuario.storage.js';
import { buscarCliente, atualizarCliente } from '../services/clienteService.js';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const sessao = obterUsuario() || {};

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    tipo_pele: '',
    endereco: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // A página de edição é exclusiva para clientes.
  useEffect(() => {
    if (!sessao.id || sessao.tipo !== 'cliente') {
      navigate('/perfil', { replace: true });
      return;
    }

    async function carregarPerfil() {
      try {
        const dados = await buscarCliente(sessao.id);

        setForm({
          nome: dados.nome || '',
          telefone: dados.telefone || '',
          cpf: dados.cpf || '',
          tipo_pele: dados.tipo_pele || '',
          endereco: dados.endereco || ''
        });
      } catch (err) {
        setErro(
          err.response?.data?.message ||
          'Erro ao carregar os dados do perfil.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [sessao.id, sessao.tipo, navigate]);

  function handleChange(e) {
    setForm((atual) => ({
      ...atual,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro('');
    setMensagem('');
    setSalvando(true);

    try {
      await atualizarCliente(sessao.id, {
        ...form,
        cpf: form.cpf.replace(/\D/g, '')
      });

      setMensagem('Perfil atualizado com sucesso!');

      setTimeout(() => {
        navigate('/perfil');
      }, 700);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao atualizar perfil.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (sessao.tipo !== 'cliente') {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Editar Perfil</h1>
            <p className="muted">
              Altere seus dados pessoais e salve as modificações.
            </p>
          </div>
        </div>

        <Card>
          {mensagem && <div className="alert success">{mensagem}</div>}
          {erro && <div className="alert error">{erro}</div>}

          {carregando ? (
            <p className="muted">Carregando seus dados...</p>
          ) : (
            <form onSubmit={handleSubmit} className="form grid-form">
              <div>
                <label htmlFor="nome">Nome</label>
                <Input
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone">Telefone</label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="cpf">CPF</label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="tipo_pele">Tipo de pele</label>
                <Input
                  id="tipo_pele"
                  name="tipo_pele"
                  value={form.tipo_pele}
                  onChange={handleChange}
                />
              </div>

              <div className="full">
                <label htmlFor="endereco">Endereço</label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </Button>

              <button
                type="button"
                className="btn-link btn-cancelar"
                onClick={() => navigate('/perfil')}
              >
                Cancelar
              </button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
