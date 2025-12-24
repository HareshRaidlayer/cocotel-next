"use client";
import React from "react";

const Button = ({ 
  name,
}) => {
  
  
  return (
    <button className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white"
    >
      {name}
    </button>
  );
};

export default Button;