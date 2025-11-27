import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { Database, Trash2, UploadCloud } from 'lucide-react';
import { mockData } from './mockData';

export default function Seeder() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

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

    const seedDatabase = async () => {
        setLoading(true);
        setStatus('Iniciando importação...');

        try {
            let count = 0;
            for (const item of mockData) {
                // Remove id from mockData before adding to Firestore to let Firestore generate it
                const { id, ...dataToSave } = item;
                await addDoc(collection(db, "merchants"), {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                    views: Math.floor(Math.random() * 100) // Vistas aleatórias para simular uso
                });
                count++;
            }
            setStatus(`Sucesso! ${count} comércios importados.`);
        } catch (error) {
            console.error(error);
            setStatus('Erro ao importar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg mb-8 border border-slate-600">
            <div className="flex items-center gap-2 mb-4">
                <Database className="text-yellow-400" />
                <h3 className="font-bold">Ferramentas de Simulação (Desenvolvimento)</h3>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={seedDatabase}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <UploadCloud size={18} />
                    {loading ? 'Processando...' : 'Gerar Dados de Teste'}
                </button>

                <button
                    onClick={clearDatabase}
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <Trash2 size={18} />
                    Limpar Tudo
                </button>
            </div>

            {status && <p className="mt-3 text-sm font-mono text-yellow-300">{status}</p>}
        </div>
    );
}
