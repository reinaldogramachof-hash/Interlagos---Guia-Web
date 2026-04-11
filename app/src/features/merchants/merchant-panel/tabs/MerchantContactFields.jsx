import React from 'react';

export default function MerchantContactFields({ formData, onChange }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label>
          <input
            name="whatsapp"
            value={formData.whatsapp}
            onChange={onChange}
            placeholder="11999999999"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone Fixo</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="1144445555"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Instagram (@)</label>
          <input
            name="instagram"
            value={formData.instagram}
            onChange={onChange}
            placeholder="seunegocio"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Endereço Completo</label>
        <input
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Rua Exemplo, 123 - Interlagos"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
        />
      </div>
    </>
  );
}
