export interface MotorReading {
  id: number;
  
  // Basic motor parameters
  speed: number;
  temperature: number;
  timestamp: string;
  title?: string;
  machineId: string;
  status: "normal" | "warning" | "critical" | "maintenance";
  
  // 3-axis vibration sensors (mm/s)
  vibrationX?: number;
  vibrationY?: number;
  vibrationZ?: number;
  vibration?: number; // Legacy field for backward compatibility
  
  // Pressure sensors (bar)
  oilPressure?: number;
  airPressure?: number;
  hydraulicPressure?: number;
  
  // Flow rate sensors (L/min)
  coolantFlowRate?: number;
  fuelFlowRate?: number;
  
  // Electrical monitoring
  voltage?: number;
  current?: number;
  powerFactor?: number;
  powerConsumption?: number;
  
  // Mechanical measurements
  rpm?: number;
  torque?: number;
  efficiency?: number;
  
  // Environmental sensors
  humidity?: number;
  ambientTemperature?: number;
  ambientPressure?: number;
  
  // Proximity and position sensors
  shaftPosition?: number;
  displacement?: number;
  
  // Strain and stress sensors (microstrain)
  strainGauge1?: number;
  strainGauge2?: number;
  strainGauge3?: number;
  
  // Acoustic sensors
  soundLevel?: number;
  bearingHealth?: number;
  
  // System status
  operatingHours?: number;
  maintenanceStatus?: number;
  systemHealth?: number;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "online" | "offline" | "maintenance" | "error";
  lastSeen: string;
  totalReadings: number;
  averageEfficiency: number;
}

export interface Alert {
  id: string;
  type: "temperature" | "speed" | "vibration" | "efficiency" | "maintenance" | "pressure" | "bearing" | "system" | "electrical";
  severity: "low" | "medium" | "high" | "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  machineId: string;
  acknowledged: boolean;
}

export interface DashboardStats {
  totalMachines: number;
  onlineMachines: number;
  totalReadings: number;
  averageEfficiency: number;
  criticalAlerts: number;
  maintenanceDue: number;
}
