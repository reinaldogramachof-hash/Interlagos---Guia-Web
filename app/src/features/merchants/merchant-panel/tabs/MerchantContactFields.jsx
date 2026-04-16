import React from 'react';

export default function MerchantContactFields({ formData, onChange, hasSocialLinks = false }) {
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
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone Fixo</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="1144445555"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Instagram (@)</label>
          <input
            name="instagram"
            value={formData.instagram}
            onChange={onChange}
            maxLength={100}
            disabled={!hasSocialLinks}
            title={!hasSocialLinks ? "Disponível a partir do plano Pro" : ""}
            placeholder="seunegocio"
            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm ${
              !hasSocialLinks ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Site / Link</label>
        <input
          name="website"
          value={formData.website}
          onChange={onChange}
          placeholder="https://seunegocio.com.br"
          maxLength={300}
          disabled={!hasSocialLinks}
          title={!hasSocialLinks ? "Disponível a partir do plano Pro" : ""}
          className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm ${
            !hasSocialLinks ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Endereço Completo</label>
        <input
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Rua Exemplo, 123 - Interlagos"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Horário de Funcionamento</label>
        <input
          name="opening_hours"
          value={formData.opening_hours}
          onChange={onChange}
          placeholder="Seg–Sex: 8h–18h | Sáb: 8h–13h"
          maxLength={200}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-sm"
        />
        <p className="text-[10px] text-slate-400 ml-1">Ex: Seg–Sex: 8h–18h | Sáb: 8h–13h | Dom: Fechado</p>
      </div>
    </>
  );
}
