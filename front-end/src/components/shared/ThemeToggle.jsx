import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const escuro = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
    >
      <span aria-hidden="true">{escuro ? '☀️' : '🌙'}</span>
      <span>{escuro ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  );
}
