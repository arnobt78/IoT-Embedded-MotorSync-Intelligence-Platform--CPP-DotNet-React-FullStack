import { useState } from 'react';

export default function SettingsModal({ open, onClose, darkMode, setDarkMode, maxReadings, setMaxReadings }: {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  maxReadings: number;
  setMaxReadings: (v: number) => void;
}) {
  const [tempMax, setTempMax] = useState(maxReadings);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-600 rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            className={`w-12 h-6 rounded-full flex items-center px-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform${darkMode ? 'translate-x-6' : ''}`}></span>
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Max Readings to Keep</label>
          <input
            type="number"
            min={1}
            max={100}
            value={tempMax}
            onChange={e => setTempMax(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 bg-white text-black"
            style={{ backgroundColor: 'white', color: 'black' }}
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => { setMaxReadings(tempMax); onClose(); }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
