import React, { useState } from 'react';
import { Camera, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { createAd } from '../../services/adsService';
import { uploadImage } from '../../services/storageService';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/ImageUpload';
import { useToast } from '../../components/Toast';

const CategoryStep = ({ selected, onSelect }) => {
    const categories = ['Vendas', 'Empregos', 'Imóveis', 'Serviços'];
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-6">O que você vai anunciar?</h3>
            <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                    <button
                        key={cat} type="button" onClick={() => onSelect(cat)}
                        className={`p-4 rounded-xl border-2 font-bold transition-all
                            ${selected === cat ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function CreateAdWizard({ isOpen, onClose, user }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ category: '', title: '', price: '', whatsapp: '', description: '', image: '' });
    const [imageFile, setImageFile] = useState(null);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return showToast("Logue para publicar!", "error");
        setIsSubmitting(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                const ext = imageFile.name.split('.').pop();
                const path = `ads/${user.uid}/${Date.now()}.${ext}`;
                imageUrl = await uploadImage('ad-images', imageFile, path);
            }
            await createAd({
                ...formData,
                image_url: imageUrl,
                status: 'pending',
                seller_id: user.uid,
                price: parseFloat(formData.price.replace(/[^\d.,]/g, '').replace(',', '.')) || null,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            showToast("Sucesso! Aguarde aprovação.", "success");
            onClose(); setStep(1); setImageFile(null);
            setFormData({ category: '', title: '', price: '', whatsapp: '', description: '', image: '' });
        } catch (error) {
            console.error(error);
            showToast("Erro ao publicar anúncio. Tente novamente.", "error");
        }
        finally { setIsSubmitting(false); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Anúncio">
            <div className="py-2">
                <div className="flex items-center justify-between mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                            {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-gray-100'}`} />}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && <CategoryStep selected={formData.category} onSelect={cat => setFormData({ ...formData, category: cat })} />}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800">Adicione uma Foto</h3>
                                <p className="text-sm text-gray-500 mb-4">Opcional — aumenta as chances de venda.</p>
                            </div>
                            <div className="flex justify-center">
                                <ImageUpload preview={imageFile ? URL.createObjectURL(imageFile) : formData.image} onFileSelect={setImageFile} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <input type="text" placeholder="Título" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Preço (R$)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                <input type="text" placeholder="WhatsApp" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} required />
                            </div>
                            <textarea className="w-full p-3 rounded-xl border border-gray-200 outline-none h-24 resize-none" placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        {step < 3 ? (
                            <button type="button" onClick={() => setStep(step + 1)} disabled={step === 1 && !formData.category} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Próximo <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                {isSubmitting ? 'Enviando...' : <><Check size={20} /> Publicar</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
