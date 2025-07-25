import type { MotorReading } from '../types';
import { safeDate } from '../lib/dateUtils';

export default function ReadingList({ readings }: { readings: MotorReading[] }) {
  // Group readings by date string (YYYY-MM-DD)
  const grouped: { [date: string]: MotorReading[] } = {};
  readings.forEach(r => {
    // Always use local time zone for grouping
    const localDate = safeDate(r.timestamp);
    if (!localDate) return; // skip invalid dates
    // Use YYYY-MM-DD for grouping to avoid locale ambiguity
    const dateKey = localDate.getFullYear() + '-' + String(localDate.getMonth() + 1).padStart(2, '0') + '-' + String(localDate.getDate()).padStart(2, '0');
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(r);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {sortedDates.map(dateKey => {
        // Display date in local format for the heading
        const [year, month, day] = dateKey.split('-');
        const localDate = safeDate(`${year}-${month}-${day}`);
        const displayDate = localDate ? localDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : dateKey;
        return (
          <div key={dateKey}>
            <div className="font-bold text-lg mb-2 text-blue-700 flex items-center">
              <span>{displayDate}</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">{grouped[dateKey].length} reading{grouped[dateKey].length !== 1 ? 's' : ''}</span>
            </div>
            <ul className="space-y-2">
              {grouped[dateKey].map(r => {
                let bg = '';
                if (r.temperature <= 50) bg = 'bg-green-100';
                else if (r.temperature <= 80) bg = 'bg-yellow-100';
                else bg = 'bg-red-100';
                // Always display time in local time zone
                const d = safeDate(r.timestamp);
                const time = d ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Invalid Date';
                return (
                  <li key={r.id + '-' + r.timestamp} className={`p-4 border rounded flex justify-between ${bg}`}>
                    <div>
                      <div><strong>Speed:</strong> {r.speed} RPM</div>
                      <div><strong>Temp:</strong> {r.temperature} °C</div>
                    </div>
                    <div className="text-sm text-gray-500">{time}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
