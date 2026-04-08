import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function DataManagementResetModal({ show, onClose, onConfirm, loading }) {
    const [pin, setPin] = useState('');
    const [word, setWord] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!show) return null;
    const canSubmit = word === 'RESETAR' && pin.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-red-500/50 shadow-2xl shadow-red-900/20 overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                        <AlertTriangle />
                        ZONA DE PERIGO
                    </h3>
                    <p className="text-slate-300 text-sm mb-6">
                        Você está prestes a <strong className="text-red-400">APAGAR DEFINITIVAMENTE</strong> todos os dados de conteúdo deste bairro. Esta ação não pode ser desfeita.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Digite <span className="text-red-400 font-mono bg-red-500/10 px-1 rounded">RESETAR</span> para confirmar
                            </label>
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => setWord(e.target.value.toUpperCase())}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-red-400 font-mono focus:outline-none focus:border-red-500 font-bold"
                                placeholder="RESETAR"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">PIN Master</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
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
                <div className="bg-black/50 p-4 flex gap-3 justify-end border-t border-red-900/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm({ word, pin })}
                        disabled={!canSubmit || loading}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        APAGAR TUDO
                    </button>
                </div>
            </div>
        </div>
    );
}
