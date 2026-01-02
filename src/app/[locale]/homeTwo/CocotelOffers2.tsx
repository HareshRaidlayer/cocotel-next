"use client";

import Image from "next/image";

export default function CocotelOffers2() {
  const bgImage = "/images/Discoun-Voucher-Ticket-bg.png";
  const qrCodeImage = "/images/qr_code_PNG10.png";

  return (
    <section className="container mx-auto mt-6 md:mt-10 w-full p-2 xl:p-0">
      <div className="relative w-full h-60 overflow-hidden">
        
        {/* Background Image */}
        <Image
          src={bgImage}
          alt="Voucher background"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#093a29f2]" />

        {/* Content */}
        <div className="relative z-10 flex h-full text-white">
          
          {/* Left QR Section */}
          <div className="w-1/4 flex items-center justify-center border-r-4 border-[#eac285] border-dotted border-gray-400">
            <div className="text-center">
                <p className="text-base text-center text-[#eac285]">
                  DiSCOUNT UP TO
                </p>
                <h3 className="text-5xl text-[#eac285] font-bold">30% OFF</h3>
                
                <Image src={qrCodeImage} alt="QR Code" width={100} height={100} className="m-auto"/>
            </div>
            
          </div>

          {/* Right Content Section */}
          <div className="w-3/4 flex items-center px-6">
            <div>
              <h3 className="text-xl  font-semibold">Exclusive Offer</h3>
              <p className="text-sm opacity-90 ">
                Scan the QR code to get your discount voucher
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
