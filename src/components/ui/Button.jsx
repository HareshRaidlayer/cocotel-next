"use client";
import React from "react";

const Button = ({ 
  name,
  className,
  style
}) => {
  
  
  return (
    <button
      className={`${className} px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white`}
        style={style}
    >
      {name}
    </button>
  );
};

export default Button;