import { Phone, Navigation, Instagram, Globe } from 'lucide-react';
import { cleanWhatsapp } from '../../../utils/whatsapp';

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function StoreQuickActions({ merchant }) {
  const hasWhatsapp = !!merchant.whatsapp;
  const hasPhone = !!merchant.phone;
  const hasAddress = !!merchant.address;
  const hasInstagram = !!merchant.instagram;
  const hasSite = !!(merchant.social_links?.site || merchant.store_url);

  const waHref = hasWhatsapp
    ? `https://wa.me/${cleanWhatsapp(merchant.whatsapp)}?text=${encodeURIComponent(
        `Olá! Vi sua loja "${merchant.name}" no Tem no Bairro e gostaria de mais informações.`
      )}`
    : null;

  const phoneHref = hasPhone ? `tel:+55${merchant.phone.replace(/\D/g, '')}` : null;
  const mapHref = hasAddress ? mapsUrl(merchant.address) : null;
  const igHref = hasInstagram
    ? `https://instagram.com/${String(merchant.instagram).replace('@', '')}`
    : null;
  const siteHref = merchant.social_links?.site || merchant.store_url || null;

  const actions = [
    hasWhatsapp && {
      key: 'wa',
      label: 'WhatsApp',
      href: waHref,
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.882l6.195-1.624A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    hasPhone && {
      key: 'phone',
      label: 'Ligar',
      href: phoneHref,
      cls: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Phone size={14} />,
    },
    hasAddress && {
      key: 'map',
      label: 'Como chegar',
      href: mapHref,
      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <Navigation size={14} />,
    },
    hasInstagram && {
      key: 'ig',
      label: 'Instagram',
      href: igHref,
      cls: 'bg-pink-50 text-pink-700 border-pink-200',
      icon: <Instagram size={14} />,
    },
    hasSite && {
      key: 'site',
      label: 'Site',
      href: siteHref,
      cls: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <Globe size={14} />,
    },
  ].filter(Boolean);

  if (actions.length === 0) return null;

  return (
    <nav aria-label="Ações de contato" className="px-4 mb-4 flex gap-2 flex-wrap">
      {actions.map((a) => (
        <a
          key={a.key}
          href={a.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs font-bold px-3 py-1.5 rounded-full border min-h-[36px] flex items-center gap-1.5 active:scale-95 transition-transform duration-150 cursor-pointer ${a.cls}`}
        >
          {a.icon}
          {a.label}
        </a>
      ))}
    </nav>
  );
}
