import { AlertTriangle, X } from 'lucide-react';

const REASONS = ['Conteúdo Suspeito', 'Dúvida de Categoria', 'Denúncia de Usuário', 'Outro'];

export default function EscalationDialog({ target, reason, onReasonChange, onConfirm, onClose }) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" /> Escalar para Master
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            Você está enviando o item <strong>"{target.title}"</strong> para a Torre de Controle.
          </p>
          <p className="text-xs text-yellow-700 mt-1">Este item sairá da sua lista e ficará sob responsabilidade exclusiva do Master.</p>
        </div>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-bold text-slate-700">Motivo do Escalonamento</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {REASONS.map(r => (
              <button
                key={r}
                onClick={() => onReasonChange(r)}
                className={`p-2 text-xs rounded-lg border transition-all ${reason === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:border-indigo-300'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-yellow-500 outline-none h-24 resize-none"
            placeholder="Descreva o motivo detalhadamente..."
            value={reason}
            onChange={e => onReasonChange(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/20">
            Confirmar Envio
          </button>
        </div>
      </div>
    </div>
  );
}
