import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-gray-100 mb-0">404</p>
      <h2 className="text-2xl font-black uppercase mb-3 -mt-4">Page Not Found</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="border border-gray-300 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
