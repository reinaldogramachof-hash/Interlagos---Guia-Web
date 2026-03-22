import React from 'react';

export default function ActivitiesTab({ loading, myActivities }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Histórico de Atividades</h3>

            {loading ? (
                <p className="text-center text-slate-400">Carregando...</p>
            ) : myActivities.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500">Você ainda não criou nenhuma campanha ou anúncio.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myActivities.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{item.type}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        item.status === 'active' || item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {item.status === 'active' || item.status === 'approved' ? 'Aprovado' : item.status === 'pending' ? 'Em Análise' : 'Inativo'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                            </div>
                            <div className="text-sm text-slate-500">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
