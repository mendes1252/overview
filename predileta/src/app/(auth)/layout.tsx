export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Predileta</h1>
          <p className="text-teal-200 mt-1 text-sm">Lavanderia Premium</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">{children}</div>
      </div>
    </div>
  );
}
