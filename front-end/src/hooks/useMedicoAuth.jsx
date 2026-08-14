import { useState } from 'react';
import { cadastrarMedico, loginMedico } from '../services/medicoService';

export function useMedicoAuth() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function entrar(dados) {
    setLoading(true);
    setMensagem('');
    setErro('');

    try {
      const data = await loginMedico(dados);
      localStorage.setItem('tokenMedico', data.token);
      setMensagem('Login realizado com sucesso!');
      return data;
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível realizar o login.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar(dados) {
    setLoading(true);
    setMensagem('');
    setErro('');

    try {
      const data = await cadastrarMedico(dados);
      localStorage.setItem('tokenMedico', data.token);
      setMensagem('Médico cadastrado com sucesso!');
      return data;
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível cadastrar o médico.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { entrar, cadastrar, loading, mensagem, erro };
}
