import React from 'react';

const MotorSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center">
    <svg
      className="animate-spin-slow"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="8" fill="#e0e7ef" />
        <g>
          <rect x="36" y="4" width="8" height="20" rx="4" fill="#2563eb" />
          <rect x="36" y="56" width="8" height="20" rx="4" fill="#2563eb" />
          <rect x="4" y="36" width="20" height="8" rx="4" fill="#2563eb" />
          <rect x="56" y="36" width="20" height="8" rx="4" fill="#2563eb" />
        </g>
        <circle cx="40" cy="40" r="10" fill="#2563eb" />
      </g>
    </svg>
    <div className="mt-4 text-lg font-semibold animate-pulse text-blue-700 text-center">
      Motor Engine is initializing...
    </div>
  </div>
);

export default MotorSpinner;
