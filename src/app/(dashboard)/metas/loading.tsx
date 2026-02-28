export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-7 w-28 bg-white/[0.05] rounded-lg" />
          <div className="h-4 w-52 bg-white/[0.05] rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-white/[0.05] rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-white/[0.05] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
