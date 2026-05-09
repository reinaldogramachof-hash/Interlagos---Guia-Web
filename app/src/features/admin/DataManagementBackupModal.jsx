import React from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function DataManagementBackupModal({ show, onClose, onConfirm, loading }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Save className="text-emerald-400" />
                        Exportar Backup
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                        Exporta todos os dados do bairro em formato JSON.
                    </p>
                    <p className="text-slate-500 text-xs">
                        Acesso autorizado via sessão Master autenticada.
                    </p>
                </div>
                <div className="bg-slate-900 p-4 flex gap-3 justify-end border-t border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Exportar
                    </button>
                </div>
            </div>
        </div>
    );
}
