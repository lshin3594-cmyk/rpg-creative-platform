import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Полная очистка localStorage для диагностики
console.log('🧹 ПОЛНАЯ ОЧИСТКА localStorage');
try {
  localStorage.clear();
  console.log('✅ localStorage очищен полностью');
} catch (e) {
  console.error('❌ Ошибка очистки:', e);
}

console.log('🎬 Starting React app...');

try {
  createRoot(document.getElementById("root")!).render(<App />);
  console.log('✅ React app mounted');
} catch (error) {
  console.error('❌ CRITICAL: React mount failed:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #1a1a2e; color: white; font-family: sans-serif; flex-direction: column; gap: 20px;">
      <h1>Ошибка загрузки приложения</h1>
      <p>Попробуйте очистить кеш браузера (Ctrl+Shift+Delete)</p>
      <button onclick="localStorage.clear(); location.reload()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Очистить данные и перезагрузить</button>
    </div>
  `;
}