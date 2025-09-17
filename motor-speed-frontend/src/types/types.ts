export interface MotorReading {
  id: number;
  speed: number;
  temperature: number;
  timestamp: string;
  title?: string;
  machineId: string;
  status: "normal" | "warning" | "critical" | "maintenance";
  vibration?: number;
  powerConsumption?: number;
  efficiency?: number;
  operatingHours?: number;
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
  type: "temperature" | "speed" | "vibration" | "efficiency" | "maintenance";
  severity: "low" | "medium" | "high" | "critical";
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
