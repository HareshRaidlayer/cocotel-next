import React from "react";
import { FaTrophy, FaGlobe, FaMoneyBillWave, FaSmile, FaArrowRight, FaPhone } from "react-icons/fa";

const WhyUs = () => {
  return (
    <section className="container mx-auto bg-white mt-10 p-2 xl:p-0">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-green-600">
          
          Why Choose The #1 Hotel Booking Platform in the Philippines
        </h2>
        <p className="text-center font-normal text-gray-800 mb-8">
          Plan your dream trip to the Philippines with the most trusted and complete travel service provider
        </p>

        {/* Six cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 hover:bg-yellow-100 transition duration-300">
            <div className="flex items-center mb-2">
              <FaTrophy className="text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-700">Philippines&apos; Top Travel Platform</h3>
            </div>
            <p className="text-gray-600">
              Trusted by thousands of travelers and recognized for excellence, we make it easy to explore the Philippines from coast to coast&apost;.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-100 transition duration-300">
            <div className="flex items-center mb-2">
              <FaGlobe className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-blue-700">Everything You Need in One Place</h3>
            </div>
            <p className="text-gray-600">
              From island-hopping tours and hotel stays to transport, car rentals, and travel guides, we offer the most complete range of services for every type of traveler.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition duration-300"
            style={{ border: "2px solid rgb(51, 171, 99)" }}
          >
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-green-700">Best Price Guarantee</h3>
            </div>
            <p className="text-gray-600">
              Get the lowest prices on all our services. If you find a better deal, we&apos;ll match it—no questions asked.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 hover:bg-purple-100 transition duration-300">
            <div className="flex items-center mb-2">
              <FaSmile className="text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold text-purple-700">Flexible &amp; Secure Booking</h3>
            </div>
            <p className="text-gray-600">
              Enjoy flexible booking options and free cancellations on most services, giving you the confidence to plan with ease.
            </p>
          </div>

          {/* Card 5 */}
          <div
            className="rounded-lg p-4 transition duration-300"
            style={{
              "--base-color-rgb": "80, 202, 228",
              border: "2px solid rgb(var(--base-color-rgb))",
              backgroundColor: "rgba(var(--base-color-rgb), 0.1)",
            } as React.CSSProperties}
          >
            <div className="flex items-center mb-2">
              <FaArrowRight
                className="mr-2"
                style={{ color: "rgb(var(--base-color-rgb))" }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(var(--base-color-rgb))" }}
              >
                Curated by Local Experts
              </h3>
            </div>
            <p className="text-gray-600">
              Our team of Filipino travel specialists ensures every service meets the highest standards and reflects the best of what the Philippines has to offer.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 hover:bg-red-100 transition duration-300">
            <div className="flex items-center mb-2">
              <FaPhone className="text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-red-700">24/7 Support in 14 Languages</h3>
            </div>
            <p className="text-gray-600">
              We&apos;re here for you anytime, in your language. Our support team is available 24/7 to make sure your trip goes smoothly.
            </p>
          </div>
        </div>
    </section>
  );
};

export default WhyUs;
