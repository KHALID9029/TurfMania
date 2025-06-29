// pages/player.tsx
'use client';
import React from 'react';
import RegistrationForm from '@/components/Forms/registrationForm';
import BackgroundCircles from '@/components/backgroundCircles';

const PlayerRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <BackgroundCircles/>
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-white text-2xl font-semibold">Register As A <span className='text-[#44B5E9]'>Player</span></h2>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default PlayerRegistrationPage;
