"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface NavLink {
  name: string;
  href: string;
}

interface NavSection {
  title: string;
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

interface BottomProps {
  data: FooterData;
}

// Map icon names to react-icons components
const iconMap: { [key: string]: React.ComponentType } = {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
};

const Bottom: React.FC<BottomProps> = ({ data }) => {
  // Validate data
  if (
    !data ||
    !data.logo ||
    !data.socials ||
    !data.contacts ||
    !data.navSections
  ) {
    console.warn("Invalid or missing footer data");
    return null;
  }

  const { logo, socials, contacts, navSections } = data;

  return (
    <footer className="bg-gradient-to-t from-green-700 via-green-600 to-green-500 text-white mt-10">
      <div className="container mx-auto pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {/* LEFT SIDE: Logo + Socials + Contacts */}
          <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left xl:col-span-1">
            <p className="text-lg font-semibold">Stay Connected with Us</p>
            <div className="flex gap-5">
              {socials.map((social, idx) => {
                const Icon = iconMap[social.icon];
                return Icon ? (
                  <span
                    key={idx}
                    className="hover:scale-110 transition duration-300 cursor-pointer bg-white/20 p-3 rounded-full"
                  >
                    <Icon />
                  </span>
                ) : (
                  <span
                    key={idx}
                    className="hover:scale-110 transition duration-300 cursor-pointer bg-white/20 p-3 rounded-full text-sm"
                  >
                    {social.name}
                  </span>
                );
              })}
            </div>
            <Image
              src={logo || "/fallback-logo.svg"}
              alt="Cocotel Logo"
              width={200}
              height={54}
              className="object-contain mt-4"
              loading="lazy"
            />
            {/* Contacts Section */}
            <div className="mt-6 space-y-3 text-sm md:text-base">
              <div className="">
               
                <div className="flex items-center gap-2">
                 <FaEnvelope />
                   <p>{contacts.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt />
                  <p>{contacts.phones[0] || "No phone available"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt />
                  <p>{contacts.phones[1] || "No phone available"}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                
              </div>
            </div>
          </div>
          {navSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="hover:underline hover:text-yellow-200 transition"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

        </div>

        {/* Bottom Line */}
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm md:text-base">
          <p>© 2025 Cocotel International. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Bottom;
