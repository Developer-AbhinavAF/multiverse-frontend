import React from 'react';
import { useTheme } from '../context/ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 bg-white/5 border border-white/10 text-white"
      style={{ padding: '16px', borderRadius: '50%' }}
      title={`Switch to ${theme === 'mono' ? 'Color' : 'Monochrome'} theme`}
    >
      <span className="text-2xl block">
        {theme === 'mono' ? '🎨' : '⚫'}
      </span>
    </button>
  );
};

export default ThemeToggle;
