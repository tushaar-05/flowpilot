import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'lenis/dist/lenis.css'; 
import App from './App';
import { STORAGE_KEYS } from '@/constants';

// Apply saved theme class before React mounts to avoid a flash
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME) ?? 'null');
  if (saved === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
} catch {
  /* ignore localStorage errors */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
