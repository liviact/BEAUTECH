import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('beautech-theme') || 'light');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('beautech-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((atual) => atual === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
