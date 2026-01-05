"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter, FaLinkedinIn, FaApple, FaGooglePlay, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

interface NavLink {
  name: string;
  href: string;
}

interface NavSection {
  title?: string;
  links: NavLink[];
}

interface FooterData {
  logo: string;
  socials: { name: string; icon: string }[];
  contacts: {
    email: string;
    phones: string[];
  };
  navSections: NavSection[];
}

interface FooterProps {
  data: FooterData;
}

const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaXTwitter,
  FaLinkedinIn,
  FaApple,
  FaGooglePlay,
};

const Footer: React.FC<FooterProps> = ({ data }) => {
  if (!data || !data.logo || !data.socials || !data.navSections) {
    console.warn("Invalid or missing footer data");
    return null;
  }

  const { logo, socials, contacts, navSections } = data;

  // Sample hotel cities data (like OYO's extensive list)
  

  return (
    <footer className="bg-gray-700 text-white mt-5">
      {/* Top Banner Section */}
      <div className="bg-gray-700 border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              
              <div className="flex gap-4">
                {socials.map((social, idx) => {
                  const Icon = iconMap[social.icon];
                  return Icon ? (
                    <a
                      key={idx}
                      href="#"
                      className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon width={18} height={18} />
                    </a>
                  ) : null;
                })}
              </div>
            </div>

            
          </div>
        </div>
        </div>
      </div>
      {/* Main Navigation Grid */}
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 bg-gray-700 border-b border-gray-100 py-10">
            {/* Logo and contact */}
          <div className="border-r-0 md:border-r border-gray-400">
            <div className="flex items-center gap-4 mb-4">
                <Image
                  src={logo}
                  alt="Cocotel Logo"
                  width={200}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div className="text-start">
              <div className="mb-4">
                <h5 className="font-semibold ">Contact Us</h5>
                <a 
                  href={`mailto:${contacts.email}`} 
                  className="text-green-400 hover:text-red-300 hover:underline text-sm"
                >
                  {contacts.email}
                </a>
                <div className="mt-2">
                  {contacts.phones.map((phone, index) => (
                    <div key={index} className="text-gray-100 flex text-sm">
                      <FaPhone/> <span className="ms-2">{phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* About cocotel */}
          <div className="border-r-0 md:border-r border-gray-400">
            <h4 className="font-bold text-lg mb-3 text-white">About Cocotel</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Career
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>
          {/* About Us */}
          <div className="border-r-0 md:border-r border-gray-400">
            <h4 className="font-bold text-lg mb-3 text-white">About Us</h4>
            <ul className="space-y-2">
              
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link href="/circle" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Cocotel Circle
                </Link>
              </li>
              <li>
                <Link href="/frames" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Cocotel Frames
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h4 className="font-bold text-lg mb-3 text-white">Terms and conditions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Guest Policies
                </Link>
              </li>
              
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Terms And Condtions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white hover:underline transition-colors">
                  Terms / Careers
                </Link>
              </li>
              
            </ul>
          </div>

        </div>
        {/* Additional Navigation Sections */}
          <h4 className="font-bold text-lg mb-2 text-white">Cocotel hotels</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 border-b border-gray-100 pb-10 ">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {/* {section.title && (
                <h4 className="font-bold text-lg mb-2 text-white">
                  {section.title}
                </h4>
              )} */}
              <ul className="space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-100 text-sm">
                © 2013-{new Date().getFullYear()} Cocotel International. All Rights Reserved.
              </p>
            </div>
            
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;