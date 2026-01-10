"use client";
import React from "react";

interface ButtonProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
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