import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { uploadImage } from '../../../../services/storageService';
import { createMerchant, updateMerchant } from '../../../../services/merchantService';
import { updateUserProfile, getUserRole } from '../../../../services/authService';
import { useToast } from '../../../../components/Toast';
import { categories } from '../../../../constants/categories';
import ImageSection from './ImageSection';
import MerchantContactFields from './MerchantContactFields';

export default function SettingsTab({ merchant, currentUser, onUpdate }) {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(merchant?.image_url || '');

  const [formData, setFormData] = useState({
    name: merchant?.name || '',
    description: merchant?.description || '',
    category: merchant?.category || 'Outros',
    phone: merchant?.phone || '',
    whatsapp: merchant?.whatsapp || '',
    instagram: merchant?.instagram || '',
    address: merchant?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (file) {
      showToast('Imagem muito grande. Máximo 2MB.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return showToast('O nome é obrigatório', 'error');
    setLoading(true);

    try {
      let imageUrl = merchant?.image_url || '';
      if (imageFile) {
        const path = `merchants/${currentUser.uid}/${Date.now()}.${imageFile.name.split('.').pop()}`;
        imageUrl = await uploadImage('merchant-images', imageFile, path);
      }

      const merchantData = { ...formData, image_url: imageUrl, owner_id: currentUser.uid, neighborhood: import.meta.env.VITE_NEIGHBORHOOD };

      if (merchant?.id && merchant.id !== 'temp_dev') {
        await updateMerchant(merchant.id, merchantData);
        showToast('Perfil atualizado!', 'success');
        onUpdate({ ...merchant, ...merchantData });
      } else {
        merchantData.is_active = false;
        merchantData.plan = 'free';
        const newMerchant = await createMerchant(merchantData);
        
        try {
          const role = await getUserRole(currentUser.uid);
          if (role !== 'master' && role !== 'admin') {
            await updateUserProfile(currentUser.uid, { role: 'merchant' });
          }
        } catch (roleError) { console.warn('SettingsTab: role update falhou:', roleError); }

        showToast('Cadastro realizado! Aguarde aprovação.', 'success');
        onUpdate(newMerchant);
      }
    } catch (error) { showToast('Erro ao salvar.', 'error'); }
    finally { setLoading(false); }
  };

  const formCategories = categories.filter(c => c.id !== 'Todos');

  return (
    <>
      {merchant?.id && merchant.id !== 'temp_dev' && !merchant?.is_active && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
          <span className="text-amber-500 text-xl">⏳</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">Cadastro em análise</p>
            <p className="text-amber-700 text-xs mt-0.5">Seu negócio está aguardando aprovação administrativa.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8">
          <ImageSection imagePreview={imagePreview} onImageChange={handleImageChange} />
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Negócio</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Padaria do Bairro" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Categoria</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm">
                  {formCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição Curta</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Conte um pouco..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
            </div>
          </div>
        </div>

        <MerchantContactFields formData={formData} onChange={handleChange} />

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {merchant?.id && merchant.id !== 'temp_dev' ? 'Salvar Alterações' : 'Concluir Cadastro'}
          </button>
        </div>
      </form>
    </>
  );
}
