// src/services/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://embedded-motor-engine-speed-temperature.onrender.com'
    : 'http://localhost:5001');
export const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || 
  (import.meta.env.PROD 
    ? 'https://embedded-motor-engine-speed-temperature.onrender.com/motorHub'
    : 'http://localhost:5001/motorHub');
