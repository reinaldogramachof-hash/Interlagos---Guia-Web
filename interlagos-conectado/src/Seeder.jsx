import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { Database, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

// --- DADOS DE EXEMPLO (MOCKS) ---

const MOCK_MERCHANTS = [
    {
        name: "Supermercado Rosalina",
        category: "Comércio",
        description: "O mercado da família no coração do Interlagos. Aceitamos Cartão Rosalina.",
        whatsapp: "11991002233",
        address: "R. Ubirajara Raimundo de Souza, 194",
        isPremium: true,
        plan: 'super',
        rating: 4.8,
        views: 120
    },
    {
        name: "Point Do Pastel SJC",
        category: "Alimentação",
        description: "O melhor pastel da Av. Nicanor! Massa caseira e caldo de cana.",
        whatsapp: "11988776655",
        address: "Av. Nicanor Reis, 444",
        isPremium: true,
        plan: 'premium',
        rating: 4.5,
        views: 95
    },
    {
        name: "Interlagos Auto Center",
        category: "Automotivo",
        description: "Mecânica geral, suspensão, freios e troca de óleo.",
        whatsapp: "11997766554",
        address: "R. Prof. José Silveira, 21",
        isPremium: false,
        plan: 'basic',
        rating: 0,
        views: 40
    },
    {
        name: "Clínica Med Odonto",
        category: "Saúde",
        description: "Ortodontia, Implantes e Estética Dental.",
        whatsapp: "11999887744",
        address: "Av. Nicanor Reis, 443",
        isPremium: true,
        plan: 'premium',
        rating: 5.0,
        views: 88
    }
];

const MOCK_ADS = [
    {
        category: 'Vendas',
        title: 'Sofá Retrátil 3 Lugares',
        price: 'R$ 800',
        description: 'Sofá em ótimo estado, cor cinza. Retirar no Jd. Satélite.',
        whatsapp: '11999999999',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300',
        status: 'active',
        createdAt: new Date()
    },
    {
        category: 'Empregos',
        title: 'Balconista de Padaria',
        price: 'A combinar',
        description: 'Padaria Estrela contrata com experiência. Turno da manhã.',
        whatsapp: '11988888888',
        image: null,
        status: 'active',
        createdAt: new Date()
    }
];

const MOCK_NEWS = [
    {
        title: 'Feira de Artesanato na Praça',
        summary: 'Venha prestigiar os artesãos locais neste fim de semana.',
        category: 'Eventos',
        date: '12/11/2025',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500',
        location: 'Praça do Laguinho',
        createdAt: new Date()
    },
    {
        title: 'Vacinação Antirrábica',
        summary: 'Traga seu pet para vacinar gratuitamente no posto de saúde.',
        category: 'Saúde',
        date: '15/11/2025',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
        location: 'UBS Interlagos',
        createdAt: new Date()
    }
];

const MOCK_CAMPAIGNS = [
    {
        title: 'Inverno Solidário 2025',
        organizer: 'Associação de Moradores',
        goal: '500 cobertores',
        raised: '150 cobertores',
        progress: 30,
        description: 'Arrecadação de cobertores para famílias carentes.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500',
        endDate: '30/07/2025',
        pix: 'associacao@interlagos.com',
        collectionPoints: [
            { name: 'Sede da Associação', address: 'Rua A, 123', hours: 'Comercial' }
        ],
        createdAt: new Date()
    }
];

export default function Seeder() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const clearCollection = async (collectionName) => {
        const q = collection(db, collectionName);
        const snapshot = await getDocs(q);

        // Firestore batch limit is 500
        const batch = writeBatch(db);
        let count = 0;

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
            count++;
        });

        if (count > 0) {
            await batch.commit();
        }
        return count;
    };

    const handleFullReset = async () => {
        if (!window.confirm('PERIGO: Isso apagará TODO o banco de dados e recriará os dados iniciais. Continuar?')) return;

        setLoading(true);
        setStatus('Iniciando reset total do sistema...');

        try {
            // 1. Limpar tudo
            setStatus('1/5: Limpando coleções antigas...');
            await Promise.all([
                clearCollection('merchants'),
                clearCollection('ads'),
                clearCollection('news'),
                clearCollection('campaigns')
            ]);

            // 2. Popular Merchants
            setStatus('2/5: Criando comerciantes...');
            for (const m of MOCK_MERCHANTS) {
                await addDoc(collection(db, 'merchants'), { ...m, createdAt: serverTimestamp() });
            }

            // 3. Popular Ads
            setStatus('3/5: Criando anúncios...');
            for (const a of MOCK_ADS) {
                await addDoc(collection(db, 'ads'), { ...a, createdAt: serverTimestamp() });
            }

            // 4. Popular News
            setStatus('4/5: Criando notícias...');
            for (const n of MOCK_NEWS) {
                await addDoc(collection(db, 'news'), { ...n, createdAt: serverTimestamp() });
            }

            // 5. Popular Campaigns
            setStatus('5/5: Criando campanhas...');
            for (const c of MOCK_CAMPAIGNS) {
                await addDoc(collection(db, 'campaigns'), { ...c, createdAt: serverTimestamp() });
            }

            setStatus('Sucesso! Banco de dados reestruturado e populado.');
        } catch (error) {
            console.error(error);
            setStatus('Erro Crítico: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-xl border border-slate-600 my-8 mx-4 md:mx-0">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-600 pb-4">
                <div className="p-2 bg-indigo-500 rounded-lg">
                    <Database size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Admin Database Tools</h3>
                    <p className="text-xs text-slate-400">Ambiente de Desenvolvimento</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded-lg flex gap-3 items-start">
                    <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                    <p className="text-xs text-yellow-200">Use esta ferramenta apenas para inicializar ou resetar o projeto. Todos os dados criados manualmente serão perdidos.</p>
                </div>

                <button
                    onClick={handleFullReset}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/50"
                >
                    {loading ? (
                        <span className="animate-pulse">Processando...</span>
                    ) : (
                        <>
                            <UploadCloud size={20} />
                            Resetar e Popular Banco de Dados
                        </>
                    )}
                </button>

                {status && (
                    <div className={`p-3 rounded-lg text-sm font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${status.includes('Erro') ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/30 text-green-300 border border-green-800'}`}>
                        {status.includes('Sucesso') && <CheckCircle size={16} />}
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
