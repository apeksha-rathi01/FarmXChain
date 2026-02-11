import React from 'react';

const Logo = ({ className, size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className || ""} bg-primary-600 rounded-lg flex items-center justify-center`}>
      <span className="text-white font-bold text-lg">FX</span>
    </div>
  );
};

export default Logo;
