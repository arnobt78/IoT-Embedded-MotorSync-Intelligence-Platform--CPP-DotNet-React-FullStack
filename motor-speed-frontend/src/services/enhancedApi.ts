import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Enhanced Industrial Machine Interface
export interface IndustrialMachine {
  id: string;
  name: string;
  type: string;
  isRunning: boolean;
  currentSpeed: number;
  targetSpeed: number;
  temperature: number;
  load: number;
  efficiency: number;
  powerConsumption: number;
  vibration: number;
  pressure: number;
  flowRate: number;
  healthScore: number;
  maintenanceStatus: number;
  lastSeen: string;
  location: string;
  department: string;
  manufacturer: string;
  model: string;
  operatingHours: number;
  lastMaintenance: string;
  installationDate: string;
}

// Edge Computing Node Interface
export interface EdgeNode {
  id: string;
  name: string;
  location: string;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  processingTime: number;
  processingPower: number; // Add processingPower for frontend calculations
  storageUsed: number;
  storageTotal: number; // Add storageTotal for calculations
  bandwidthUsage: number;
  isOnline: boolean;
  connectedMachines: number;
  lastSeen: string; // Add lastSeen for consistency
  lastSync: string;
  status: "online" | "offline" | "error" | "maintenance"; // Make status typed
  version: string;
  temperature: number;
  powerConsumption: number;
}

// ML Model Interface
export interface MLModel {
  id: string;
  name: string;
  accuracy: number;
  confidence: number;
  failureProbability: number;
  remainingUsefulLife: number;
  featureWeights: number[];
  lastTraining: string;
  predictionCount: number;
  modelType: string;
  algorithm: string;
  trainingDataSize: number;
  validationScore: number;
}

// System Overview Interface
export interface SystemOverview {
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  totalPowerConsumption: number;
  systemHealthScore: number;
  isWorkingHours: boolean;
  seasonalFactor: number;
  lastUpdated: string;
  totalEnergyCost: number;
  maintenanceAlerts: number;
  criticalAlerts: number;
  averageUptime: number;
}

// Enhanced Motor Reading Interface
export interface EnhancedMotorReading {
  // Legacy motor reading properties
  speed: number;
  temperature: number;
  vibrationX: number;
  vibrationY: number;
  vibrationZ: number;
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
  operatingHours: number;
  operatingMinutes: number;
  operatingSeconds: number;
  maintenanceStatus: number;
  systemHealth: number;
  timestamp: string;

  // Enhanced properties
  industrialMachines: IndustrialMachine[];
  edgeNodes: EdgeNode[];
  mlModels: MLModel[];
  systemOverview: SystemOverview;
  isWorkingHours: boolean;
  seasonalFactor: number;
}

// Production Line Analysis Interface
export interface ProductionLineAnalysis {
  lineId: string;
  lineName: string;
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  totalEnergyConsumption: number;
  bottlenecks: string[];
  recommendations: string[];
  throughput: number;
  qualityRate: number;
  lastAnalysis: string;
}

// Maintenance Schedule Interface
export interface MaintenanceSchedule {
  facilityId: string;
  scheduledTasks: MaintenanceTask[];
  lastUpdated: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface MaintenanceTask {
  taskId: string;
  machineName: string;
  description: string;
  taskType: string;
  priority: string;
  scheduledDate: string;
  estimatedDuration: number;
  estimatedCost: number;
  requiredSkills: string[];
  status: string;
}

// Quality Control Metrics Interface
export interface QualityControlMetrics {
  machineId: string;
  qualityScore: number;
  defectRate: number;
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  commonDefects: string[];
  qualityRecommendations: string[];
  lastUpdated: string;
}

// Supply Chain Optimization Interface
export interface SupplyChainOptimization {
  facilityId: string;
  inventoryTurnover: number;
  inventoryValue: number;
  stockouts: number;
  overstockItems: number;
  criticalItems: InventoryItem[];
  optimizationRecommendations: string[];
  lastUpdated: string;
}

export interface InventoryItem {
  itemId: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  status: string;
  nextRestockDate?: string;
  supplier: string;
}

// Facility Overview Interface
export interface FacilityOverview {
  facilityId: string;
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  totalEnergyConsumption: number;
  totalOperatingCost: number;
  productionLines: string[];
  departments: string[];
  lastUpdated: string;
}

// Enhanced API Service
export class EnhancedApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get all industrial machines
  async getIndustrialMachines(): Promise<IndustrialMachine[]> {
    try {
      const response = await axios.get<IndustrialMachine[]>(
        `${this.baseURL}/api/EnhancedIndustrial/machines`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching industrial machines:", error);
      throw error;
    }
  }

  // Get specific machine by index
  async getMachine(index: number): Promise<IndustrialMachine> {
    try {
      const response = await axios.get<IndustrialMachine>(
        `${this.baseURL}/api/EnhancedIndustrial/machines/${index}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching machine ${index}:`, error);
      throw error;
    }
  }

  // Start a machine
  async startMachine(index: number): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseURL}/api/EnhancedIndustrial/machines/${index}/start`
      );
      return true;
    } catch (error) {
      console.error(`Error starting machine ${index}:`, error);
      return false;
    }
  }

  // Stop a machine
  async stopMachine(index: number): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseURL}/api/EnhancedIndustrial/machines/${index}/stop`
      );
      return true;
    } catch (error) {
      console.error(`Error stopping machine ${index}:`, error);
      return false;
    }
  }

  // Set machine target speed
  async setMachineSpeed(index: number, speed: number): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseURL}/api/EnhancedIndustrial/machines/${index}/speed`,
        { speed }
      );
      return true;
    } catch (error) {
      console.error(`Error setting machine ${index} speed:`, error);
      return false;
    }
  }

  // Get edge computing nodes
  async getEdgeNodes(): Promise<EdgeNode[]> {
    try {
      const response = await axios.get<EdgeNode[]>(
        `${this.baseURL}/api/EnhancedIndustrial/edge-nodes`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching edge nodes:", error);
      throw error;
    }
  }

  // Get ML models
  async getMLModels(): Promise<MLModel[]> {
    try {
      const response = await axios.get<MLModel[]>(
        `${this.baseURL}/api/EnhancedIndustrial/ml-models`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching ML models:", error);
      throw error;
    }
  }

  // Get system overview
  async getSystemOverview(): Promise<SystemOverview> {
    try {
      const response = await axios.get<SystemOverview>(
        `${this.baseURL}/api/EnhancedIndustrial/system-overview`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching system overview:", error);
      throw error;
    }
  }

  // Get enhanced motor reading (includes all industrial data)
  async getEnhancedReading(): Promise<EnhancedMotorReading> {
    try {
      const response = await axios.get<EnhancedMotorReading>(
        `${this.baseURL}/api/EnhancedIndustrial/enhanced-reading`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching enhanced reading:", error);
      throw error;
    }
  }

  // Get production line analysis
  async getProductionLineAnalysis(
    lineId: string
  ): Promise<ProductionLineAnalysis> {
    try {
      const response = await axios.get<ProductionLineAnalysis>(
        `${this.baseURL}/api/EnhancedIndustrial/production-line/${lineId}/analysis`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching production line analysis for ${lineId}:`,
        error
      );
      throw error;
    }
  }

  // Get maintenance schedule
  async getMaintenanceSchedule(
    facilityId: string
  ): Promise<MaintenanceSchedule> {
    try {
      const response = await axios.get<MaintenanceSchedule>(
        `${this.baseURL}/api/EnhancedIndustrial/maintenance-schedule/${facilityId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching maintenance schedule for ${facilityId}:`,
        error
      );
      throw error;
    }
  }

  // Get quality control metrics
  async getQualityControlMetrics(
    machineId: string
  ): Promise<QualityControlMetrics> {
    try {
      const response = await axios.get<QualityControlMetrics>(
        `${this.baseURL}/api/EnhancedIndustrial/quality-control/${machineId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching quality control metrics for ${machineId}:`,
        error
      );
      throw error;
    }
  }

  // Get supply chain optimization
  async getSupplyChainOptimization(
    facilityId: string
  ): Promise<SupplyChainOptimization> {
    try {
      const response = await axios.get<SupplyChainOptimization>(
        `${this.baseURL}/api/EnhancedIndustrial/supply-chain/${facilityId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching supply chain optimization for ${facilityId}:`,
        error
      );
      throw error;
    }
  }

  // Get facility overview
  async getFacilityOverview(facilityId: string): Promise<FacilityOverview> {
    try {
      const response = await axios.get<FacilityOverview>(
        `${this.baseURL}/api/EnhancedIndustrial/facility-overview/${facilityId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching facility overview for ${facilityId}:`,
        error
      );
      throw error;
    }
  }
}

// Export singleton instance
export const enhancedApiService = new EnhancedApiService();
