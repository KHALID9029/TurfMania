// webapp/app/403/page.tsx

"use client";

import { useRouter } from 'next/navigation';

const ForbiddenPage = () => {
  const router = useRouter();

  const handleReturnToHome = () => {
    router.push('/homePage'); // Redirect the user to the home page
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#FF6347' }}>403 - Access Forbidden</h1>
      <p>You don{"'"}t have permission to access this page.</p>
      <button
        onClick={handleReturnToHome}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Return to Home
      </button>
    </div>
  );
};

export default ForbiddenPage;