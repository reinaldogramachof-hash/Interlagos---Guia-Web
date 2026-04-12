import { useRef } from 'react';
import { Plus, X } from 'lucide-react';

export default function ImageGrid({ images, onAdd, onRemove }) {
  const fileInput = useRef(null);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) { e.target.value = ''; onAdd(file); }
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const imgObj = images[i];
          return (
            <div key={i} className="aspect-square relative rounded-lg overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {imgObj ? (
                <>
                  <img src={imgObj.url} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => onRemove(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors">
                    <X size={12} />
                  </button>
                  {i === 0 && <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Capa</div>}
                </>
              ) : (
                <div onClick={() => fileInput.current?.click()} className="cursor-pointer flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 w-full h-full justify-center">
                  <Plus size={20} /><span className="text-[10px] font-bold mt-0.5">Foto</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-center text-slate-500 dark:text-slate-400">Até 7 fotos • A primeira será a capa</p>
      <input type="file" accept="image/*" ref={fileInput} className="hidden" onChange={handleFileChange} />
    </div>
  );
}
