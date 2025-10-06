"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

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

interface ApiEvent {
  _id?: string;
  sectionData?: {
    event_details?: {
      event_name?: string;
      event_type?: string;
      capacity?: string;
      budget?: string;
      organizer_name?: string;
      organizer_contact?: string;
      additional_services?: string;
      description?: string;
      event_image?: string;
    };
  };
}

const Page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://crmapi.conscor.com/api/general/mfind', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'w5K4iw1tRCTbnOrkprhs',
          },
          body: JSON.stringify({
            dbName: 'hanahotelnew',
            collectionName: 'event',
            limit: 0,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataRes = await response.json();
        const data = dataRes.data;

        const mappedEvents: Event[] = (Array.isArray(data) ? data : [data]).map((item: ApiEvent) => ({
          id: item._id || 'unknown',
          event_name: item.sectionData?.event_details?.event_name || 'Unknown Event',
          event_type: item.sectionData?.event_details?.event_type || '',
          capacity: item.sectionData?.event_details?.capacity || '0',
          budget: item.sectionData?.event_details?.budget || '0',
          organizer_name: item.sectionData?.event_details?.organizer_name || '',
          organizer_contact: item.sectionData?.event_details?.organizer_contact || '',
          additional_services: item.sectionData?.event_details?.additional_services || '',
          description: item.sectionData?.event_details?.description || '',
          event_image: item.sectionData?.event_details?.event_image && 
                      item.sectionData.event_details.event_image.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/) 
                      ? item.sectionData.event_details.event_image.trim() 
                      : '/images/fallback-image.jpg',
        }));
        
        
        setEvents(mappedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <section>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white w-full h-[500px] sm:h-[600px] lg:h-[550px] mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/events/event_banner.png')`,
        }}
      >
        <div className="relative mx-auto py-10 sm:py-16 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            DISCOVER YOUR PERFECT EVENTS
          </h1>
          <h2 className="text-2xl font-bold mt-4">
            Where Every Occasion Matters at Cocotel
          </h2>
          <p className="text-[16px] mt-2 sm:mt-6 max-w-2xl mx-auto leading-relaxed">
            Your special moments deserve the best. At Cocotel, we offer stunning venues and tailored packages for all events—grand gatherings, intimate weddings, corporate galas, and family reunions. Our elegant and versatile venues ensure the perfect setting for any occasion. With our expert assistance, you&apos;ll create unforgettable memories. Celebrate every occasion at Cocotel.
          </p>
          <button className="mt-6 sm:mt-8 bg-[#4CAA42] hover:bg-[#157347] text-white px-6 py-3 rounded text-base">
            I want to see more
          </button>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-[80rem] mx-auto p-1">
        <h1 className="text-[38px] font-normal md:text-left mt-10 text-[#212529]">
          Event
        </h1>

        {events.map((event, index) => (
          <div
            key={event.id}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden mt-2"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-[510px]">
            {/* <div>{event.event_image}</div> */}
              <Image
                src={event.event_image}
                alt={event.event_name}
                fill
                className="object-cover w-full h-full"
                priority={index === 0}
              />
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 bg-green-50 p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-600 text-xl  tracking-wide">
                  {event.event_type}
                </h3>
                <h2 className="text-gray-900 text-4xl mt-4 font-semibold">
                  {event.event_name}
                </h2>
                <p className="text-black text-base mt-6 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex mt-8">
                  <Link href={`/events/${encodeURIComponent(event.event_name.replace(/\s+/g, '-').toLowerCase())}`}>
                    <button className="sm:mt-0 bg-[#4CAA42] hover:bg-[#157347] text-white px-6 py-3 rounded text-base">
                      See more
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Page;