import { Home, Newspaper, Tag, Heart } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'merchants', label: 'Home', icon: Home },
  { id: 'news', label: 'Jornal', icon: Newspaper },
  { id: 'ads', label: 'Classificados', icon: Tag },
  { id: 'donations', label: 'Campanhas', icon: Heart },
];

export default function BottomNav({ currentView, onNavigate, onCreateAd }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-indigo-600 rounded-t-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
