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
  load?: number;

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
  bearingWear?: number;
  oilDegradation?: number;

  // Daily Life Applications - Home Automation
  hvacEfficiency?: number;
  energySavings?: number;
  comfortLevel?: number;
  airQuality?: number;
  smartDevices?: number;

  // Daily Life Applications - Personal Vehicle
  fuelEfficiency?: number;
  engineHealth?: number;
  batteryLevel?: number;
  tirePressure?: number;

  // Daily Life Applications - Recreation Equipment
  boatEngineEfficiency?: number;
  boatEngineHours?: number;
  bladeSharpness?: number;
  fuelLevel?: number;
  generatorPowerOutput?: number;
  generatorFuelEfficiency?: number;
  poolPumpFlowRate?: number;
  poolPumpEnergyUsage?: number;

  // Daily Life Applications - Smart Appliances
  washingMachineEfficiency?: number;
  dishwasherEfficiency?: number;
  refrigeratorEfficiency?: number;
  airConditionerEfficiency?: number;

  // System status
  operatingHours?: number;
  operatingMinutes?: number;
  operatingSeconds?: number;
  maintenanceStatus?: number;
  systemHealth?: number;
}

// Machine Models
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

// Alert Models
export interface Alert {
  id: string;
  type:
    | "temperature"
    | "speed"
    | "vibration"
    | "efficiency"
    | "maintenance"
    | "pressure"
    | "bearing"
    | "system"
    | "electrical";
  severity: "low" | "medium" | "high" | "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  machineId: string;
  acknowledged: boolean;
}

// Dashboard Stats Models
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

// Maintenance Prediction Models
export interface MaintenancePrediction {
  component: string;
  issue: string;
  severity: string;
  predictedFailureTime: string;
  confidence: number;
  description: string;
}

// Trend Analysis Models
export interface TrendAnalysis {
  temperatureTrend: number;
  vibrationTrend: number;
  efficiencyTrend: number;
  powerTrend: number;
  analysisPeriod: string;
}

// Anomaly Detection Models
export interface AnomalyDetection {
  timestamp: string;
  sensorType: string;
  value: number;
  expectedRange: string;
  severity: string;
  description: string;
}

// OEE Analysis Models
export interface OEEAnalysis {
  machineId: string;
  analysisPeriod: string;
  availability: number;
  performance: number;
  quality: number;
  overallOEE: number;
  recommendations: string[];
}

// Energy Analysis Models
export interface EnergyAnalysis {
  machineId: string;
  analysisPeriod: string;
  totalEnergyConsumption: number;
  averagePowerFactor: number;
  energyEfficiency: number;
  costSavingsPotential: number;
  recommendations: string[];
}

// Performance Benchmark Models
export interface PerformanceBenchmark {
  machineId: string;
  benchmarkPeriod: string;
  currentPerformance: number;
  industryAverage: number;
  bestInClass: number;
  performanceRating: string;
  improvementAreas: string[];
}

// Industrial Management Models - Machine
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

// Industrial Management Models - Production Line Analysis
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

// Industrial Management Models - Machine Summary
export interface MachineSummary {
  machineId: string;
  name: string;
  status: string;
  efficiency: number;
  energyConsumption: number;
  lastSeen: string;
}

// Industrial Management Models - Maintenance Schedule
export interface MaintenanceSchedule {
  facilityId: string;
  generatedAt: string;
  scheduledTasks: MaintenanceTask[];
}

// Industrial Management Models - Maintenance Task
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

// Industrial Management Models - Facility Overview
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

// Industrial Management Models - Quality Control Metrics
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

// Industrial Management Models - Supply Chain Optimization
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

// Industrial Management Models - Inventory Item
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

// ========================================================================
// BUSINESS INSIGHTS MODELS
// Comprehensive business analytics and KPIs
// ========================================================================
export interface BusinessInsights {
  executive: ExecutiveSummary;
  financial: FinancialMetrics;
  operational: OperationalKPIs;
  trends: TrendMetrics;
  comparative: ComparativeAnalysis;
  predictive: PredictiveInsights;
}

export interface ExecutiveSummary {
  systemHealthScore: number; // 0-100
  totalUptime: number; // Percentage
  totalMachines: number;
  onlineMachines: number;
  overallEfficiency: number;
  criticalIssues: number;
  topRecommendations: string[];
  lastUpdated: string;
}

export interface FinancialMetrics {
  totalEnergyCost24h: number;
  totalEnergyCost7d: number;
  totalEnergyCost30d: number;
  averageCostPerMachine: number;
  estimatedSavings: number;
  maintenanceCost7d: number;
  maintenanceCost30d: number;
  roi: number; // Return on Investment percentage
  costPerKWh: number;
  totalPowerConsumption: number; // kW
}

export interface OperationalKPIs {
  oee: number; // Overall Equipment Effectiveness
  availability: number; // Percentage
  performance: number; // Percentage
  quality: number; // Percentage
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Repair (hours)
  plannedDowntime: number; // minutes
  unplannedDowntime: number; // minutes
  productionOutput: number; // units
  targetOutput: number; // units
}

export interface TrendMetrics {
  efficiencyTrend: TrendDataPoint[];
  energyCostTrend: TrendDataPoint[];
  uptimeTrend: TrendDataPoint[];
  maintenanceTrend: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string; // Will be ISO string from DateTime
  value: number;
  label: string;
}

export interface ComparativeAnalysis {
  machinePerformance: MachineComparison[];
  departments: DepartmentComparison;
  shifts: ShiftComparison;
  bestPerformer: MachineComparison;
  worstPerformer: MachineComparison;
}

export interface MachineComparison {
  machineId: string;
  machineName: string;
  efficiency: number;
  uptime: number;
  energyCost: number;
  maintenanceEvents: number;
  status: string;
}

export interface DepartmentComparison {
  productionEfficiency: number;
  maintenanceEfficiency: number;
  warehouseEfficiency: number;
}

export interface ShiftComparison {
  dayShiftEfficiency: number;
  nightShiftEfficiency: number;
  dayShiftUptime: number;
  nightShiftUptime: number;
}

export interface PredictiveInsights {
  forecastedMaintenanceCost30d: number;
  expectedDowntimeEvents: number;
  energyProjection30d: number;
  capacityRecommendations: string[];
  upcomingMaintenance: MaintenanceForecast[];
}

export interface MaintenanceForecast {
  machineId: string;
  machineName: string;
  predictedDate: string;
  maintenanceType: string;
  confidence: number; // 0-100
  estimatedCost: number;
}
