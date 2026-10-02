import { useState } from 'react';

export default function EnderecoFields({form,setForm,prefix=''}) {
  const [buscando,setBuscando]=useState(false);
  const [erro,setErro]=useState('');

  async function buscarCep(valor) {
    const cep=String(valor).replace(/\D/g,'').slice(0,8);
    setForm(atual=>({...atual,[`${prefix}cep`]:cep}));
    setErro('');
    if(cep.length!==8) return;
    setBuscando(true);
    try {
      const resposta=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados=await resposta.json();
      if(dados.erro) { setErro('CEP não encontrado.'); return; }
      setForm(atual=>({
        ...atual,
        [`${prefix}cep`]:cep,
        [`${prefix}logradouro`]:dados.logradouro || '',
        [`${prefix}bairro`]:dados.bairro || '',
        [`${prefix}cidade`]:dados.localidade || '',
        [`${prefix}uf`]:dados.uf || ''
      }));
    } catch { setErro('Não foi possível consultar o CEP.'); }
    finally { setBuscando(false); }
  }

  function alterar(e) {
    const {name,value}=e.target;
    setForm(atual=>({...atual,[name]:name==='cep'?value.replace(/\D/g,'').slice(0,8):value}));
  }

  return (
    <div className="address-fields full">
      <div className="address-grid">
        <div>
          <label>CEP *</label>
          <input className="input" name={`${prefix}cep`} value={form[`${prefix}cep`]||''} onChange={e=>buscarCep(e.target.value)} placeholder="00000000" maxLength={8} required />
          {buscando && <small className="field-hint">Buscando endereço...</small>}
          {erro && <small className="field-error">{erro}</small>}
        </div>
        <div className="address-wide">
          <label>Logradouro *</label>
          <input className="input" name={`${prefix}logradouro`} value={form[`${prefix}logradouro`]||''} onChange={alterar} required />
        </div>
        <div>
          <label>Número *</label>
          <input className="input" name={`${prefix}numero`} value={form[`${prefix}numero`]||''} onChange={alterar} required />
        </div>
        <div>
          <label>Complemento</label>
          <input className="input" name={`${prefix}complemento`} value={form[`${prefix}complemento`]||''} onChange={alterar} placeholder="Apto, bloco..." />
        </div>
        <div>
          <label>Bairro *</label>
          <input className="input" name={`${prefix}bairro`} value={form[`${prefix}bairro`]||''} onChange={alterar} required />
        </div>
        <div>
          <label>Cidade *</label>
          <input className="input" name={`${prefix}cidade`} value={form[`${prefix}cidade`]||''} onChange={alterar} required />
        </div>
        <div>
          <label>UF *</label>
          <input className="input" name={`${prefix}uf`} value={form[`${prefix}uf`]||''} onChange={alterar} maxLength={2} required />
        </div>
      </div>
    </div>
  );
}
