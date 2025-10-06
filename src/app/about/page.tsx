"use client";

import React from "react";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      {/* Banner Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white w-full mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/about/about-banner-1.png')",
        }}
      >
        <div className="relative mx-auto py-10 sm:py-32 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            ABOUT US
          </h1>
          <p className="text-xl mt-4 sm:mt-6 max-w-5xl mx-auto">
            Cocotel is an online hotel management company, Southeast Asia&apos;s
            leading one-stop solutions for independent hotels and resorts,
            offering innovative e-commerce and property management solutions
            that increase revenue by at least 30% with zero upfront cost. Our
            network spans over 300+ properties, where we set industry standards
            and use technology to enhance hospitality and tourism.
          </p>
          <button className="mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-base">
            I want to know more
          </button>
        </div>
      </div>

      {/* Vision and Mission Section */}
      <section className="container mx-auto p-4 mt-10 max-w-[80rem]">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <div className="w-full lg:w-2/5">
            <Image
              src="/about/about_v_m.png"
              alt="Vision Mission"
              width={900}
              height={800}
              className="w-full h-auto lg:h-[560px] object-cover rounded-[12px]"
              priority
            />
          </div>
          <div className="w-full lg:w-3/5 space-y-6 sm:space-y-8">
            <div className="mt-4">
              <h1 className="text-2xl sm:text-3xl md:text-[32px] font-normal font-semibold mb-2 sm:mb-4">
                VISION
              </h1>
              <p className="text-xl">
                At Cocotel, our vision is to establish ourselves as the premier
                one-stop solution for independent hotels and resorts,
                revolutionizing e-commerce in Southeast Asia. We are committed
                to expanding our partnerships and reach across the Asia Pacific
                region, setting unprecedented service standards, and harnessing
                technology to make a positive impact on the hospitality and
                tourism industries.
              </p>
            </div>
            <div className="mt-4">
              <h1 className="text-2xl sm:text-3xl md:text-[32px] font-normal font-semibold mb-2 sm:mb-4">
                MISSION
              </h1>
              <p className="text-xl">
                Cocotel is dedicated to delivering top-notch service through
                innovative technology and comprehensive online solutions. Our
                mission is to lead the hotel management sector in Southeast
                Asia, establishing Cocotel as the premier online management
                company and building a sustainable business. By fostering
                continuous improvement and nurturing robust relationships with
                our stakeholders, we aim to optimize the hospitality experience,
                pursue excellence, and achieve sustained growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future of Hotel Ecommerce Section */}
      <section
        className="mt-10 relative bg-cover bg-center bg-no-repeat text-white w-full mx-auto"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/about/about-banner-1.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="relative mx-auto py-10 sm:py-16 md:py-20 text-center h-[756px]">
          <div className="mb-6 sm:mb-8">
            <Image
              src="/about/cocotel-vertical-logo.png"
              alt="Cocotel Logo"
              width={180}
              height={180}
              className="mx-auto"
              priority
            />
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2">
            The Future of Hotel Ecommerce
          </h3>
          <h4 className="text-xs sm:text-base md:text-lg mb-6">
            REVolutionizing Independent Hotels and Resorts Digital Sales
          </h4>
          <div className="flex justify-center mb-6 sm:mb-10">
            <Image
              src="/about/cocotel-progress-bar.png"
              alt="Progress Bar"
              width={600}
              height={200}
              className="object-contain sm:w-[400px] h-auto"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-20 px-4 sm:px-20">
            <Image
              src="/about/CHS.png"
              alt="Cocotel Hospitality Solutions"
              width={500}
              height={500}
              className="object-contain w-[140px] sm:w-[170px] h-auto"
              priority
            />
            <Image
              src="/about/PoweredBy1.png"
              alt="Powered By Cocotel"
              width={600}
              height={600}
              className="object-contain w-[230px] sm:w-[250px] h-auto"
              priority
            />
            <Image
              src="/about/IMG_0919C.png"
              alt="Cocotel bedbank"
              width={500}
              height={500}
              className="object-contain w-[120px] sm:w-[150px] h-auto"
              priority
            />
          </div>
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-6 text-xs sm:text-sm text-right max-w-3/5">
            <p>
              All content, including images, text, and graphics, is the property
              of Cocotel International Inc and is protected by copyright and
              intellectual property laws.
              <br />
              Unauthorized use, reproduction, or distribution is strictly
              prohibited.
            </p>
          </div>
        </div>
      </section>

      {/* Cocotel In Numbers Section */}
      <section className="container mx-auto p-4 mt-10 bg-white">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-8">
            Cocotel In Numbers
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                img: "cocotel-properties.png",
                value: "300+",
                label: "Properties",
              },
              { img: "rooms.png", value: "10000+", label: "Rooms" },
              { img: "locations.png", value: "60+", label: "Locations" },
              { img: "contries.png", value: "3+", label: "Countries" },
              {
                img: "IMG_0919C.png",
                value: "PHP 2 Billion",
                label: "Sales Generated Online",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 sm:p-6 rounded-lg about-custom-shadow hover:bg-green-100 transition duration-300 transform hover:scale-105"
              >
                <Image
                  src={`/about/${item.img}`}
                  alt={item.label}
                  width={180}
                  height={130}
                  className="object-contain mx-auto"
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mt-2 sm:mt-4">
                  {item.value}
                </h1>
                <h3 className="text-base sm:text-lg text-gray-600">
                  {item.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cocotel Story */}
      <section className="container mx-auto p-4 mt-10 bg-white">
        <div className="container mx-auto text-center">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 w-full px-4 py-6 sm:py-10">
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-left">
              <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold font-normal">
                COCOTEL STORY
              </h1>
              <p className="text-base sm:text-lg md:text-[20px] font-normal">
                Ever wondered how Cocotel was formed?
              </p>
              <p className="text-xl">
                Was formed in December 2018 by Rafael Jouwena and Reginald Go.
                Inspired by a business disruption in the budget hotel industry,
                they applied the concept in the Philippines, focusing on local
                resorts and getaways. Incorporated in 2019, they signed their
                first 5 hotel clients in Boracay. Despite the challenges posed
                by the pandemic, Cocotel grew from 5 to 26 clients by November
                2019. Their innovative approach, including the &apos;Cocotel Vibe&apos;
                service, and participation in the Ideaspace Accelerator program,
                enabled them to sustainably expand and refine their operations.
                Today, Cocotel boasts 300+ hotels and resorts across the
                Philippines, driven by their business model and talented
                hospitality professionals.
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <Image
                src="/about/cocotel_story.png"
                alt="Cocotel Story"
                width={800}
                height={800}
                className="max-w-full h-auto object-cover rounded-[20px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ecommerce World Section */}
      <section>
        <div
          className="relative w-full h-[600px] sm:h-[700px] md:h-[600px] lg:h-[700px] bg-cover bg-center flex justify-center items-center"
          style={{
            backgroundImage: "url('/images/econnerce-bg.jpg')",
          }}
        >
          <div
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] bg-cover bg-center text-white px-4 sm:px-6 md:px-8 lg:px-12 py-0 lg:py-10"
            style={{
              backgroundImage: "url('/images/e-commerce-world.png')",
            }}
          >
            <div className="flex flex-col justify-between items-center lg:items-start h-full mt-0 lg:mt-5">
              <div>
                <div className="text-left mt-[-50px] md:mt-0">
                  <h4 className="text-sm sm:text-lg md:text-2xl font-medium">
                    Understanding The Hotel
                  </h4>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                    Ecommerce World
                  </h2>
                </div>
                <div>
                  <Image
                    src="/about/cocotel-icon.png"
                    alt="Cocotel Logo"
                    width={200}
                    height={200}
                    className="absolute top-2 right-2 mx-auto sm:mx-0 w-14 h-auto"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-10">
                <div className="w-full lg:w-1/3 text-xs md:text-base mb-[-110px] md:mb-[-20px] lg:mb-0 leading-relaxed">
                  <p>
                    Struggling with low revenue and low occupancy rates? With
                    Cocotel, your hotel can rise to the top! Gain full inventory
                    control, optimize distribution, and unlock your property&apos;s
                    full market potential by reaching over 10,000+ sales
                    channels. Maximize your revenue today!
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute right-5 bottom-2 text-sm font-semibold text-right country-list">
              <ul className="flex gap-2">
                {["PHILIPPINES", "INDONESIA", "AUSTRALIA"].map((country, i) => (
                  <li key={i}>{country}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Image
          src="/about/cocotel-progress-bar.png"
          alt="Progress Bar"
          width={1000}
          height={200}
          className="w-full h-7"
        />
      </section>
      <section>
        <div className="relative w-full">
          <div
            className="absolute left-0 top-0 h-full w-full lg:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url('/images/ecommerce-bg-image.png')",
            }}
          ></div>
          <div className="relative z-10">
            <div className="w-full text-white p-2 md:p-10">
              <div className="flex mt-3 mb-8">
                <div className="hidden lg:block w-1/2 text-[32px] font-semibold text-white text-end">
                  THE PLAYERS IN THE HOT
                </div>
                <div className="hidden lg:block w-1/2 text-[32px] font-semibold text-green-600 text-start">
                  EL E-COMMERCE WORLD
                </div>
                <h2 className="block lg:hidden text-[20px] mt-10 md:mt-0 p-5 md:p-0 md:text-[32px] font-semibold text-green-600 text-center">
                  THE PLAYERS IN THE HOTEL E-COMMERCE WORLD
                </h2>
                <Image
                  src="/about/cocotel-green-icon.png"
                  alt="Cocotel Logo"
                  width={200}
                  height={200}
                  className="absolute top-2 right-2 mx-auto sm:mx-0 w-14 h-auto"
                  priority
                />
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%]">
                  <div className="text-xl font-semibold">
                    1. HOTEL CHAIN/MANAGEMENT/OWNERS
                  </div>
                  <p className="text-lg font-normal mb-4">
                    Hotel Chains, Management Companies, and Owners oversee full
                    hotel operations, owning majority shares or managing
                    properties. They control branding, services, pricing, and
                    overall guest experience in the competitive hotel e-commerce
                    landscape.
                  </p>
                </div>
                <div className="w-full lg:w-[55%]">
                  <div className="logo-container bg-white lg:bg-transparent">
                    <div className="hidden lg:block img-top-line"></div>
                    <div className="hidden lg:block w-[5%]"></div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-44.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-42.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-15.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-43.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-41.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%]">
                  <div className="text-xl font-semibold">
                    2. Distribution Channel Manager
                  </div>
                  <p className="text-lg font-normal mb-4">
                    A Distribution Channel Manager oversees hotel inventory and
                    pricing across multiple online and offline channels,
                    ensuring optimal visibility, rate parity, and maximizing
                    revenue through OTAs, GDS, direct bookings, and other sales
                    platforms.
                  </p>
                </div>
                <div className="w-full lg:w-[55%] bg-white lg:bg-transparent">
                  <div className="logo-container">
                    <div className="img-top-line hidden lg:block"></div>
                    <div className="w-[5%] hidden lg:block"></div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-191.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-18.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-17.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-16.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%]">
                  <div className="text-xl font-semibold">
                    3. B2C Distribution
                  </div>
                  <p className="text-lg font-normal mb-4">
                    B2C Distribution refers to platforms and channels that sell
                    hotel stays directly to consumers. This includes Online
                    Travel Agencies (OTAs), metasearch engines, brand websites,
                    and direct booking channels, aiming to attract and convert
                    individual travelers.
                  </p>
                </div>
                <div className="w-full lg:w-[55%] bg-white lg:bg-transparent">
                  <div className="logo-container">
                    <div className="img-top-line hidden lg:block"></div>
                    <div className="w-[8%] hidden lg:block"></div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-35.png"
                        alt="Accor"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-34.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-33.png"
                        alt="Accor"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-32.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-31.png"
                        alt="Cocotel"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-30.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%]">
                  <div className="text-xl font-semibold">
                    4. B2B Wholesaler
                  </div>
                  <p className="text-lg font-normal mb-4">
                    B2B Wholesalers distribute hotel inventory to travel agents,
                    tour operators, and other intermediaries at negotiated
                    rates. They act as a bridge between hotels and B2C sellers,
                    offering bulk pricing and wider market reach.
                  </p>
                </div>
                <div className="w-full lg:w-[55%] bg-white lg:bg-transparent">
                  <div className="logo-container">
                    <div className="img-top-line hidden lg:block"></div>
                    <div className="w-[5%] hidden lg:block"></div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-28.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-29.png"
                        alt="Cocotel"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-27.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%]">
                  <div className="text-xl font-semibold">
                    5. Travel Buyers and Operators
                  </div>
                  <p className="text-lg font-normal mb-4">
                    Travel Buyers and Operators purchase hotel inventory in bulk
                    or curate travel packages for resale. They include travel
                    agencies, tour operators, and corporate travel managers who
                    bundle accommodations with flights, tours, and other
                    services for travelers.
                  </p>
                </div>
                <div className="w-full lg:w-[55%] bg-white lg:bg-transparent">
                  <div className="logo-container">
                    <div className="img-top-line hidden lg:block"></div>
                    <div className="w-[8%] hidden lg:block"></div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-26.png"
                        alt="Cocotel"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-25.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-24.png"
                        alt="Accor"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-24.png"
                        alt="Accor"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-23.png"
                        alt="Wyndham"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-22.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-20.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-14.png"
                        alt="IHG"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="logo-wrapper">
                      <Image
                        src="https://www.cocotel.com/frontend/images/Asset-21.png"
                        alt="Cocotel"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-5 bottom-2 text-sm text-blue-500 font-semibold text-right country-list">
            <ul className="flex gap-2">
              {["PHILIPPINES", "INDONESIA", "AUSTRALIA"].map((country, i) => (
                <li key={i}>{country}</li>
              ))}
            </ul>
          </div>
        </div>
        <Image
          src="/about/cocotel-progress-bar.png"
          alt="Progress Bar"
          width={1000}
          height={200}
          className="w-full h-7"
        />
      </section>

      {/* Partnership Section */}
      <section
        className="py-12 bg-white mt-5"
        style={{
          backgroundImage: "url('/about/about_partner_banner.png')",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-15 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-8">
            A Partnership with Cocotel Promises
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white font-semibold mb-6 sm:mb-10 mx-auto">
            Enjoy full ownership and unique branding while benefiting from
            5-star services. Expect a 25-50% increase in occupancy rate and save
            up to $3,000 on property management systems.
          </p>
        </div>
      </section>

      {/* Our Board */}
      <section className="mt-10">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Board
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                img: "/about/reginald_go_investor1740709098.png",
                name: "Reginald Go",
                title: "Founder",
                desc: "Reginald Go is a founder and a strategic leader who fosters strong relationships between organizations and their stakeholders, driving collaboration, trust, and sustainable growth.",
              },
              {
                img: "/about/rafael_jouwena_investor1722243676.png",
                name: "Rafael Jouwena",
                title: "Co-founder & CEO",
                desc: "The smart high Acer Finance Analyst at Cocotel. Rafael Jouwena embarks his passion and experience in a tech hotel company and refining the general financial community to maximize the value of the organization’s stock.",
              },
              {
                img: "/about/jitendra_dadhaniya_investor1722243640.png",
                name: "Jitendra Dadhaniya",
                title: "Co-founder & CTO",
                desc: "Growing up as a dedicated and highly innovative business technopreneur, Jitendra Dadhaniya embarks his passion with Cocotel offering the most advanced technology system to help the internal organization Fastrack processes so that leaders can focus more on what matters.",
              },
            ].map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-58 rounded-full overflow-hidden">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mt-4">
                  {member.name}
                </h3>
                <h5 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                  {member.title}
                </h5>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 max-w-xs mx-auto">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-12 bg-gray-50 mt-10"
        style={{
          backgroundImage: "url('/about/service_bg.png')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Cocotel includes these services for free
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              { img: "service_1.png", label: "Online Inventory Management" },
              { img: "service_2.png", label: "Channel Management" },
              {
                img: "service_3new.png",
                label: "Sales And Digital Marketing Management",
              },
              { img: "service_4.png", label: "Social Media Management" },
              { img: "service_5.png", label: "Property Management System" },
              { img: "service_6.png", label: "Revenue Management" },
            ].map((service, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <Image
                    src={`/about/${service.img}`}
                    alt={service.label}
                    width={400}
                    height={400}
                    className="w-full h-full"
                    priority
                  />
                </div>
                <p className="md:text-xl font-bold mt-4">
                  {service.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-10 line-clamp-3">
            No subscription or setup costs. Boost your digital presence to reach
            500,000-1.2M people with personalized digital sales and marketing.
            Be present on over 30 online travel agency platforms, 10,000+
            distribution channels and multiple social media platforms to
            increase revenue. Achieve an additional 30% revenue within 3-6
            months of the partnership.
          </p>
        </div>
      </section>

      {/* Featured In and Partner Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Featured in
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="p-4">
              <Image
                src="/about/anc.png"
                alt="ANC"
                width={200}
                height={100}
                className="w-full h-auto"
              />
            </div>
            <div className="p-4">
              <Image
                src="/about/cnn.png"
                alt="CNN"
                width={200}
                height={100}
                className="w-full h-auto"
              />
            </div>
            <div className="p-4">
              <Image
                src="/about/finalpitch.png"
                alt="Final Pitch"
                width={200}
                height={100}
                className="w-full h-auto"
              />
            </div>
            <div className="p-4">
              <Image
                src="/about/inquirer.png"
                alt="Inquirer"
                width={200}
                height={100}
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
            <div className="flex flex-col items-center w-full lg:w-1/2">
              <Image
                src="/about/bewith_cocotel.png"
                alt="Achieve Revenue"
                width={500}
                height={420}
                className="object-contain"
                priority
              />
            </div>
            <div className="w-full lg:w-1/2 bg-white p-5">
              <h2 className="text-3xl lg:text-4xl font-semibold mb-1 pb-2">
                Be A Coco Partner
              </h2>
              <form className="space-y-5">
                {[
                  {
                    label: "Name",
                    placeholder: "Your name here",
                    type: "text",
                  },
                  {
                    label: "Phone Number",
                    placeholder: "564545464",
                    type: "number",
                  },
                  {
                    label: "Email Address",
                    placeholder: "user@email.com",
                    type: "email",
                  },
                  {
                    label: "Hotel Name",
                    placeholder: "Hotel Name",
                    type: "text",
                  },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="mt-1 block w-full border-[2px] border-gray-500 focus:border-gray-500 focus:outline-none rounded-md shadow-sm px-3 py-2"
                    />
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Location"
                      className="mt-1 block w-full border-[2px] border-gray-500 focus:border-gray-500 focus:outline-none rounded-md shadow-sm px-3 py-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Room Count
                    </label>
                    <input
                      type="text"
                      placeholder="Put Number Here"
                      className="mt-1 block w-full border-[2px] border-gray-500 focus:border-gray-500 focus:outline-none rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    placeholder="Write your message here"
                    className="mt-1 block w-full border-[2px] border-gray-500 focus:border-gray-500 focus:outline-none rounded-md px-3 py-2"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notRobot"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notRobot" className="ml-2 text-sm text-red-600">
                    I&apos;m not a robot (verification expired. Check the checkbox
                    again)
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;