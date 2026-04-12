import React, { useState, useEffect } from 'react';
import { Camera, ChevronRight, ChevronLeft, Check, Plus, X } from 'lucide-react';
import { createAd, updateAd } from '../../services/adsService';
import { uploadImage } from '../../services/storageService';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { processImage } from '../../utils/imageProcessor';
import ImageGrid from './ImageGrid';

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

const EMPTY_FORM = { category: '', title: '', price: '', whatsapp: '', description: '', gallery_urls: [] };

export default function CreateAdWizard({ isOpen, onClose, user, initialAd = null }) {
    const isEditMode = !!initialAd;
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState(() => initialAd
        ? { 
            category: initialAd.category ?? '', 
            title: initialAd.title ?? '', 
            price: initialAd.price != null ? String(initialAd.price) : '', 
            whatsapp: initialAd.whatsapp ?? '', 
            description: initialAd.description ?? '', 
            gallery_urls: initialAd.gallery_urls ?? [] 
          }
        : EMPTY_FORM
    );

    const [images, setImages] = useState(() => 
        (isEditMode ? [initialAd?.image_url, ...(initialAd?.gallery_urls || [])].filter(Boolean) : []).map(url => ({ url, file: null }))
    );
    const showToast = useToast();

    useEffect(() => {
        if (isOpen && !isEditMode) {
            setFormData(EMPTY_FORM);
            setImages([]);
            setStep(1);
        }
    }, [isOpen, isEditMode]);

    const resetAndClose = () => {
        onClose();
        setStep(1);
        setImages(isEditMode ? [initialAd?.image_url, ...(initialAd?.gallery_urls || [])].filter(Boolean).map(url => ({ url, file: null })) : []);
        setFormData(isEditMode ? { ...formData } : EMPTY_FORM);
    };

    const handleAddImage = async (file) => {
        if (images.length >= 7) return showToast('Limite de 7 fotos atingido.', 'error');
        try {
            const processedFile = await processImage(file);
            setImages([...images, { url: URL.createObjectURL(processedFile), file: processedFile }]);
        } catch(e) {
            showToast('Erro ao processar imagem.', 'error');
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return showToast("Logue para publicar!", "error");
        setIsSubmitting(true);
        try {
            const uploadedUrls = await Promise.all(images.filter(i => i.file).map(async (img, idx) => {
                const path = `ads/${user.uid}/${Date.now()}_${idx}.jpg`;
                return await uploadImage('ad-images', img.file, path);
            }));

            const finalUrls = [];
            let uploadIdx = 0;
            for (const img of images) {
                finalUrls.push(img.file ? uploadedUrls[uploadIdx++] : img.url);
            }

            const parsedPrice = parseFloat(String(formData.price).replace(/[^\d.,]/g, '').replace(',', '.')) || null;
            const payload = { 
                ...formData, 
                image_url: finalUrls[0] || null, 
                gallery_urls: finalUrls.slice(1),
                price: parsedPrice 
            };

            if (isEditMode) {
                await updateAd(initialAd.id, payload);
                showToast("Anúncio atualizado!", "success");
            } else {
                await createAd({ 
                    ...payload, 
                    status: 'pending', 
                    seller_id: user.uid, 
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
                });
                showToast("Sucesso! Aguarde aprovação.", "success");
            }
            resetAndClose();
        } catch (error) {
            showToast(isEditMode ? "Erro ao atualizar anúncio." : "Erro ao publicar anúncio. Tente novamente.", "error");
        } finally { setIsSubmitting(false); }
    };

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title={isEditMode ? 'Editar Anúncio' : 'Criar Anúncio'}>
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
                    {step === 2 && <ImageGrid images={images} onAdd={handleAddImage} onRemove={handleRemoveImage} />}
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
                            <button type="submit" disabled={isSubmitting || !formData.title || !formData.price || !formData.whatsapp || !formData.description} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                {isSubmitting ? 'Enviando...' : <><Check size={20} /> Publicar</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
