// Shared auth card wrapper used by all auth pages
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 sm:p-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-center mb-1">{title}</h1>
        {subtitle && (
          <p className="text-center text-sm text-gray-500 mb-8">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
