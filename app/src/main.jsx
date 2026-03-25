import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import useAuthStore from './stores/authStore.js'
import { registerSW } from 'virtual:pwa-register'

// Registra o Service Worker (autoUpdate)
registerSW({ immediate: true })

// Captura o beforeinstallprompt ANTES do React montar
// O evento dispara muito cedo — o hook só pode recuperar depois
window.__pwaPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaPrompt = e
  // Notifica qualquer listener já registrado (ex: hook montado depois)
  window.dispatchEvent(new Event('pwa-prompt-ready'))
})

// Inicializa auth UMA VEZ, fora do ciclo React
useAuthStore.getState().init();

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ErrorBoundary>,
)
