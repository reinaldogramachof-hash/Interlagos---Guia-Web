import React, { useState } from 'react';
import { Camera, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Modal from './Modal';

export default function CreateAdWizard({ isOpen, onClose, user }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        price: '',
        whatsapp: '',
        description: '',
        image: '' // URL simples por enquanto
    });

    const categories = ['Vendas', 'Empregos', 'Imóveis', 'Serviços'];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Você precisa estar logado para publicar um anúncio!");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'ads'), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'active',
                userId: user.uid,
                userName: user.displayName || 'Usuário Anônimo',
                userPhoto: user.photoURL || null
            });
            alert("Anúncio publicado com sucesso!");
            onClose();
            setStep(1);
            setFormData({ category: '', title: '', price: '', whatsapp: '', description: '', image: '' });
        } catch (error) {
            console.error("Erro ao publicar:", error);
            alert("Erro ao publicar anúncio.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Anúncio">
            <div className="py-2">
                {!user && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <span className="font-bold">Atenção:</span> Você precisa fazer login para publicar.
                    </div>
                )}

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-gray-100'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* STEP 1: Categoria */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-gray-800 text-center mb-6">O que você vai anunciar?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all
                                            ${formData.category === cat
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Fotos (Simplificado) */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800">Adicione uma Foto</h3>
                                <p className="text-sm text-gray-500">Cole a URL de uma imagem (ex: Unsplash) por enquanto.</p>
                            </div>

                            <input
                                type="text"
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                                <Camera size={32} className="mb-2" />
                                <span className="text-xs">Upload de arquivo em breve</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Detalhes */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: Bicicleta Aro 29"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Preço</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="R$ 0,00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="11999998888"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                                    placeholder="Conte mais detalhes..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={step === 1 && !formData.category}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próximo <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                {isSubmitting ? 'Enviando...' : <><Check size={20} /> Publicar</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
