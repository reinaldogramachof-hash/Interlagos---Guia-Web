import React, { useState, useRef } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useToast } from '../../../../components/Toast';
import { updateUserProfile } from '../../../../services/authService';
import { uploadImage } from '../../../../services/storageService';

export default function SettingsTab({ currentUser }) {
  const showToast = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(currentUser?.photoURL || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return showToast('Imagem muito grande. Máximo 2MB.', 'error');
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return showToast('O nome não pode estar vazio.', 'error');
    setLoading(true);

    try {
      let photoURL = currentUser?.photoURL;
      
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const filename = `${Date.now()}.${fileExt}`;
        const path = `avatars/${currentUser.uid}/${filename}`;
        photoURL = await uploadImage('avatars', photoFile, path);
      }

      await updateUserProfile(currentUser.uid, { 
        display_name: displayName, 
        photo_url: photoURL 
      });
      
      showToast('Perfil atualizado!', 'success');
    } catch (err) {
      console.error('SettingsTab Error:', err);
      showToast('Erro ao atualizar perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-500">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Configurações de Perfil</h3>
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-emerald-50 flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <span className="text-3xl font-bold text-emerald-600 uppercase">
                  {displayName?.[0] || currentUser?.displayName?.[0] || '?'}
                </span>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
            >
              <Camera size={16} />
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome de Exibição</label>
              <input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
              <input 
                value={currentUser?.email || ''} 
                readOnly 
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm cursor-not-allowed opacity-60" 
              />
              <p className="text-[10px] text-slate-400 ml-1 italic">O e-mail não pode ser alterado aqui.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
