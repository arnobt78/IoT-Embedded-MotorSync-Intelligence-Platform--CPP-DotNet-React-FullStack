
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MotorReading } from '../types';
import { safeDate } from '../lib/dateUtils';

export default function MotorChart({ readings }: { readings: MotorReading[] }) {
  // Show last 20 readings, sorted oldest to newest
  const data = [...readings].slice(0, 20).reverse().map(r => {
    const d = safeDate(r.timestamp);
    return {
      ...r,
      time: d ? d.toLocaleTimeString() : 'Invalid Date',
    };
  });
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="font-bold mb-2">Real-time Motor Data</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" domain={[0, 'auto']} tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#2563eb" name="Speed (RPM)" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f59e42" name="Temp (°C)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
