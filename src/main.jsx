import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './output.css'
import './theme.css'
import App from './App.jsx'

// Clear any existing theme preference to ensure fresh start
localStorage.removeItem('theme');

// Ensure we start with light mode
document.documentElement.classList.remove('dark-theme');
document.body.style.backgroundColor = '#ffffff';
document.body.style.color = '#000000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
