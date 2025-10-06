"use client";
import { motion } from "framer-motion";
import Image from "next/image";
const categories = [
  { title: "Beach", icon: "islands.svg", bgColor:"bg-sky-100", link: "#" },
  { title: "Nature", icon: "nature.svg",bgColor:"bg-red-100", link: "#" },
  { title: "Resorts", icon: "resorts.svg",bgColor:"bg-emerald-100", link: "#" },
  { title: "Farms", icon: "home-line.svg",bgColor:"bg-amber-100", link: "#" },
  { title: "Culture", icon: "culture.svg",bgColor:"bg-yellow-100", link: "#" },
  { title: "City", icon: "city.svg",bgColor:"bg-green-100", link: "#" },
  { title: "Islands", icon: "islands.svg",bgColor:"bg-orange-100", link: "#" },
  { title: "Swimming Pool", icon: "Swimming Pool.svg",bgColor:"bg-teal-100", link: "#" },
];
const DiscoverSection = () => {
  return (
    <section className="container mx-auto bg-white text-center mt-10">
      
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          Discover What Cocotel has to Offer
        </h2>
        <p className="text-center mb-4 font-normal text-gray-800">
          Unlock your adventure with Cocotel. Explore our collection of hotels and resorts in beachside, cityscape, and mountain settings.
          Book now with no queues, no crowds—all discounted.
        </p>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`${item.bgColor}  border border-gray-200 rounded-xl shadow-sm px-5 py-8 flex flex-col items-center justify-center hover:shadow-md transition`}
            >
              <Image
                    src={`/images/${item.icon}`}
                    alt={item.title}
                    width={50}
                    height={50}
                  className="text-green-500 w-10 h-10 mb-3"
                />

              <span className="text-gray-800 font-medium">{item.title}</span>
            </motion.a>
          ))}
        </div>
      
    </section>
  );
}

export default DiscoverSection;
