import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Input from '../components/shared/input'
import Button from '../components/shared/button'
import { login } from '../services/auth.api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const usuario = await login(email, senha)

      localStorage.setItem('usuario', JSON.stringify(usuario))

      navigate('/dashboard')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="auth-container">
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit} className="form">
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button type="submit">Entrar</Button>
      </form>

      <p>
        Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}