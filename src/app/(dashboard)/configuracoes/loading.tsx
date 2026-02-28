export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-white/[0.05] rounded-xl" />
        <div className="h-7 w-40 bg-white/[0.05] rounded-lg" />
      </div>
      <div className="bg-white/[0.05] rounded-2xl p-6 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 bg-white/[0.03] rounded" />
            <div className="h-10 bg-white/[0.03] rounded-xl" />
          </div>
        ))}
        <div className="h-11 bg-white/[0.03] rounded-xl" />
      </div>
    </div>
  );
}
