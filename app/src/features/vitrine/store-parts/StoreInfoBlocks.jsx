import { Clock, MapPin, Info, ExternalLink } from 'lucide-react';
import { PLANS_CONFIG } from '../../../constants/plans';

function Block({ icon, title, children, accent }) {
  return (
    <section className="mx-4 mb-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
        <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </span>
        {title}
      </h3>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export function StoreAbout({ merchant, storeColor }) {
  const text = merchant.store_description || merchant.description;
  if (!text) return null;
  return (
    <Block icon={<Info size={15} />} title="Sobre" accent={storeColor}>
      <p className="whitespace-pre-line">{text}</p>
    </Block>
  );
}

export function StoreHours({ merchant, storeColor }) {
  if (!merchant.hours) return null;
  return (
    <Block icon={<Clock size={15} />} title="Horário de Atendimento" accent={storeColor}>
      <p className="whitespace-pre-line">{merchant.hours}</p>
    </Block>
  );
}

export function StoreLocation({ merchant, storeColor }) {
  if (!merchant.address) return null;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.address)}`;
  return (
    <Block icon={<MapPin size={15} />} title="Localização" accent={storeColor}>
      <p className="mb-3">{merchant.address}</p>
      <a
        href={mapHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border"
        style={{ color: storeColor, borderColor: storeColor }}
      >
        <ExternalLink size={14} /> Abrir no Google Maps
      </a>
    </Block>
  );
}

export function StoreExternalUrl({ merchant, storeColor }) {
  const planConfig = PLANS_CONFIG[merchant?.plan || 'free'] || PLANS_CONFIG.free;
  if (!merchant.store_url || !planConfig.hasStoreUrl) return null;
  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => window.open(merchant.store_url, '_blank', 'noopener,noreferrer')}
        className="w-full h-11 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-150 cursor-pointer"
        style={{ color: storeColor, borderColor: storeColor }}
      >
        <ExternalLink size={16} /> Ver Loja Completa
      </button>
    </div>
  );
}
