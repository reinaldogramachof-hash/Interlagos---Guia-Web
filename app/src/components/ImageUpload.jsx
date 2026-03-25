import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useToast } from './Toast';

export default function ImageUpload({ preview, onFileSelect, label = "Foto (máx. 2MB)" }) {
  const showToast = useToast();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande. Máximo 2MB.', 'error');
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida.', 'error');
      e.target.value = '';
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group w-32 h-32 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:border-indigo-400 transition-all"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-indigo-500">
            <Camera size={32} strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase">Selecionar</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30"><ImageIcon size={20} className="text-white" /></div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
      {label && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>}
    </div>
  );
}
