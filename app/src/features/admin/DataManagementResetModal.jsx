import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DataManagementResetModal({ show, onClose, onConfirm, loading, userEmail }) {
    const [word, setWord] = useState('');
    const [emailInput, setEmailInput] = useState('');

    if (!show) return null;
    const canSubmit = word === 'RESETAR' && emailInput.trim().toLowerCase() === (userEmail || '').toLowerCase();

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
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Confirme seu e-mail de acesso
                            </label>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                placeholder="seu@email.com"
                                autoComplete="off"
                            />
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
                        onClick={() => onConfirm({ word })}
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
