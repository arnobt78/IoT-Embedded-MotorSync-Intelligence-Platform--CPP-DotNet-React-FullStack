import { FaCog } from "react-icons/fa";
import type { MotorReading } from "../types";
import { safeDate } from "../lib/dateUtils";

type Props = {
  message?: string;
  highestTemp?: MotorReading | null;
  lowestTemp?: MotorReading | null;
  highestRpm?: MotorReading | null;
  lowestRpm?: MotorReading | null;
};

export default function NotificationSidebar({
  message,
  highestTemp,
  lowestTemp,
  highestRpm,
  lowestRpm,
}: Props) {
  return (
    <div className="fixed right-0 top-1/3 w-72 space-y-4 z-50">
      {message && (
        <div className="p-4 bg-red-600 text-white rounded-l-lg shadow-lg">
          {message}
        </div>
      )}
      {highestTemp && (
        <div className="p-4 bg-red-100 text-red-700 border-l-8 border-red-400 rounded-l-lg shadow flex items-center ">
          <span className="mr-2 text-xl">⚠️</span>
          <div>
            <div className="font-bold">
              Highest Temp: {highestTemp.temperature}°C
            </div>
            <div className="text-xs text-gray-500">
              {(() => {
                const d = safeDate(highestTemp.timestamp);
                return d ? d.toLocaleString() : "Invalid Date";
              })()}
            </div>
          </div>
        </div>
      )}
      {lowestTemp && (
        <div className="p-4 bg-green-100 text-green-900 border-l-8 border-green-400 rounded-l-lg shadow flex items-center">
          <span className="mr-2 text-xl">⚠️</span>
          <div>
            <div className="font-bold">
              Lowest Temp: {lowestTemp.temperature}°C
            </div>
            <div className="text-xs text-gray-500">
              {(() => {
                const d = safeDate(lowestTemp.timestamp);
                return d ? d.toLocaleString() : "Invalid Date";
              })()}
            </div>
          </div>
        </div>
      )}
      {highestRpm && (
        <div className="p-4 bg-orange-100 text-orange-900 border-l-8 border-orange-400 rounded-l-lg shadow flex items-center">
          <FaCog className="mr-2 text-xl" />
          <div>
            <div className="font-bold">
              Highest Rotation (RPM): {highestRpm.speed}
            </div>
            <div className="text-xs text-gray-500">
              {(() => {
                const d = safeDate(highestRpm.timestamp);
                return d ? d.toLocaleString() : "Invalid Date";
              })()}
            </div>
          </div>
        </div>
      )}
      {lowestRpm && (
        <div className="p-4 bg-blue-100 text-blue-900 border-l-8 border-blue-400 rounded-l-lg shadow flex items-center">
          <FaCog className="mr-2 text-xl" />
          <div>
            <div className="font-bold">
              Lowest Rotation (RPM): {lowestRpm.speed}
            </div>
            <div className="text-xs text-gray-500">
              {(() => {
                const d = safeDate(lowestRpm.timestamp);
                return d ? d.toLocaleString() : "Invalid Date";
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
