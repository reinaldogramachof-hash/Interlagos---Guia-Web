import { useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ICONS = {
  success: <CheckCircle size={16} className="text-green-600 flex-shrink-0" />,
  error:   <AlertCircle size={16} className="text-red-600 flex-shrink-0" />,
  info:    <Info size={16} className="text-brand-600 flex-shrink-0" />,
};

const BG = {
  success: 'bg-green-50 border-green-200',
  error:   'bg-red-50 border-red-200',
  info:    'bg-white border-gray-200',
};

function ToastItem({ toast, onRemove }) {
  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-card 
                    border shadow-modal text-sm font-medium text-gray-800 
                    animate-in slide-in-from-top-2 fade-in duration-200 ${BG[toast.type]}`}>
      {ICONS[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-600 ml-1">
        <X size={14} />
      </button>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
