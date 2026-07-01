import Link from "next/link";

const styles = [
  {
    name: "Casual",
    href: "/shop?style=casual",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  },
  {
    name: "Formal",
    href: "/shop?style=formal",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  },
  {
    name: "Party",
    href: "/shop?style=party",
    image: "https://images.unsplash.com/photo-1529139574466-a303027614b8?w=600&q=80",
  },
  {
    name: "Gym",
    href: "/shop?style=gym",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
];

export default function DressStyleGrid() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl sm:text-5xl font-black uppercase text-center tracking-tight mb-12">
          Browse By Dress Style
        </h2>

        {/* Grid: Casual(small) | Formal(tall) | Party(small) / Gym(wide) */}
        <div className="bg-[#F0F0F0] rounded-3xl p-5 flex flex-col gap-4">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Casual — small */}
            <Link
              href={styles[0].href}
              className="relative overflow-hidden rounded-2xl group flex-1"
            >
              <img
                src={styles[0].image}
                alt="Casual"
                className="w-full h-52 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-5 left-5 font-bold text-2xl text-black drop-shadow-sm">
                Casual
              </span>
            </Link>

            {/* Formal — tall */}
            <Link
              href={styles[1].href}
              className="relative overflow-hidden rounded-2xl group sm:flex-[2]"
            >
              <img
                src={styles[1].image}
                alt="Formal"
                className="w-full h-52 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-5 left-5 font-bold text-2xl text-black drop-shadow-sm">
                Formal
              </span>
            </Link>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Party — wide */}
            <Link
              href={styles[2].href}
              className="relative overflow-hidden rounded-2xl group sm:flex-[2]"
            >
              <img
                src={styles[2].image}
                alt="Party"
                className="w-full h-52 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-5 left-5 font-bold text-2xl text-black drop-shadow-sm">
                Party
              </span>
            </Link>

            {/* Gym — small */}
            <Link
              href={styles[3].href}
              className="relative overflow-hidden rounded-2xl group flex-1"
            >
              <img
                src={styles[3].image}
                alt="Gym"
                className="w-full h-52 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-5 left-5 font-bold text-2xl text-black drop-shadow-sm">
                Gym
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
