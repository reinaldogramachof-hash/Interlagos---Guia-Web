import React from 'react';
import { History, MapPin, Trees, Waves, Leaf } from 'lucide-react';
import { PageHero, MobileCard, SectionHeader } from '../../components/mobile';

const sections = [
  {
    title: 'Origem e Desenvolvimento Urbano',
    icon: MapPin,
    iconClass: 'bg-indigo-100 text-indigo-600',
    text: 'A história do bairro remete à segunda metade do século XX, período em que São José dos Campos se consolidava como polo tecnológico e industrial. O crescimento acelerado gerou demanda por habitação para a classe trabalhadora, transformando latifúndios e áreas de transição ambiental em um próspero centro residencial e comercial.'
  },
  {
    title: 'Identidade e Dinâmicas Sociais',
    icon: Trees,
    iconClass: 'bg-amber-100 text-amber-600',
    text: 'O Interlagos consolidou-se como um espaço de luta e conquista. O bairro acolheu famílias que buscavam qualidade de vida próxima aos centros industriais e desenvolveu uma identidade própria, marcada por vida comunitária pulsante.'
  },
  {
    title: 'O Lago: O Coração do Bairro',
    icon: Waves,
    iconClass: 'bg-blue-100 text-blue-600',
    text: 'Um dos marcos geográficos e sociais mais importantes do Parque Interlagos é o seu lago. Historicamente utilizado para lazer, ele passou por importantes processos de requalificação, devolvendo ao bairro um espaço público moderno e acolhedor.'
  },
  {
    title: 'Sustentabilidade e Futuro',
    icon: Leaf,
    iconClass: 'bg-emerald-100 text-emerald-600',
    text: 'Hoje, o Parque Interlagos enfrenta os desafios da urbanização moderna com um olhar atento à sustentabilidade. O equilíbrio entre desenvolvimento habitacional e preservação do espaço público é a chave para seu crescimento contínuo.'
  }
];

export default function HistoryView() {
  return (
    <div className="mobile-page animate-in fade-in slide-in-from-bottom-4">
      <PageHero
        section="news"
        title="Nossa História"
        subtitle="Parque Interlagos"
        icon={History}
        imageSrc={`${import.meta.env.BASE_URL}historia.png`}
      />

      <SectionHeader
        title="Tradição e transformação"
        subtitle="Zona Sul de São José dos Campos"
      />

      <div className="grid grid-cols-1 gap-4 px-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <MobileCard key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${section.iconClass}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{section.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                {section.text}
              </p>
            </MobileCard>
          );
        })}
      </div>

      <div className="px-4 pt-5">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <History size={28} className="mb-4 opacity-80" />
            <blockquote className="text-lg font-semibold leading-relaxed mb-4">
              “Mais do que um conjunto de ruas e quadras, somos uma comunidade que valoriza seu passado para construir um futuro mais verde, conectado e próspero.”
            </blockquote>
            <p className="text-indigo-200 text-sm font-medium">
              — História do Parque Interlagos · São José dos Campos, SP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
