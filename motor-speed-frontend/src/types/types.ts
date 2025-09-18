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

// Predictive Maintenance Models
export interface PredictiveAnalysis {
  machineId: string;
  analysisTimestamp: string;
  overallHealthScore: number;
  riskLevel: string;
  predictions: MaintenancePrediction[];
  recommendations: string[];
  trendAnalysis: TrendAnalysis;
  anomalyDetection: AnomalyDetection[];
}

export interface MaintenancePrediction {
  component: string;
  issue: string;
  severity: string;
  predictedFailureTime: string;
  confidence: number;
  description: string;
}

export interface TrendAnalysis {
  temperatureTrend: number;
  vibrationTrend: number;
  efficiencyTrend: number;
  powerTrend: number;
  analysisPeriod: string;
}

export interface AnomalyDetection {
  timestamp: string;
  sensorType: string;
  value: number;
  expectedRange: string;
  severity: string;
  description: string;
}

export interface OEEAnalysis {
  machineId: string;
  analysisPeriod: string;
  availability: number;
  performance: number;
  quality: number;
  overallOEE: number;
  recommendations: string[];
}

export interface EnergyAnalysis {
  machineId: string;
  analysisPeriod: string;
  totalEnergyConsumption: number;
  averagePowerFactor: number;
  energyEfficiency: number;
  costSavingsPotential: number;
  recommendations: string[];
}

export interface PerformanceBenchmark {
  machineId: string;
  benchmarkPeriod: string;
  currentPerformance: number;
  industryAverage: number;
  bestInClass: number;
  performanceRating: string;
  improvementAreas: string[];
}

// Industrial Management Models
export interface IndustrialMachine {
  id: number;
  machineId: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastSeen: string;
  totalReadings: number;
  averageEfficiency: number;
  maintenanceSchedule?: string;
  operatingHours: number;
  energyConsumption: number;
  powerFactor?: number;
  costPerHour: number;
  productionLineId?: string;
  facilityId?: string;
  department?: string;
  manufacturer?: string;
  model?: string;
  installationDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface ProductionLineAnalysis {
  lineId: string;
  analysisTimestamp: string;
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  totalEnergyConsumption: number;
  totalOperatingCost: number;
  bottlenecks: string[];
  recommendations: string[];
  machineDetails: MachineSummary[];
}

export interface MachineSummary {
  machineId: string;
  name: string;
  status: string;
  efficiency: number;
  energyConsumption: number;
  lastSeen: string;
}

export interface MaintenanceSchedule {
  facilityId: string;
  generatedAt: string;
  scheduledTasks: MaintenanceTask[];
}

export interface MaintenanceTask {
  taskId: string;
  machineId: string;
  machineName: string;
  taskType: string;
  priority: string;
  scheduledDate: string;
  estimatedDuration: number;
  requiredSkills: string[];
  estimatedCost: number;
  description: string;
  assignedTechnician?: string;
  status: string;
}

export interface FacilityOverview {
  facilityId: string;
  name: string;
  location: string;
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  totalEnergyConsumption: number;
  totalOperatingCost: number;
  productionLines: string[];
  departments: string[];
  lastUpdated: string;
}

export interface QualityControlMetrics {
  machineId: string;
  analysisTimestamp: string;
  defectRate: number;
  qualityScore: number;
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  commonDefects: string[];
  qualityRecommendations: string[];
}

export interface SupplyChainOptimization {
  facilityId: string;
  analysisTimestamp: string;
  inventoryTurnover: number;
  inventoryValue: number;
  stockouts: number;
  overstockItems: number;
  optimizationRecommendations: string[];
  criticalItems: InventoryItem[];
}

export interface InventoryItem {
  itemId: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  status: string;
  lastRestocked?: string;
  nextRestockDate?: string;
}
