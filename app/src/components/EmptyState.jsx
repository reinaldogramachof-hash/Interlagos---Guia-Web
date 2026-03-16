export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="text-gray-800 font-bold mb-1 text-base">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 bg-brand-600 text-white px-5 py-2.5 rounded-card 
                     font-bold text-sm hover:bg-brand-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
