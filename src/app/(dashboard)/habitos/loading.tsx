export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-white/[0.05] rounded-lg" />
          <div className="h-4 w-48 bg-white/[0.05] rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-white/[0.05] rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 bg-white/[0.05] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
