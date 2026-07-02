import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] mt-0">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-black text-2xl tracking-tight mb-4">SHOP.CO</h2>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed mb-6">
            We have clothes that suit your style and which you are proud to wear. From women to men.
          </p>
          <div className="flex gap-3">
            {["X", "f", "ig", "in"].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-xs font-semibold hover:bg-black hover:text-white transition"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-xs tracking-widest uppercase mb-4">Company</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {["About", "Features", "Works", "Career"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-black transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-xs tracking-widest uppercase mb-4">Help</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"].map(
              (item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-black transition">
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-xs tracking-widest uppercase mb-4">FAQ</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {["Account", "Manage Deliveries", "Orders", "Payments"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-black transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex gap-3">
          {["VISA", "MC", "PayPal", "Pay", "GPay"].map((p) => (
            <span key={p} className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

