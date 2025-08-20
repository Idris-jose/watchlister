import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import './index.css'
import App from './App.jsx'
 import logo from './assets/logo.png'

// Set branding (favicon/title) at runtime
(() => {
  try {
    const link = document.getElementById('favicon') || (() => {
      const el = document.createElement('link');
      el.id = 'favicon';
      el.rel = 'icon';
      el.type = 'image/png';
      document.head.appendChild(el);
      return el;
    })();
    link.href = logo;
    if (document.title !== 'Watchlister') {
      document.title = 'Watchlister';
    }
  } catch {}
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
          <App />
  
  
  </StrictMode>,
)
