export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0 animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-7 w-48 bg-white/[0.05] rounded-lg" />
        <div className="h-4 w-72 bg-white/[0.05] rounded-lg" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 bg-white/[0.05] rounded-2xl" />
          <div className="h-64 bg-white/[0.05] rounded-2xl" />
          <div className="h-48 bg-white/[0.05] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-white/[0.05] rounded-2xl" />
          <div className="h-36 bg-white/[0.05] rounded-2xl" />
          <div className="h-28 bg-white/[0.05] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
