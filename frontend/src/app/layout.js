import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "SHOP.CO — Find Clothes That Match Your Style",
  description:
    "Shop the latest fashion trends at SHOP.CO. From casual wear to formal outfits, find your perfect style.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
