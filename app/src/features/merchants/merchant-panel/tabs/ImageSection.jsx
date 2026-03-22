import React from 'react';
import { Camera } from 'lucide-react';

export default function ImageSection({ imagePreview, onImageChange }) {
  return (
    <div className="flex flex-col items-center gap-4 shrink-0">
      <div className="relative group">
        <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera size={32} className="text-slate-400" />
          )}
        </div>
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
          <Camera className="text-white" />
          <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </label>
      </div>
      <p className="text-xs text-slate-500 font-medium">Foto do Comércio (Máx 2MB)</p>
    </div>
  );
}
