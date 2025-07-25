import { useEffect, useState } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import AnimatedMotor from './components/AnimatedMotor';
import NotificationSidebar from './components/NotificationSidebar';
import type { MotorReading } from './types';
import ReadingList from './components/ReadingList';
import MotorChart from './components/MotorChart';
import SettingsModal from './components/SettingsModal';
import NavBar from './components/NavBar';

function App() {
  const [readings, setReadings] = useState<MotorReading[]>([]);
  const [alert, setAlert] = useState('');
  const [fastSpinCount, setFastSpinCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [maxReadings, setMaxReadings] = useState(20);

  // CSV export helper
  function exportCsv() {
    if (!readings.length) return;
    const header = 'ID,Speed (RPM),Temperature (°C),Timestamp';
    const rows = readings.map(r => `${r.id},${r.speed},${r.temperature},${r.timestamp}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motor_readings.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Compute highest/lowest temp and RPM notifications
  const highestTemp = readings.length ? readings.reduce((a, b) => a.temperature > b.temperature ? a : b) : null;
  const lowestTemp = readings.length ? readings.reduce((a, b) => a.temperature < b.temperature ? a : b) : null;
  const highestRpm = readings.length ? readings.reduce((a, b) => a.speed > b.speed ? a : b) : null;
  const lowestRpm = readings.length ? readings.reduce((a, b) => a.speed < b.speed ? a : b) : null;

  useEffect(() => {
    axios.get<MotorReading[]>("http://localhost:5001/api/motor").then(res => {
      console.log('[DEBUG] Readings loaded from backend:', res.data);
      res.data.forEach(r => {
        console.log(`[DEBUG] Reading id=${r.id} timestamp=`, r.timestamp);
      });
      setReadings(res.data);
    });

    const hub = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5001/motorHub")
      .withAutomaticReconnect()
      .build();

    hub.on("NewReading", (reading: MotorReading) => {
      setReadings(r => [reading, ...r].slice(0, maxReadings));
      if (reading.temperature > 80) setAlert(`⚠️ High Temp: ${reading.temperature} °C`);
    });

    hub.start();
    return () => { hub.stop(); };
  }, [maxReadings]);

  return (
    <div className={`p-6 max-w-xl mx-auto${darkMode ? ' dark bg-gray-900 text-white' : ''}`}>
      <NavBar />
      {/* Top bar with nav and settings */}
      <div className="flex flex-row items-center justify-between mb-6 w-full">
        <div className="flex flex-col items-start justify-center flex-1">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold mr-4">Motor Dashboard</h1>
            <button
              className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              ⚙️
            </button>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              axios.get('http://localhost:5001/api/motor/sample');
              setFastSpinCount(c => c + 1);
            }}
          >
            Sample Motor
          </button>
        </div>
        <div className="flex flex-col items-end justify-center">
          {readings[0] && <AnimatedMotor rpm={readings[0].speed} />}
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg">Motor Data</span>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          onClick={exportCsv}
        >
          Export CSV
        </button>
      </div>
      <MotorChart readings={readings} />
      <ReadingList readings={readings} />
      <NotificationSidebar
        message={alert}
        highestTemp={highestTemp}
        lowestTemp={lowestTemp}
        highestRpm={highestRpm}
        lowestRpm={lowestRpm}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        maxReadings={maxReadings}
        setMaxReadings={setMaxReadings}
      />
    </div>
  );
}

export default App;
