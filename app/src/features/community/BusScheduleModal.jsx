import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// ── Horários estáticos — não persistidos no banco ──────────
const SCHEDULES = {
  '315': {
    weekdays: {
      from_terminal: [
        '05:20','05:55','06:20','06:50','07:20','07:30','07:40','07:55','08:10','08:25','08:35',
        '08:55','09:10','09:40','10:00','10:25','10:40','10:55','11:10','11:25','11:35','11:45','11:55','12:10',
        '12:30','12:45','13:00','13:20','13:30','13:40','13:50','14:10','14:25','14:40','14:50','15:00','15:10',
        '15:20','15:30','15:40','15:50','15:58','16:05','16:12','16:20','16:30','16:40','16:50','17:00','17:10',
        '17:22','17:30','17:38','17:47','17:57','18:05','18:20','18:24','18:36','18:48','18:58','19:10','19:25',
        '19:40','20:15','20:45','21:15','21:50','22:20','22:55','00:00',
      ],
      from_neighborhood: [
        '05:00','05:15','05:25','05:35','05:45','05:55','06:05','06:12','06:19','06:26','06:33',
        '06:40','06:47','06:54','07:05','07:15','07:25','07:35','07:45','07:55','08:05','08:15','08:25','08:40',
        '08:55','09:10','09:25','09:40','09:55','10:20','10:45','11:10','11:25','11:40','11:55','12:10','12:20',
        '12:30','12:40','12:55','13:15','13:30','13:50','14:05','14:15','14:25','14:35','14:55','15:05','15:20',
        '15:35','15:45','15:55','16:05','16:15','16:35','16:50','17:00','17:10','17:20','17:30','17:40','17:50',
        '18:00','18:20','18:40','18:45','18:55','19:05','19:25','19:35','20:00','20:25','21:00','21:25','21:55',
        '23:00','23:35',
      ],
    },
    saturdays: {
      from_terminal: [
        '05:00','06:00','06:50','07:15','07:40','08:00','08:15','08:40','09:05','09:30','10:00',
        '10:20','10:55','11:20','11:45','12:10','12:30','12:45','13:00','13:30','13:55','14:20','14:40','15:00',
        '15:25','15:45','16:00','16:25','16:45','17:05','17:30','18:10','18:45','19:20','20:00','21:00','21:35',
        '22:15','22:40','23:10',
      ],
      from_neighborhood: [
        '05:10','05:40','06:15','06:40','07:00','07:15','07:30','07:55','08:20','08:40','08:55',
        '09:20','09:45','10:10','10:40','11:05','11:35','12:00','12:25','12:50','13:10','13:25','13:45','14:15',
        '14:40','15:00','15:20','15:40','16:05','16:25','17:05','17:45','18:10','18:50','19:25','20:00','20:40',
        '21:40','22:10','23:15',
      ],
    },
    sundays: {
      from_terminal: [
        '05:05','06:15','06:50','07:30','08:10','09:00','09:45','10:25','10:55','11:30','12:10',
        '12:40','13:15','13:55','14:20','14:55','15:35','16:15','17:10','18:00','19:00','19:55','21:25','22:30','23:10',
      ],
      from_neighborhood: [
        '05:10','05:45','06:20','06:55','07:30','08:10','08:50','09:40','10:25','11:05','11:35',
        '12:10','12:50','13:20','13:55','14:35','15:00','16:15','16:55','17:50','18:40','19:40','20:35','22:05','23:10',
      ],
    },
  },
  '316': {
    weekdays: {
      from_terminal: [
        { t: '05:40', fj: true }, '06:30','07:20','08:20','09:00','10:25','11:05','11:55','12:40','13:25',
        '14:20', { t: '15:00', fj: true }, '15:55','16:40','17:45', { t: '18:35', fj: true }, '19:15','20:40','21:20','23:05',
      ],
      from_neighborhood: [
        '04:50','05:30','06:20','07:10','08:05','09:00','09:40','11:00','11:45','12:30','13:15',
        '14:00','15:00','15:40', { t: '16:40', fj: true }, '17:25','18:20','19:15','19:50', { t: '22:05', fj: true },
      ],
    },
    saturdays: {
      from_terminal: [
        '06:45', { t: '08:15', fj: true }, '09:45','11:45', { t: '14:20', fj: true }, '16:00','17:45','19:20','21:30',
      ],
      from_neighborhood: [
        '05:45','07:25','08:55','10:25','12:25','15:10', { t: '16:50', fj: true }, '18:35','20:10',
      ],
    },
    sundays: {
      // Documento oficial: 2 FJ no terminal (08:15FJ e 14:20FJ) | 1 FJ no bairro (16:50FJ)
      from_terminal: [
        '06:45', { t: '08:15', fj: true }, '09:45','11:45', { t: '14:20', fj: true }, '16:00','19:20',
      ],
      from_neighborhood: [
        '05:45','07:25','08:55','10:25','12:25','15:10', { t: '16:50', fj: true },
      ],
    },
  },
};

function ScheduleColumn({ title, times }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{title}</p>
      <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {times.map((item, i) => {
          const isFj = typeof item === 'object';
          const label = isFj ? item.t : item;
          return (
            <div
              key={i}
              className={`text-[12px] font-bold py-2 rounded-xl flex items-center justify-center transition-all ${
                isFj 
                  ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' 
                  : 'bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-0.5">
                {label}
                {isFj && <span className="text-[8px] font-black bg-amber-200 px-1 rounded-sm">FJ</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TAB_KEYS = [
  { key: 'weekdays',  label: 'Dias Úteis' },
  { key: 'saturdays', label: 'Sábado' },
  { key: 'sundays',   label: 'Dom e Feriados' },
];

const LINE_NAMES = {
  '315': 'Parque Interlagos / Terminal Central',
  '316': 'Torrão de Ouro / Terminal Central',
};

export default function BusScheduleModal({ isOpen, onClose, line }) {
  const [activeTab, setActiveTab] = useState('weekdays');

  // Reseta a aba ao trocar de linha para evitar estado obsoleto
  useEffect(() => {
    if (isOpen) setActiveTab('weekdays');
  }, [line, isOpen]);

  if (!isOpen || !line) return null;

  const schedule = SCHEDULES[line];
  const dayData  = schedule?.[activeTab];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-brand-600 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Linha {line}</p>
            <h2 className="font-bold text-sm leading-tight text-white">{LINE_NAMES[line]}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white font-bold text-sm">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3 bg-slate-50 border-b border-slate-100">
          {TAB_KEYS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.key ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {line === '316' && (
            <p className="text-[10px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg mb-3 font-medium flex items-center gap-1.5">
              <span className="font-black">FJ</span> = Desvio com parada no Hospital Francisca Júlia
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-4">
            {dayData && (
              <>
                <ScheduleColumn title="Do Terminal" times={dayData.from_terminal} />
                <div className="h-px bg-slate-100 sm:hidden" /> {/* Separador visual no mobile */}
                <ScheduleColumn title="Do Bairro" times={dayData.from_neighborhood} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

