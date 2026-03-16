export function SkeletonCard({ count = 5 }) {
  return (
    <div className="flex flex-col gap-3 px-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-card p-3 flex gap-3 shadow-card border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 bg-gray-100 rounded-pill animate-pulse w-2/3" />
            <div className="h-3 bg-gray-100 rounded-pill animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded-pill animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonNewsCard({ count = 4 }) {
  return (
    <div className="flex flex-col gap-4 px-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden">
          <div className="h-40 bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
