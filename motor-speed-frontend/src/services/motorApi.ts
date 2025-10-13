// src/services/motorApi.ts
import axios from "axios";
import { API_BASE_URL } from "./api";

// Motor Reading Interface (matches our consolidated backend)
export interface MotorReading {
  id: number;
  speed: number;
  temperature: number;
  timestamp: string;
  title: string;
  machineId: string;
  status: string;
  vibrationX: number;
  vibrationY: number;
  vibrationZ: number;
  vibration: number;
  oilPressure: number;
  airPressure: number;
  hydraulicPressure: number;
  coolantFlowRate: number;
  fuelFlowRate: number;
  voltage: number;
  current: number;
  powerFactor: number;
  powerConsumption: number;
  rpm: number;
  torque: number;
  efficiency: number;
  humidity: number;
  ambientTemperature: number;
  ambientPressure: number;
  shaftPosition: number;
  displacement: number;
  strainGauge1: number;
  strainGauge2: number;
  strainGauge3: number;
  soundLevel: number;
  bearingHealth: number;
  bearingWear: number;
  oilDegradation: number;
  hvacEfficiency: number;
  energySavings: number;
  comfortLevel: number;
  airQuality: number;
  smartDevices: number;
  fuelEfficiency: number;
  engineHealth: number;
  batteryLevel: number;
  tirePressure: number;
  boatEngineEfficiency: number;
  boatEngineHours: number;
  bladeSharpness: number;
  fuelLevel: number;
  generatorPowerOutput: number;
  generatorFuelEfficiency: number;
  poolPumpFlowRate: number;
  poolPumpEnergyUsage: number;
  washingMachineEfficiency: number;
  dishwasherEfficiency: number;
  refrigeratorEfficiency: number;
  airConditionerEfficiency: number;
  operatingHours: number;
  operatingMinutes: number;
  operatingSeconds: number;
  maintenanceStatus: number;
  systemHealth: number;
}

// Dashboard Stats Interface
export interface DashboardStats {
  totalReadings: number;
  averageSpeed: number;
  averageTemperature: number;
  averageEfficiency: number;
  systemHealth: number;
  lastUpdated: string;
}

// Alert Interface
export interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  machineId: string;
  severity: "low" | "medium" | "high" | "critical";
}

// Motor API Service
export class MotorApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }

  // Get motor test data
  async getMotorTest(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/api/motor/test`);
      return response.data;
    } catch (error) {
      console.error("Error fetching motor test:", error);
      throw error;
    }
  }

  // Get sample motor reading
  async getMotorSample(): Promise<MotorReading> {
    try {
      const response = await axios.get(`${this.baseURL}/api/motor/sample`);
      return response.data;
    } catch (error) {
      console.error("Error fetching motor sample:", error);
      throw error;
    }
  }

  // Generate new motor reading
  async generateMotorReading(): Promise<MotorReading> {
    try {
      const response = await axios.post(`${this.baseURL}/api/motor/generate`);
      return response.data;
    } catch (error) {
      console.error("Error generating motor reading:", error);
      throw error;
    }
  }

  // Get all motor readings
  async getAllMotorReadings(): Promise<MotorReading[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/motor`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all motor readings:", error);
      throw error;
    }
  }

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.baseURL}/api/motor/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // Get system overview
  async getSystemOverview(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/motor/system-overview`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching system overview:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const motorApiService = new MotorApiService();
