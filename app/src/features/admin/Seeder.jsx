import React, { useState } from 'react';
import { seedDatabase } from '../../services/adminService';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

// Helper to generate mock merchants
const generateMockMerchants = () => {
    const plans = ['free', 'basic', 'professional', 'premium'];
    const categories = ['Alimentação', 'Serviços', 'Automotivo', 'Saúde', 'Beleza', 'Tecnologia'];
    let merchants = [];

    plans.forEach(plan => {
        for (let i = 1; i <= 10; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const isPremiumOrPro = ['premium', 'professional'].includes(plan);

            merchants.push({
                name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Store ${i}`,
                category: category,
                description: `Uma loja de exemplo do plano ${plan}. Qualidade e excelência em ${category}.`,
                phone: '11999999999',
                whatsapp: isPremiumOrPro || plan === 'basic' ? '11999999999' : '',
                address: `Av. Principal do Bairro, ${1000 + i}`,
                plan: plan,
                isPremium: ['premium', 'professional'].includes(plan),
                image: `https://picsum.photos/seed/${plan}-${category.toLowerCase()}-${i}/800/600`,
                socialLinks: isPremiumOrPro ? { instagram: '@loja', facebook: 'fb.com/loja', site: 'loja.com' } : null,
                gallery: isPremiumOrPro ? [
                    `https://picsum.photos/seed/${category.toLowerCase()}-interior-${i}/800/600`,
                    `https://picsum.photos/seed/${category.toLowerCase()}-product-${i}/800/600`,
                    `https://picsum.photos/seed/${category.toLowerCase()}-service-${i}/800/600`
                ] : [],
                rating: plan === 'premium' ? (4 + Math.random()).toFixed(1) : 0,
                views: Math.floor(Math.random() * 1000)
            });
        }
    });
    return merchants;
};

const MOCK_MERCHANTS = generateMockMerchants();

const MOCK_ADS = [
    {
        title: 'Promoção de Inauguração',
        description: 'Venha conhecer nosso novo espaço e ganhe 20% de desconto!',
        price: 'R$ 0,00',
        category: 'Alimentação',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Troca de Óleo Grátis',
        description: 'Na compra de 4 pneus, a troca de óleo é por nossa conta.',
        price: 'R$ 1200,00',
        category: 'Automotivo',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
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
        title: 'Nova Ciclofaixa na Avenida Principal',
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

    const isDev = import.meta.env.DEV;
    const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

    const handleFullReset = async () => {
        if (!isDev) {
            addLog('BLOQUEADO: Seeder indisponível em ambiente de produção.');
            setStatus('error');
            return;
        }
        setLoading(true);
        setStatus(null);
        setLogs([]);
        addLog('Iniciando seed no Supabase...');

        try {
            addLog('Inserindo Comércios...');
            const merchantData = MOCK_MERCHANTS.map(m => ({
                name: m.name,
                category: m.category,
                description: m.description,
                phone: m.phone,
                whatsapp: m.whatsapp,
                address: m.address,
                plan: m.plan,
                image_url: m.image,
                is_active: true,
                neighborhood: NEIGHBORHOOD,
            }));

            addLog('Inserindo Anúncios...');
            const adData = MOCK_ADS.map(ad => ({
                title: ad.title,
                description: ad.description,
                price: parseFloat(ad.price.replace(/[^\d.,]/g, '').replace(',', '.')) || null,
                category: ad.category,
                status: 'active',
                neighborhood: NEIGHBORHOOD,
            }));

            addLog('Inserindo Notícias...');
            const newsData = MOCK_NEWS.map(n => ({
                title: n.title,
                content: n.content,
                category: n.category,
                status: 'active',
                neighborhood: NEIGHBORHOOD,
            }));

            addLog('Inserindo Campanhas...');
            const campaignData = MOCK_CAMPAIGNS.map(c => ({
                title: c.title,
                description: c.description,
                organizer: c.organizer,
                goal: c.goal,
                raised: c.raised,
                progress: c.progress,
                status: 'active',
                neighborhood: NEIGHBORHOOD,
            }));

            await seedDatabase(merchantData, adData, newsData, campaignData);

            addLog('Sucesso! Banco de dados populado.');
            setStatus('success');
        } catch (error) {
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
                    <p className="text-slate-400 text-sm">Popule o Supabase com dados de teste</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${isDev
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-red-500/20 border-red-500/40'
                }`}>
                    <div className="flex items-start gap-3">
                        <AlertTriangle className={isDev ? 'text-yellow-500' : 'text-red-400'} size={18} />
                        <div className="text-sm">
                            {isDev ? (
                                <p className="text-yellow-200"><span className="font-bold">Atenção Desenvolvedor</span> — Esta ação criará dezenas de registros no banco. Use com cautela em produção.</p>
                            ) : (
                                <p className="text-red-300"><span className="font-bold">BLOQUEADO EM PRODUÇÃO</span> — Seeder disponível apenas em <code>npm run dev</code>.</p>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleFullReset}
                    disabled={loading || !isDev}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading || !isDev
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
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
