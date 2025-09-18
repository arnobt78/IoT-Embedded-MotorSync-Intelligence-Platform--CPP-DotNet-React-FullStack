import React from 'react';
import type { MotorReading } from '../types/types';

interface SensorDashboardProps {
  reading: MotorReading | null;
}

export default function SensorDashboard({ reading }: SensorDashboardProps) {
  if (!reading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Industrial Sensor Dashboard</h3>
        <div className="text-gray-500 dark:text-gray-400">No sensor data available</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getHealthColor = (health?: number) => {
    if (!health) return 'text-gray-500';
    if (health >= 90) return 'text-green-600';
    if (health >= 75) return 'text-yellow-600';
    if (health >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Industrial Sensor Dashboard</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reading.status)}`}>
          {reading.status.toUpperCase()}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-90">System Health</div>
          <div className={`text-2xl font-bold ${getHealthColor(reading.systemHealth)}`}>
            {reading.systemHealth || 'N/A'}%
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-90">Efficiency</div>
          <div className="text-2xl font-bold">{reading.efficiency || 'N/A'}%</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-90">Operating Hours</div>
          <div className="text-2xl font-bold">{reading.operatingHours || 'N/A'}h</div>
        </div>
      </div>

      {/* Sensor Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Vibration Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            📳 3-Axis Vibration
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">X-Axis:</span>
              <span className="font-medium">{reading.vibrationX?.toFixed(2) || 'N/A'} mm/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Y-Axis:</span>
              <span className="font-medium">{reading.vibrationY?.toFixed(2) || 'N/A'} mm/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Z-Axis:</span>
              <span className="font-medium">{reading.vibrationZ?.toFixed(2) || 'N/A'} mm/s</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">RMS:</span>
              <span className="font-bold">{reading.vibration?.toFixed(2) || 'N/A'} mm/s</span>
            </div>
          </div>
        </div>

        {/* Pressure Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            🔧 Pressure Sensors
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Oil:</span>
              <span className="font-medium">{reading.oilPressure?.toFixed(2) || 'N/A'} bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Air:</span>
              <span className="font-medium">{reading.airPressure?.toFixed(2) || 'N/A'} bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Hydraulic:</span>
              <span className="font-medium">{reading.hydraulicPressure?.toFixed(1) || 'N/A'} bar</span>
            </div>
          </div>
        </div>

        {/* Electrical Monitoring */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            ⚡ Electrical
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Voltage:</span>
              <span className="font-medium">{reading.voltage?.toFixed(1) || 'N/A'} V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Current:</span>
              <span className="font-medium">{reading.current?.toFixed(1) || 'N/A'} A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Power Factor:</span>
              <span className="font-medium">{reading.powerFactor?.toFixed(3) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Power:</span>
              <span className="font-medium">{reading.powerConsumption?.toFixed(1) || 'N/A'} kW</span>
            </div>
          </div>
        </div>

        {/* Mechanical Measurements */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            ⚙️ Mechanical
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">RPM:</span>
              <span className="font-medium">{reading.rpm || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Torque:</span>
              <span className="font-medium">{reading.torque?.toFixed(1) || 'N/A'} Nm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Shaft Position:</span>
              <span className="font-medium">{reading.shaftPosition?.toFixed(1) || 'N/A'}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Displacement:</span>
              <span className="font-medium">{reading.displacement?.toFixed(3) || 'N/A'} mm</span>
            </div>
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            🌡️ Environment
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Motor Temp:</span>
              <span className="font-medium">{reading.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Ambient Temp:</span>
              <span className="font-medium">{reading.ambientTemperature?.toFixed(1) || 'N/A'}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Humidity:</span>
              <span className="font-medium">{reading.humidity?.toFixed(1) || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Pressure:</span>
              <span className="font-medium">{reading.ambientPressure?.toFixed(1) || 'N/A'} kPa</span>
            </div>
          </div>
        </div>

        {/* Acoustic & Health */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            🔊 Acoustic & Health
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sound Level:</span>
              <span className="font-medium">{reading.soundLevel?.toFixed(1) || 'N/A'} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Bearing Health:</span>
              <span className={`font-medium ${getHealthColor(reading.bearingHealth)}`}>
                {reading.bearingHealth?.toFixed(1) || 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Strain Gauge 1:</span>
              <span className="font-medium">{reading.strainGauge1?.toFixed(1) || 'N/A'} με</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Strain Gauge 2:</span>
              <span className="font-medium">{reading.strainGauge2?.toFixed(1) || 'N/A'} με</span>
            </div>
          </div>
        </div>

        {/* Flow Rate Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            💧 Flow Rates
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Coolant:</span>
              <span className="font-medium">{reading.coolantFlowRate?.toFixed(1) || 'N/A'} L/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Fuel:</span>
              <span className="font-medium">{reading.fuelFlowRate?.toFixed(1) || 'N/A'} L/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Status */}
      {reading.maintenanceStatus !== undefined && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Maintenance Status</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Status Code: {reading.maintenanceStatus} 
            {reading.maintenanceStatus === 0 && ' - Good'}
            {reading.maintenanceStatus === 1 && ' - Warning'}
            {reading.maintenanceStatus === 2 && ' - Critical'}
            {reading.maintenanceStatus === 3 && ' - Maintenance Due'}
          </div>
        </div>
      )}
    </div>
  );
}
