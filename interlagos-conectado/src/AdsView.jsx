import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

export default function AdsView() {
    return (
        <div className="p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-3xl text-white text-center mb-8 shadow-xl">
                <Megaphone className="mx-auto mb-4 text-yellow-300" size={48} />
                <h2 className="text-3xl font-bold mb-2">Classificados & Anúncios</h2>
                <p className="text-indigo-100 max-w-md mx-auto">
                    Um espaço exclusivo para ofertas, vagas de emprego e oportunidades no bairro.
                </p>
            </div>

            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-400 mb-2">Em Breve</h3>
                <p className="text-gray-400 mb-6">Estamos preparando as melhores ofertas para você.</p>
                <button className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-100 transition-colors">
                    Quero Anunciar
                </button>
            </div>
        </div>
    );
}
