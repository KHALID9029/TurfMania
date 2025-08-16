'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import RegistrationForm from '@/components/Forms/registrationForm';
import BackgroundCircles from '@/components/backgrounds/backgroundCircles';

function RegistrationContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Player'; // Default to 'Player' if no role is specified

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-white text-2xl font-semibold">Register As <span className='text-[#44B5E9]'>{role}</span></h2>
      <RegistrationForm role={role}/>
    </div>
  );
}

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <BackgroundCircles/>
      <Suspense>
        <RegistrationContent />
      </Suspense>
    </div>
  );
};

export default RegistrationPage;