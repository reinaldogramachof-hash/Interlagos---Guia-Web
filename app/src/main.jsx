import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import useAuthStore from './stores/authStore.js'

// Inicializa auth UMA VEZ, fora do ciclo React
useAuthStore.getState().init();

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ErrorBoundary>,
)
