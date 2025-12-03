import React, { useState } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Database, Trash2, UploadCloud } from 'lucide-react';
import { mockData } from './mockData';

export default function Seeder() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const seedDatabase = async () => {
        setLoading(true);
        setStatus('Populando banco de dados...');
        try {
            for (const merchant of mockData) {
                // Remove ID se existir para deixar o Firestore gerar
                const { id, ...data } = merchant;
                await addDoc(collection(db, "merchants"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
            }
            setStatus(`Sucesso! ${mockData.length} comércios adicionados.`);
        } catch (error) {
            console.error(error);
            setStatus('Erro ao popular: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearDatabase = async () => {
        if (!window.confirm('CUIDADO: Isso vai apagar TODOS os comércios do banco de dados. Tem certeza?')) return;

        setLoading(true);
        setStatus('Limpando banco de dados...');
        try {
            const querySnapshot = await getDocs(collection(db, "merchants"));
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            setStatus(`Sucesso! ${querySnapshot.size} registros apagados.`);
        } catch (error) {
            console.error(error);
            setStatus('Erro ao limpar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const seedPlans = async () => {
        setLoading(true);
        setStatus('Criando planos...');
        try {
            const plans = [
                {
                    planId: 'basic_v1',
                    name: 'Plano Básico',
                    price: 0,
                    currency: 'BRL',
                    features: ['Nome', 'Endereço', 'Telefone'],
                    description: 'Entrada gratuita no guia para visibilidade básica.',
                    isActive: true,
                    version: 1,
                    createdAt: serverTimestamp()
                },
                {
                    planId: 'premium_v1',
                    name: 'Plano Premium',
                    price: 29.90,
                    currency: 'BRL',
                    features: ['Destaque na Home', '3 Fotos', 'Link WhatsApp', 'Descrição Completa'],
                    description: 'Destaque-se com fotos e link direto para WhatsApp.',
                    isActive: true,
                    version: 1,
                    createdAt: serverTimestamp()
                }
            ];

            for (const plan of plans) {
                await addDoc(collection(db, "plans"), plan);
            }
            setStatus('Planos criados com sucesso!');
        } catch (error) {
            console.error(error);
            setStatus('Erro ao criar planos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const seedChatHistory = async () => {
        const user = auth.currentUser;
        if (!user) {
            setStatus('Erro: Faça login para gerar histórico de chat.');
            return;
        }

        setLoading(true);
        setStatus('Gerando histórico de chat...');
        try {
            // Criar/Atualizar documento do usuário
            const userRef = doc(db, "users", user.uid);
            // Tenta atualizar, se falhar (não existe), ignora por enquanto pois o app cria no login
            // Mas para garantir, vamos usar setDoc com merge se importássemos, mas aqui vamos apenas tentar update
            // Se o usuário logou, o documento deve existir se o App.jsx estiver criando.
            // Se não, vamos apenas logar o erro.
            await updateDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                lastVisited: serverTimestamp(),
                currentContext: { pageName: 'Seeder', pageUrl: '/seeder' }
            }).catch(err => console.log("Usuário doc não encontrado, criando chat mesmo assim..."));

            // Adicionar mensagens na subcoleção
            const messages = [
                { sender: 'chatbot', messageContent: 'Olá! Como posso ajudar você hoje?', chatbotPersona: 'recepcionista' },
                { sender: 'user', messageContent: 'Gostaria de saber mais sobre o Plano Premium.' },
                { sender: 'chatbot', messageContent: 'O Plano Premium custa R$ 29,90 e inclui destaque na home e link para WhatsApp. Quer assinar?', chatbotPersona: 'vendedor' }
            ];

            const chatRef = collection(db, "users", user.uid, "chatHistory");
            for (const msg of messages) {
                await addDoc(chatRef, {
                    ...msg,
                    timestamp: serverTimestamp()
                });
            }
            setStatus('Histórico de chat gerado para ' + user.displayName);
        } catch (error) {
            console.error(error);
            setStatus('Erro ao gerar chat: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg mb-8 border border-slate-600">
            <div className="flex items-center gap-2 mb-4">
                <Database className="text-yellow-400" />
                <h3 className="font-bold">Ferramentas de Simulação (Genkit Data)</h3>
            </div>

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={seedDatabase}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <UploadCloud size={18} />
                    {loading ? '...' : 'Comércios'}
                </button>

                <button
                    onClick={seedPlans}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <UploadCloud size={18} />
                    {loading ? '...' : 'Planos'}
                </button>

                <button
                    onClick={seedChatHistory}
                    disabled={loading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <UploadCloud size={18} />
                    {loading ? '...' : 'Chat History'}
                </button>

                <button
                    onClick={clearDatabase}
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <Trash2 size={18} />
                    Limpar Comércios
                </button>
            </div>

            {status && <p className="mt-3 text-sm font-mono text-yellow-300">{status}</p>}
        </div>
    );
}
