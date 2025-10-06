"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  capacity: string;
  budget: string;
  organizer_name: string;
  organizer_contact: string;
  additional_services: string;
  description: string;
  event_image: string;
}

const EventPage = () => {
  const { slug } = useParams();
  const eventName = Array.isArray(slug)
    ? decodeURIComponent(slug.join("/"))
    : decodeURIComponent(slug || "");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventName) {
      const fetchEvent = async () => {
        try {
          // Compute apiEventName inside useEffect
          const apiEventName = eventName.replace(/-/, " ");
          const response = await fetch(
            "https://crmapi.conscor.com/api/general/mfind",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "w5K4iw1tRCTbnOrkprhs",
              },
              body: JSON.stringify({
                dbName: "hanahotelnew",
                collectionName: "event",
                filter: { "sectionData.event_details.event_name": apiEventName },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const dataRes = await response.json();
          const data = dataRes.data;

          if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error("Event not found");
          }

          const item = Array.isArray(data) ? data[0] : data;
          const mappedEvent: Event = {
            id: item._id || "unknown",
            event_name:
              item.sectionData?.event_details?.event_name || "Unknown Event",
            event_type: item.sectionData?.event_details?.event_type || "",
            capacity: item.sectionData?.event_details?.capacity || "0",
            budget: item.sectionData?.event_details?.budget || "0",
            organizer_name: item.sectionData?.event_details?.organizer_name || "",
            organizer_contact:
              item.sectionData?.event_details?.organizer_contact || "",
            additional_services:
              item.sectionData?.event_details?.additional_services || "",
            description: item.sectionData?.event_details?.description || "",
            event_image:
              item.sectionData?.event_details?.event_image &&
              item.sectionData.event_details.event_image.match(
                /^https?:\/\/[^\s/$.?#].[^\s]*$/
              )
                ? item.sectionData.event_details.event_image.trim()
                : "/images/fallback-image.jpg",
          };

          setEvent(mappedEvent);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching event:", err);
          setError("Failed to load event details");
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventName]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !event) {
    return (
      <div className="text-center py-10 text-red-600">
        {error || "Event not found"}
      </div>
    );
  }

  return (
    <section>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white w-full mx-auto px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: "url('/events/event_banner.png')" }}
      >
        <div className="relative mx-auto py-10 sm:py-16 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            DISCOVER YOUR PERFECT EVENTS
          </h1>
          <h2 className="text-2xl font-bold mt-4">
            Where Every Occasion Matters at Cocotel
          </h2>
          <p className="text-[16px] mt-2 sm:mt-6 max-w-2xl mx-auto leading-relaxed">
            Your special moments deserve the best. At Cocotel, we offer stunning
            venues and tailored packages for all events—grand gatherings, intimate
            weddings, corporate galas, and family reunions. Our elegant and versatile
            venues ensure the perfect setting for any occasion. With our expert
            assistance, you&apos;ll create unforgettable memories. Celebrate every
            occasion at Cocotel.
          </p>
          <button className="mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-base">
            I want to see more
          </button>
        </div>
      </div>

      {/* Event Details Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-[32px] font-bold leading-snug mb-6">
          BEYOND MEETINGS LUXURIOUS CORPORATE<br />EXPERIENCES WITH COCOTEL
        </h1>
        <div className="flex justify-center mb-8">
          <Image src="/events/event_one_one.png" alt="Cocotel Event" width={1232} height={430} className="rounded-md" priority />
        </div>
        <p className="text-[20px] text-gray-700 leading-relaxed max-w-7xl mx-auto mb-8">
          Accomplishing an exceptional impression is essential, giving you the ideal setting for business dealings. We offer conference facilities and diverse venue options. Our comprehensive accommodation packages complement your event needs.
        </p>
        <div className="flex justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-base">Set a Meeting</button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-[38px] font-normal text-[#212529] text-center md:text-left mb-12">
          List of Features
        </h1>

        {[
          {
            img: "/events/event_one_two.png",
            title: "Seal the Deal in Style",
            desc: "Elevate your business interactions where sophistication and functionality converge to foster unparalleled business success - they are catalysts for achievement.",
            reverse: false
          },
          {
            img: "/events/event_one_three.png",
            title: "Strategic Location",
            desc: "Conveniently located and surrounded by business hubs, our venues offer unparalleled ease for both local and international guests, making your event a seamless extension of your corporate strategy.",
            reverse: true
          },
          {
            img: "/events/event_one_four.png",
            title: "Cutting-Edge Technology",
            desc: "Stay ahead in the tech-driven corporate landscape. Our event spaces boast cutting-edge audiovisual equipment, high-speed internet, and advanced presentation tools to ensure your meetings and presentations are nothing short of impressive.",
            reverse: false
          },
          {
            img: "/events/event_one_five.png",
            title: "All-round venue",
            desc: "Whether hosting a high-stakes board meeting, a dynamic conference, or a high-profile product launch, our adaptable venues can transform to fit your specific requirements, ensuring every event is uniquely memorable.",
            reverse: true
          }
        ].map((card, index) => (
          <div
            key={index}
            className={`flex flex-col ${card.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 mb-16`}
          >
            <div className="flex-shrink-0">
              <Image src={card.img} alt={card.title} width={600} height={440} className="rounded-md" priority />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[32px] font-semibold mb-4">{card.title}</h3>
              <p className="text-[16px] text-gray-700 leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Closing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-[32px] font-bold leading-snug mb-2">
          WHERE BUSINESS MEETS LUXURY
        </h1>
        <p className="text-[20px] text-gray-700 leading-relaxed max-w-7xl mx-auto mb-8">
          Advance your corporate status by hosting events that reflect the calibre of your business. Contact us today to book a space that brings your vision to life.
        </p>
        <div className="flex justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-base">Set a Meeting</button>
        </div>
      </div>
    </section>
  );
};

export default EventPage;