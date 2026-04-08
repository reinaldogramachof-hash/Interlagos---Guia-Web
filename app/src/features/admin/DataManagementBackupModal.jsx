import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function DataManagementBackupModal({ show, onClose, onConfirm, loading }) {
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <KeyRound className="text-emerald-400" />
                        Confirmação de Segurança
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Digite o PIN Master para autorizar a exportação de todos os dados do bairro.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">PIN Master</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="••••"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
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
                        onClick={() => onConfirm(pin)}
                        disabled={!pin || loading}
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
