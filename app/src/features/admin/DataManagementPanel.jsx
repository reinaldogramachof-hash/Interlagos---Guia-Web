import React, { useState } from 'react';
import { backupDatabase, resetDatabase } from '../../services/adminService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/Toast';
import { Save, Trash2, ShieldAlert } from 'lucide-react';
import DataManagementBackupModal from './DataManagementBackupModal';
import DataManagementResetModal from './DataManagementResetModal';

export default function DataManagementPanel() {
    const showToast = useToast();
    const { currentUser } = useAuth();
    const [loadingBackup, setLoadingBackup] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

    const actor = { id: currentUser?.id, email: currentUser?.email };

    const handleBackup = async () => {
        setLoadingBackup(true);
        try {
            const data = await backupDatabase(actor);
            const exportData = {
                exportedAt: new Date().toISOString(),
                exportedBy: currentUser?.email || currentUser?.id,
                neighborhood: NEIGHBORHOOD,
                ...data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            link.download = `backup-${NEIGHBORHOOD}-${dateStr}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast('Backup exportado com sucesso!', 'success');
            setShowBackupModal(false);
        } catch (error) {
            console.error('Erro no backup:', error);
            showToast('Erro ao gerar backup: ' + error.message, 'error');
        } finally {
            setLoadingBackup(false);
        }
    };

    const handleReset = async ({ word }) => {
        if (word !== 'RESETAR') {
            showToast('Palavra de confirmação incorreta', 'error');
            return;
        }

        setLoadingReset(true);
        try {
            await resetDatabase(actor);
            showToast('Banco de dados resetado com sucesso!', 'success');
            setShowResetModal(false);
        } catch (error) {
            console.error('Erro no reset:', error);
            showToast('Erro ao resetar: ' + error.message, 'error');
        } finally {
            setLoadingReset(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Save size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Backup do Sistema</h3>
                        <p className="text-slate-400 text-sm">Exportar todos os dados reais em formato JSON</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowBackupModal(true)}
                    className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                >
                    <Save size={20} />
                    Exportar Dados Reais
                </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-red-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldAlert size={120} />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-400">Reset Total do Sistema</h3>
                        <p className="text-red-300/70 text-sm">Apagar permanentemente todos os dados de conteúdo</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowResetModal(true)}
                    className="w-full relative z-10 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-red-600/80 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border border-red-500/50"
                >
                    <Trash2 size={20} />
                    Apagar Todos os Dados
                </button>
            </div>

            <DataManagementBackupModal
                show={showBackupModal}
                loading={loadingBackup}
                onClose={() => setShowBackupModal(false)}
                onConfirm={handleBackup}
            />

            <DataManagementResetModal
                show={showResetModal}
                loading={loadingReset}
                onClose={() => setShowResetModal(false)}
                onConfirm={handleReset}
                userEmail={currentUser?.email}
            />
        </div>
    );
}
