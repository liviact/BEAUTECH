import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../components/shared/input'
import Button from '../components/shared/button'
import { cadastrar } from '../services/auth.api'

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: ''
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await cadastrar(form)

      alert('Cadastro realizado com sucesso!')

      navigate('/')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="auth-container">
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit} className="form">
        <Input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
        />

        <Input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
        />

        <Input
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
        />

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}