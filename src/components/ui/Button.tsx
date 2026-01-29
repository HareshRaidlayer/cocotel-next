"use client";
import React from "react";

interface ButtonProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ 
  name,
  className,
  style,
  onClick,
}) => {
  
  
  return (
    <button
      onClick={onClick}
      className={`${className} px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white`}
        style={style}
    >
      {name}
    </button>
  );
};

export default Button;