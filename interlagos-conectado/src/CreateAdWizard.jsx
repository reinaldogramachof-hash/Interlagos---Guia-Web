import React, { useState } from 'react';
import { Camera, ChevronRight, ChevronLeft, Check, Upload } from 'lucide-react';
import Modal from './Modal';

export default function CreateAdWizard({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        price: '',
        description: '',
        images: []
    });

    const categories = ['Vendas', 'Empregos', 'Imóveis', 'Serviços'];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui entraria a lógica de envio para o Firebase
        alert("Anúncio enviado para aprovação!");
        onClose();
        setStep(1);
        setFormData({ category: '', title: '', price: '', description: '', images: [] });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Anúncio">
            <div className="py-2">
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

                    {/* STEP 2: Fotos */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800">Adicione Fotos</h3>
                                <p className="text-sm text-gray-500">Mostre os detalhes do seu produto</p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                                    <Camera size={32} className="text-indigo-600" />
                                </div>
                                <span className="font-bold text-indigo-600">Adicionar Fotos</span>
                                <span className="text-xs text-gray-400 mt-1">Até 5 imagens</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Detalhes */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Título do Anúncio</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: Bicicleta Aro 29 seminova"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
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
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
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
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                <Check size={20} /> Publicar Anúncio
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
