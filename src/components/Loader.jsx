// components/Loader.jsx
import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-100 bg-opacity-50 z-50">
      {/* <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div> */}
      <Image src="/logo/logo.png" alt="Logo" width={185} height={54} className="object-cover w-28 md:w-[185px]" />
    </div>
  );
};

export default Loader;