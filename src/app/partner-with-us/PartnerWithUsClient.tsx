"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

interface PartnerSection {
  sectionOne: Array<{
    sectiononebannerheading: string;
    sectiononebannersubheading: string;
    sectiononebannerimage: string;
  }>;
  sectiontwo: Array<{
    sectiontwobannerheading: string;
    sectiontwosubheading: string;
  }>;
  sectionthree: Array<{
    sectionthreetitle: string;
    sectionthreedescription: string;
    sectionthreeimage: string;
    sectionthreeisactive: boolean;
  }>;
  sectionfour: Array<{
    sectionfourtitle: string;
    sectionfourdescription: string;
    sectionfourimage: string;
    sectionfourisactive: boolean;
  }>;
}

interface Props {
  partnerData: PartnerSection | null;
}

export default function PartnerWithUsClient({ partnerData }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    resortName: "",
    contactNumber: "",
    numberOfRooms: "",
    email: "",
    numberOfHotels: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const sectionFourActive = partnerData?.sectionfour?.filter(item => item.sectionfourisactive) || [];
  const images = sectionFourActive.map(item => item.sectionfourimage).filter(Boolean);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.contactNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // if (!recaptchaToken) {
    //   toast.error("Please complete the reCAPTCHA");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch("/api/partner-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // recaptchaToken,
        }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        toast.success("Form submitted successfully!");
        setFormData({
          fullName: "",
          resortName: "",
          contactNumber: "",
          numberOfRooms: "",
          email: "",
          numberOfHotels: "",
          address: "",
          message: "",
        });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        toast.error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionOne = partnerData?.sectionOne?.[0];
  const sectionTwo = partnerData?.sectiontwo?.[0];
  const sectionThreeActive = partnerData?.sectionthree?.filter(item => item.sectionthreeisactive) || [];

  return (
    <section>

      {/* HERO SECTION */}
      <div
        className="flex justify-center items-center relative bg-cover bg-center bg-no-repeat text-white w-full h-[320px] lg:h-[380px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${sectionOne?.sectiononebannerimage || "/events/event_banner.png"}')`
        }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">
          {sectionOne?.sectiononebannerheading || "Partner with us"}
        </h1>
      </div>

      {/* OWNER AND HOTEL SECTION */}
      <div className="py-16 px-6 lg:px-20 bg-white text-center">
        <h2 className="text-4xl font-bold text-green-600 mb-4">
          {sectionTwo?.sectiontwobannerheading || "OWNER AND HOTEL"}
        </h2>

        <p className="max-w-4xl mx-auto text-gray-600 mb-12 text-sm leading-relaxed">
          {sectionTwo?.sectiontwosubheading || "Cocotel International is a Filipino-owned hospitality-tech hotel brand..."}
        </p>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          {sectionThreeActive.map((item, index) => (
            <div key={index} className="space-y-3">
              {item.sectionthreeimage ? (
                <img src={item.sectionthreeimage} alt={item.sectionthreetitle} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
                  {index + 1}
                </div>
              )}
              <h3 className="font-semibold text-lg">{item.sectionthreetitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{item.sectionthreedescription}</p>
            </div>
          ))}
        </div>
      </div>

{/* WHAT WE ARE LOOKING FOR */}
<div className="bg-gray-50 py-16 px-6 lg:px-20">
  <h2 className="text-center text-4xl font-bold text-green-600 mb-12">
    What we are looking for
  </h2>

  {/* GRID */}
  <div className="grid lg:grid-cols-2 gap-10 items-stretch">
    
    {/* LEFT IMAGE SLIDER */}
    <div className="relative h-full">
      <div className="relative w-full h-full min-h-[350px] overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={images[currentSlide]}
            alt="Resort"
            className="absolute w-full h-full object-cover rounded-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>
    </div>

    {/* RIGHT CONTENT */}
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-green-600 text-white rounded-xl p-8 shadow-lg h-full flex flex-col justify-center"
    >
      <h3 className="text-xl font-semibold mb-4">
        {sectionFourActive[currentSlide]?.sectionfourtitle || "Requirements"}
      </h3>
      <div className="text-sm whitespace-pre-line">{sectionFourActive[currentSlide]?.sectionfourdescription || ""}</div>
    </motion.div>
  </div>

  {/* DOTS */}
  <div className="flex justify-center mt-8 space-x-3">
    {images.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          currentSlide === index
            ? "bg-green-600 scale-125"
            : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>



      {/* FORM SECTION */}
      <div className="py-16 px-6 lg:px-20 bg-white">
        <h2 className="text-center text-4xl font-bold text-green-600 mb-10">
          Be a Coco Partner
        </h2>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name *"
            className="border p-3 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="resortName"
            value={formData.resortName}
            onChange={handleInputChange}
            placeholder="Resort/Hotel Name"
            className="border p-3 rounded-md w-full"
          />

          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number *"
            className="border p-3 rounded-md w-full"
            required
          />
          <input
            type="number"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleInputChange}
            placeholder="Number of Rooms"
            className="border p-3 rounded-md w-full"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address *"
            className="border p-3 rounded-md w-full"
            required
          />
          <input
            type="number"
            name="numberOfHotels"
            value={formData.numberOfHotels}
            onChange={handleInputChange}
            placeholder="Number of Hotels/Resorts"
            className="border p-3 rounded-md w-full"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Full Resort Address"
            className="border p-3 rounded-md md:col-span-2"
            rows={3}
          ></textarea>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Message"
            className="border p-3 rounded-md md:col-span-2"
            rows={4}
          ></textarea>

          {/* <div className="md:col-span-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div> */}

          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

    </section>
  );
}
