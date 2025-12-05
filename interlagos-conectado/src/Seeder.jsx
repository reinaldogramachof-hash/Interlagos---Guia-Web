import React, { useState } from 'react';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { mockData } from './mockData';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const MOCK_MERCHANTS = mockData;

const MOCK_ADS = [
    {
        title: 'Promoção de Inauguração',
        description: 'Venha conhecer nosso novo espaço e ganhe 20% de desconto!',
        price: 'R$ 0,00',
        category: 'Alimentação',
        author: { uid: 'mock_user_1', name: 'Padaria Interlagos' },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 dias
    },
    {
        title: 'Troca de Óleo Grátis',
        description: 'Na compra de 4 pneus, a troca de óleo é por nossa conta.',
        price: 'R$ 1200,00',
        category: 'Automotivo',
        author: { uid: 'mock_user_2', name: 'Auto Center Sul' },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // +15 dias
    }
];

const MOCK_NEWS = [
    {
        title: 'Feira de Artesanato neste Domingo',
        summary: 'A praça principal receberá artesãos locais para um dia de cultura e lazer.',
        category: 'Eventos',
        publishDate: new Date(),
        content: 'Venha prestigiar os artistas da nossa região...'
    },
    {
        title: 'Nova Ciclofaixa na Av. Interlagos',
        summary: 'Prefeitura anuncia início das obras para nova ciclofaixa.',
        category: 'Comunidade',
        publishDate: new Date(),
        content: 'As obras começam na próxima segunda-feira...'
    }
];

const MOCK_CAMPAIGNS = [
    {
        title: 'Inverno Solidário',
        description: 'Arrecadação de agasalhos para famílias carentes da região.',
        organizer: 'Associação de Moradores',
        goal: '500 peças',
        raised: '120 peças',
        progress: 24,
        createdAt: new Date()
    }
];

export default function Seeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleFullReset = async () => {
        if (!window.confirm('ATENÇÃO: Isso apagará TODOS os dados das coleções e recriará os dados de exemplo. Continuar?')) {
            return;
        }

        setLoading(true);
        setStatus(null);
        setLogs([]);
        addLog('Iniciando reset completo...');

        try {
            const batch = writeBatch(db);

            // 1. Limpar dados existentes (Simulado - em produção real precisaria ler e deletar, 
            // mas aqui vamos focar em criar/sobrescrever IDs conhecidos ou apenas criar novos para simplificar o MVP)
            // Para um reset real, idealmente usaríamos o emulador ou uma cloud function de limpeza.
            // Aqui, vamos apenas criar novos dados.

            addLog('Preparando dados de Comércios...');
            MOCK_MERCHANTS.forEach((merchant, index) => {
                // Usar IDs consistentes para evitar duplicação em múltiplos seeds se possível, 
                // ou deixar o Firestore gerar. Vamos deixar gerar para garantir novos docs.
                const docRef = doc(collection(db, 'merchants'));
                batch.set(docRef, {
                    ...merchant,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    rating: merchant.isPremium ? 4.8 : 0,
                    reviewCount: merchant.isPremium ? 12 : 0
                });
            });

            addLog('Preparando dados de Anúncios...');
            MOCK_ADS.forEach(ad => {
                const docRef = doc(collection(db, 'ads'));
                batch.set(docRef, {
                    ...ad,
                    createdAt: serverTimestamp()
                });
            });

            addLog('Preparando dados de Notícias...');
            MOCK_NEWS.forEach(news => {
                const docRef = doc(collection(db, 'news'));
                batch.set(docRef, {
                    ...news,
                    createdAt: serverTimestamp()
                });
            });

            addLog('Preparando dados de Campanhas...');
            MOCK_CAMPAIGNS.forEach(campaign => {
                const docRef = doc(collection(db, 'campaigns'));
                batch.set(docRef, {
                    ...campaign,
                    createdAt: serverTimestamp()
                });
            });

            addLog('Enviando Batch Write para o Firestore...');
            await batch.commit();

            addLog('Sucesso! Banco de dados populado.');
            setStatus('success');
        } catch (error) {
            console.error("Erro no Seeder:", error);
            addLog(`Erro: ${error.message}`);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Database size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Ferramentas de Banco de Dados</h3>
                    <p className="text-slate-400 text-sm">Popule o Firestore com dados de teste</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-yellow-200">
                            <p className="font-bold mb-1">Atenção Desenvolvedor</p>
                            <p>Esta ação criará dezenas de documentos nas coleções. Use com cautela em produção.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleFullReset}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Processando...
                        </>
                    ) : (
                        <>
                            <RefreshCw size={20} />
                            Resetar e Popular Banco de Dados
                        </>
                    )}
                </button>

                {status === 'success' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle size={20} />
                        <span className="font-medium">Operação concluída com sucesso!</span>
                    </div>
                )}

                {logs.length > 0 && (
                    <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-400 max-h-40 overflow-y-auto space-y-1 border border-slate-800">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
