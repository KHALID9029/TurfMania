// components/BackgroundCircles.tsx
import React from 'react';

const BackgroundCircles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Left circle */}
      <div className="absolute -left-30 top-[20%] w-60 h-60 rounded-full bg-[#4465e9] opacity-60 blur-3xl"></div>
      
      {/* Right circle */}
      <div className="absolute -right-40 bottom-[20%] w-80 h-80 rounded-full bg-[#44B5E9] opacity-60 blur-3xl"></div>
    </div>
  );
};

export default BackgroundCircles;