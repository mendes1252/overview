export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-white/[0.05] rounded-lg" />
          <div className="h-4 w-64 bg-white/[0.05] rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-white/[0.05] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/[0.05] rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/[0.05] rounded-2xl" />
            ))}
          </div>
          <div className="h-40 bg-white/[0.05] rounded-2xl" />
          <div className="h-36 bg-white/[0.05] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
