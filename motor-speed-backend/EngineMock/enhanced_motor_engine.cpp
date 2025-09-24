#include "enhanced_motor_engine.hpp"
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <cstring>
#include <random>
#include <chrono>
#include <vector>
#include <map>
#include <string>
#include <algorithm>

#ifdef __cplusplus
extern "C" {
#endif

// Enhanced random number generator for better randomness
static std::random_device rd;
static std::mt19937 gen(rd());

// Industrial Machine Types (using the enum from header)
// enum class MachineType is defined in enhanced_motor_engine.hpp

// Machine State Structure
struct MachineState {
    MachineType type;
    std::string id;
    std::string name;
    bool isRunning;
    double currentSpeed;
    double targetSpeed;
    double temperature;
    double load;
    double efficiency;
    double powerConsumption;
    double vibration;
    double pressure;
    double flowRate;
    double bearingWear;
    double oilDegradation;
    double operatingHours;
    std::chrono::steady_clock::time_point lastMaintenance;
    std::chrono::steady_clock::time_point installationTime;
    int maintenanceStatus; // 0=Good, 1=Warning, 2=Critical, 3=Maintenance Due
    double healthScore;
};

// Edge Computing Node Structure
struct EdgeNode {
    std::string id;
    std::string name;
    std::string location;
    double cpuUsage;
    double memoryUsage;
    double networkLatency;
    double processingTime;
    double storageUsed;
    double bandwidthUsage;
    bool isOnline;
    int connectedMachines;
    std::chrono::steady_clock::time_point lastSync;
};

// ML Model Structure for Predictive Maintenance
struct MLModel {
    std::string modelId;
    std::string modelName;
    double accuracy;
    double confidence;
    double failureProbability;
    double remainingUsefulLife;
    std::vector<double> featureWeights;
    std::chrono::steady_clock::time_point lastTraining;
    int predictionCount;
};

// Global Industrial System State
static std::vector<MachineState> industrialMachines;
static std::vector<EdgeNode> edgeNodes;
static std::vector<MLModel> mlModels;
static std::chrono::steady_clock::time_point systemStartTime;
static bool systemInitialized = false;
static int totalReadings = 0;

// Working Hours Simulation (8 AM to 6 PM, Monday to Friday)
static bool isWorkingHours() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    auto tm = *std::localtime(&time_t);
    
    int hour = tm.tm_hour;
    int dayOfWeek = tm.tm_wday; // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // Working hours: 8 AM to 6 PM, Monday to Friday
    return (dayOfWeek >= 1 && dayOfWeek <= 5) && (hour >= 8 && hour < 18);
}

// Seasonal Variation (affects temperature, humidity, etc.)
static double getSeasonalFactor() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    auto tm = *std::localtime(&time_t);
    
    int dayOfYear = tm.tm_yday;
    // Seasonal variation: -0.1 to +0.1 based on day of year
    return 0.1 * sin(2.0 * M_PI * dayOfYear / 365.0);
}

// Initialize Industrial System
static void initializeIndustrialSystem() {
    if (systemInitialized) return;
    
    systemStartTime = std::chrono::steady_clock::now();
    
    // Initialize Industrial Machines
    industrialMachines.clear();
    
    // Main Motor (existing)
    MachineState mainMotor;
    mainMotor.type = MACHINE_TYPE_MOTOR;
    mainMotor.id = "MOTOR-001";
    mainMotor.name = "Main Drive Motor";
    mainMotor.isRunning = true;
    mainMotor.currentSpeed = 2500.0;
    mainMotor.targetSpeed = 2500.0;
    mainMotor.temperature = 65.0;
    mainMotor.load = 0.7;
    mainMotor.efficiency = 92.0;
    mainMotor.powerConsumption = 4.5;
    mainMotor.vibration = 1.5;
    mainMotor.pressure = 3.5;
    mainMotor.flowRate = 15.0;
    mainMotor.bearingWear = 0.0;
    mainMotor.oilDegradation = 0.0;
    mainMotor.operatingHours = 0.0;
    mainMotor.lastMaintenance = systemStartTime;
    mainMotor.installationTime = systemStartTime;
    mainMotor.maintenanceStatus = 0;
    mainMotor.healthScore = 95.0;
    industrialMachines.push_back(mainMotor);
    
    // Industrial Pumps
    for (int i = 1; i <= 3; i++) {
        MachineState pump;
        pump.type = MACHINE_TYPE_PUMP;
        pump.id = "PUMP-" + std::to_string(100 + i);
        pump.name = "Industrial Pump " + std::to_string(i);
        pump.isRunning = isWorkingHours();
        pump.currentSpeed = 1800.0 + (i * 100);
        pump.targetSpeed = 1800.0 + (i * 100);
        pump.temperature = 55.0 + (i * 5);
        pump.load = 0.6 + (i * 0.1);
        pump.efficiency = 88.0 + (i * 2);
        pump.powerConsumption = 3.2 + (i * 0.5);
        pump.vibration = 1.2 + (i * 0.1);
        pump.pressure = 8.0 + (i * 2);
        pump.flowRate = 25.0 + (i * 5);
        pump.bearingWear = 0.0;
        pump.oilDegradation = 0.0;
        pump.operatingHours = 0.0;
        pump.lastMaintenance = systemStartTime;
        pump.installationTime = systemStartTime;
        pump.maintenanceStatus = 0;
        pump.healthScore = 92.0 + (i * 1);
        industrialMachines.push_back(pump);
    }
    
    // Conveyor Systems
    for (int i = 1; i <= 2; i++) {
        MachineState conveyor;
        conveyor.type = MACHINE_TYPE_CONVEYOR;
        conveyor.id = "CONV-" + std::to_string(100 + i);
        conveyor.name = "Conveyor Belt " + std::to_string(i);
        conveyor.isRunning = isWorkingHours();
        conveyor.currentSpeed = 120.0 + (i * 20);
        conveyor.targetSpeed = 120.0 + (i * 20);
        conveyor.temperature = 45.0 + (i * 3);
        conveyor.load = 0.5 + (i * 0.15);
        conveyor.efficiency = 85.0 + (i * 3);
        conveyor.powerConsumption = 2.8 + (i * 0.3);
        conveyor.vibration = 0.8 + (i * 0.1);
        conveyor.pressure = 0.0; // Not applicable
        conveyor.flowRate = 0.0; // Not applicable
        conveyor.bearingWear = 0.0;
        conveyor.oilDegradation = 0.0;
        conveyor.operatingHours = 0.0;
        conveyor.lastMaintenance = systemStartTime;
        conveyor.installationTime = systemStartTime;
        conveyor.maintenanceStatus = 0;
        conveyor.healthScore = 90.0 + (i * 2);
        industrialMachines.push_back(conveyor);
    }
    
    // Compressors
    for (int i = 1; i <= 2; i++) {
        MachineState compressor;
        compressor.type = MACHINE_TYPE_COMPRESSOR;
        compressor.id = "COMP-" + std::to_string(100 + i);
        compressor.name = "Air Compressor " + std::to_string(i);
        compressor.isRunning = isWorkingHours();
        compressor.currentSpeed = 3000.0 + (i * 200);
        compressor.targetSpeed = 3000.0 + (i * 200);
        compressor.temperature = 75.0 + (i * 8);
        compressor.load = 0.8 + (i * 0.1);
        compressor.efficiency = 82.0 + (i * 4);
        compressor.powerConsumption = 7.5 + (i * 1.5);
        compressor.vibration = 2.1 + (i * 0.2);
        compressor.pressure = 12.0 + (i * 3);
        compressor.flowRate = 8.0 + (i * 2);
        compressor.bearingWear = 0.0;
        compressor.oilDegradation = 0.0;
        compressor.operatingHours = 0.0;
        compressor.lastMaintenance = systemStartTime;
        compressor.installationTime = systemStartTime;
        compressor.maintenanceStatus = 0;
        compressor.healthScore = 88.0 + (i * 3);
        industrialMachines.push_back(compressor);
    }
    
    // Industrial Fans (New machine type)
    for (int i = 1; i <= 2; i++) {
        MachineState fan;
        fan.type = MACHINE_TYPE_FAN;
        fan.id = "FAN-" + std::to_string(100 + i);
        fan.name = "Industrial Fan " + std::to_string(i);
        fan.isRunning = isWorkingHours();
        fan.currentSpeed = 800.0 + (i * 100);
        fan.targetSpeed = 800.0 + (i * 100);
        fan.temperature = 30.0 + (i * 2);
        fan.load = 0.4 + (i * 0.1);
        fan.efficiency = 85.0 + (i * 3);
        fan.powerConsumption = 2.6 + (i * 0.4);
        fan.vibration = 0.6 + (i * 0.1);
        fan.pressure = 0.0;
        fan.flowRate = 120.0 + (i * 20);
        fan.bearingWear = 0.0;
        fan.oilDegradation = 0.0;
        fan.operatingHours = 0.0;
        fan.lastMaintenance = systemStartTime;
        fan.installationTime = systemStartTime;
        fan.maintenanceStatus = 0;
        fan.healthScore = 92.0 + (i * 2);
        industrialMachines.push_back(fan);
    }
    
    // Backup Generators (New machine type)
    for (int i = 1; i <= 2; i++) {
        MachineState generator;
        generator.type = MACHINE_TYPE_GENERATOR;
        generator.id = "GEN-" + std::to_string(100 + i);
        generator.name = "Backup Generator " + std::to_string(i);
        generator.isRunning = false; // Backup generators are typically off
        generator.currentSpeed = 0.0;
        generator.targetSpeed = 1800.0;
        generator.temperature = 25.0;
        generator.load = 0.0;
        generator.efficiency = 92.0 + (i * 2);
        generator.powerConsumption = 0.0;
        generator.vibration = 0.2;
        generator.pressure = 0.0;
        generator.flowRate = 0.0;
        generator.bearingWear = 0.0;
        generator.oilDegradation = 0.0;
        generator.operatingHours = 0.0;
        generator.lastMaintenance = systemStartTime;
        generator.installationTime = systemStartTime;
        generator.maintenanceStatus = 0;
        generator.healthScore = 95.0 + (i * 1);
        industrialMachines.push_back(generator);
    }
    
    // Steam Turbines (New machine type)
    for (int i = 1; i <= 1; i++) {
        MachineState turbine;
        turbine.type = MACHINE_TYPE_TURBINE;
        turbine.id = "TURB-" + std::to_string(100 + i);
        turbine.name = "Steam Turbine " + std::to_string(i);
        turbine.isRunning = isWorkingHours();
        turbine.currentSpeed = 3600.0;
        turbine.targetSpeed = 3600.0;
        turbine.temperature = 120.0;
        turbine.load = 0.9;
        turbine.efficiency = 88.0;
        turbine.powerConsumption = 0.0; // Generates power
        turbine.vibration = 1.8;
        turbine.pressure = 45.0;
        turbine.flowRate = 150.0;
        turbine.bearingWear = 0.0;
        turbine.oilDegradation = 0.0;
        turbine.operatingHours = 0.0;
        turbine.lastMaintenance = systemStartTime;
        turbine.installationTime = systemStartTime;
        turbine.maintenanceStatus = 0;
        turbine.healthScore = 89.0;
        industrialMachines.push_back(turbine);
    }
    
    // Jaw Crushers (New machine type)
    for (int i = 1; i <= 1; i++) {
        MachineState crusher;
        crusher.type = MACHINE_TYPE_CRUSHER;
        crusher.id = "CRUSH-" + std::to_string(100 + i);
        crusher.name = "Jaw Crusher " + std::to_string(i);
        crusher.isRunning = isWorkingHours();
        crusher.currentSpeed = 250.0;
        crusher.targetSpeed = 250.0;
        crusher.temperature = 45.0;
        crusher.load = 0.8;
        crusher.efficiency = 78.0;
        crusher.powerConsumption = 75.0;
        crusher.vibration = 3.5;
        crusher.pressure = 0.0;
        crusher.flowRate = 0.0;
        crusher.bearingWear = 0.0;
        crusher.oilDegradation = 0.0;
        crusher.operatingHours = 0.0;
        crusher.lastMaintenance = systemStartTime;
        crusher.installationTime = systemStartTime;
        crusher.maintenanceStatus = 0;
        crusher.healthScore = 82.0;
        industrialMachines.push_back(crusher);
    }
    
    // Industrial Mixers (New machine type)
    for (int i = 1; i <= 2; i++) {
        MachineState mixer;
        mixer.type = MACHINE_TYPE_MIXER;
        mixer.id = "MIX-" + std::to_string(100 + i);
        mixer.name = "Industrial Mixer " + std::to_string(i);
        mixer.isRunning = isWorkingHours();
        mixer.currentSpeed = 60.0 + (i * 20);
        mixer.targetSpeed = 60.0 + (i * 20);
        mixer.temperature = 40.0 + (i * 5);
        mixer.load = 0.6 + (i * 0.1);
        mixer.efficiency = 87.0 + (i * 2);
        mixer.powerConsumption = 5.5 + (i * 1.0);
        mixer.vibration = 1.2 + (i * 0.2);
        mixer.pressure = 0.0;
        mixer.flowRate = 0.0;
        mixer.bearingWear = 0.0;
        mixer.oilDegradation = 0.0;
        mixer.operatingHours = 0.0;
        mixer.lastMaintenance = systemStartTime;
        mixer.installationTime = systemStartTime;
        mixer.maintenanceStatus = 0;
        mixer.healthScore = 90.0 + (i * 2);
        industrialMachines.push_back(mixer);
    }
    
    // Hydraulic Presses (New machine type)
    for (int i = 1; i <= 1; i++) {
        MachineState press;
        press.type = MACHINE_TYPE_PRESS;
        press.id = "PRESS-" + std::to_string(100 + i);
        press.name = "Hydraulic Press " + std::to_string(i);
        press.isRunning = isWorkingHours();
        press.currentSpeed = 0.0; // Presses don't have continuous speed
        press.targetSpeed = 0.0;
        press.temperature = 35.0;
        press.load = 0.7;
        press.efficiency = 85.0;
        press.powerConsumption = 45.0;
        press.vibration = 0.8;
        press.pressure = 200.0;
        press.flowRate = 0.0;
        press.bearingWear = 0.0;
        press.oilDegradation = 0.0;
        press.operatingHours = 0.0;
        press.lastMaintenance = systemStartTime;
        press.installationTime = systemStartTime;
        press.maintenanceStatus = 0;
        press.healthScore = 88.0;
        industrialMachines.push_back(press);
    }
    
    // Initialize Edge Computing Nodes (Enhanced with More Features)
    edgeNodes.clear();
    for (int i = 1; i <= 5; i++) {
        EdgeNode node;
        node.id = "EDGE-" + std::to_string(100 + i);
        node.name = "Edge Node " + std::to_string(i);
        node.location = "Building " + std::to_string(i) + ", Floor " + std::to_string((i % 2) + 1);
        node.cpuUsage = 35.0 + (i * 8);
        node.memoryUsage = 55.0 + (i * 6);
        node.networkLatency = 12.0 + (i * 3);
        node.processingTime = 45.0 + (i * 12);
        node.storageUsed = 6.8 + (i * 2.2);
        node.bandwidthUsage = 60.0 + (i * 8);
        node.isOnline = true;
        node.connectedMachines = 3 + i;
        node.lastSync = systemStartTime;
        edgeNodes.push_back(node);
    }
    
    // Add specialized edge nodes for different functions
    // Data Processing Edge Node
    EdgeNode dataNode;
    dataNode.id = "EDGE-DATA-001";
    dataNode.name = "Data Processing Edge Node";
    dataNode.location = "Building 1, Floor 2";
    dataNode.cpuUsage = 78.0;
    dataNode.memoryUsage = 85.0;
    dataNode.networkLatency = 8.0;
    dataNode.processingTime = 25.0;
    dataNode.storageUsed = 45.2;
    dataNode.bandwidthUsage = 90.0;
    dataNode.isOnline = true;
    dataNode.connectedMachines = 8;
    dataNode.lastSync = systemStartTime;
    edgeNodes.push_back(dataNode);
    
    // AI/ML Processing Edge Node
    EdgeNode aiNode;
    aiNode.id = "EDGE-AI-001";
    aiNode.name = "AI/ML Processing Edge Node";
    aiNode.location = "Building 2, Floor 2";
    aiNode.cpuUsage = 92.0;
    aiNode.memoryUsage = 95.0;
    aiNode.networkLatency = 5.0;
    aiNode.processingTime = 15.0;
    aiNode.storageUsed = 62.8;
    aiNode.bandwidthUsage = 85.0;
    aiNode.isOnline = true;
    aiNode.connectedMachines = 12;
    aiNode.lastSync = systemStartTime;
    edgeNodes.push_back(aiNode);
    
    // Security Edge Node
    EdgeNode securityNode;
    securityNode.id = "EDGE-SEC-001";
    securityNode.name = "Security Edge Node";
    securityNode.location = "Building 3, Floor 1";
    securityNode.cpuUsage = 45.0;
    securityNode.memoryUsage = 70.0;
    securityNode.networkLatency = 3.0;
    securityNode.processingTime = 8.0;
    securityNode.storageUsed = 28.5;
    securityNode.bandwidthUsage = 40.0;
    securityNode.isOnline = true;
    securityNode.connectedMachines = 15;
    securityNode.lastSync = systemStartTime;
    edgeNodes.push_back(securityNode);
    
    // Backup Edge Node (Offline for redundancy)
    EdgeNode backupNode;
    backupNode.id = "EDGE-BACKUP-001";
    backupNode.name = "Backup Edge Node";
    backupNode.location = "Building 4, Floor 1";
    backupNode.cpuUsage = 0.0;
    backupNode.memoryUsage = 0.0;
    backupNode.networkLatency = 0.0;
    backupNode.processingTime = 0.0;
    backupNode.storageUsed = 0.0;
    backupNode.bandwidthUsage = 0.0;
    backupNode.isOnline = false;
    backupNode.connectedMachines = 0;
    backupNode.lastSync = systemStartTime;
    edgeNodes.push_back(backupNode);
    
    // Initialize ML Models (Enhanced with More Models)
    mlModels.clear();
    
    // Predictive Maintenance Model (Enhanced)
    MLModel predictiveModel;
    predictiveModel.modelId = "ML-001";
    predictiveModel.modelName = "Predictive Maintenance Model";
    predictiveModel.accuracy = 96.8;
    predictiveModel.confidence = 0.92;
    predictiveModel.failureProbability = 1.8;
    predictiveModel.remainingUsefulLife = 185.0;
    predictiveModel.featureWeights = {0.35, 0.28, 0.22, 0.10, 0.05};
    predictiveModel.lastTraining = systemStartTime;
    predictiveModel.predictionCount = 0;
    mlModels.push_back(predictiveModel);
    
    // Anomaly Detection Model (New)
    MLModel anomalyModel;
    anomalyModel.modelId = "ML-002";
    anomalyModel.modelName = "Anomaly Detection Model";
    anomalyModel.accuracy = 94.5;
    anomalyModel.confidence = 0.88;
    anomalyModel.failureProbability = 0.0; // Not applicable for anomaly detection
    anomalyModel.remainingUsefulLife = 0.0; // Not applicable
    anomalyModel.featureWeights = {0.40, 0.30, 0.20, 0.10};
    anomalyModel.lastTraining = systemStartTime;
    anomalyModel.predictionCount = 0;
    mlModels.push_back(anomalyModel);
    
    // Energy Optimization Model (New)
    MLModel energyModel;
    energyModel.modelId = "ML-003";
    energyModel.modelName = "Energy Optimization Model";
    energyModel.accuracy = 91.2;
    energyModel.confidence = 0.85;
    energyModel.failureProbability = 0.0; // Not applicable
    energyModel.remainingUsefulLife = 0.0; // Not applicable
    energyModel.featureWeights = {0.45, 0.25, 0.20, 0.10};
    energyModel.lastTraining = systemStartTime;
    energyModel.predictionCount = 0;
    mlModels.push_back(energyModel);
    
    // Quality Control Model (New)
    MLModel qualityModel;
    qualityModel.modelId = "ML-004";
    qualityModel.modelName = "Quality Control Model";
    qualityModel.accuracy = 93.7;
    qualityModel.confidence = 0.90;
    qualityModel.failureProbability = 0.0; // Not applicable
    qualityModel.remainingUsefulLife = 0.0; // Not applicable
    qualityModel.featureWeights = {0.30, 0.35, 0.25, 0.10};
    qualityModel.lastTraining = systemStartTime;
    qualityModel.predictionCount = 0;
    mlModels.push_back(qualityModel);
    
    // Performance Prediction Model (New)
    MLModel performanceModel;
    performanceModel.modelId = "ML-005";
    performanceModel.modelName = "Performance Prediction Model";
    performanceModel.accuracy = 89.4;
    performanceModel.confidence = 0.82;
    performanceModel.failureProbability = 0.0; // Not applicable
    performanceModel.remainingUsefulLife = 0.0; // Not applicable
    performanceModel.featureWeights = {0.25, 0.30, 0.25, 0.20};
    performanceModel.lastTraining = systemStartTime;
    performanceModel.predictionCount = 0;
    mlModels.push_back(performanceModel);
    
    // Fault Diagnosis Model (New)
    MLModel faultModel;
    faultModel.modelId = "ML-006";
    faultModel.modelName = "Fault Diagnosis Model";
    faultModel.accuracy = 95.1;
    faultModel.confidence = 0.91;
    faultModel.failureProbability = 0.0; // Not applicable
    faultModel.remainingUsefulLife = 0.0; // Not applicable
    faultModel.featureWeights = {0.35, 0.25, 0.20, 0.15, 0.05};
    faultModel.lastTraining = systemStartTime;
    faultModel.predictionCount = 0;
    mlModels.push_back(faultModel);
    
    systemInitialized = true;
}

// Update Machine Physics (Enhanced Realism)
static void updateMachinePhysics(MachineState& machine, double elapsedSeconds) {
    if (!machine.isRunning) return;
    
    // Update operating hours
    machine.operatingHours += elapsedSeconds / 3600.0;
    
    // Enhanced bearing wear calculation with realistic factors
    double speedFactor = machine.currentSpeed / 2500.0;
    double loadFactor = machine.load;
    double tempFactor = (machine.temperature - 65.0) / 30.0; // Normalize temperature effect
    
    // Bearing wear increases with speed, load, and temperature (realistic physics)
    machine.bearingWear += (speedFactor * loadFactor * (1.0 + tempFactor * 0.5)) * (elapsedSeconds / 3600.0) * 0.0008;
    
    // Oil degradation with temperature and contamination factors
    double oilTempFactor = (machine.temperature - 65.0) / 20.0;
    machine.oilDegradation += (1.0 + oilTempFactor * 0.3) * (elapsedSeconds / 3600.0) * 0.00015;
    
    // Realistic temperature dynamics with thermal mass and cooling
    double heatGeneration = machine.load * 15.0 + (machine.currentSpeed / 2500.0) * 8.0;
    double coolingRate = 0.8 + (machine.currentSpeed / 2500.0) * 0.4; // Better cooling at higher speeds
    double ambientTemp = 22.0 + getSeasonalFactor() * 5.0;
    
    double tempChange = (heatGeneration - coolingRate * (machine.temperature - ambientTemp)) * (elapsedSeconds / 60.0);
    machine.temperature += tempChange;
    machine.temperature = std::max(ambientTemp, std::min(120.0, machine.temperature));
    
    // Enhanced efficiency calculation with realistic factors
    double baseEfficiency = 95.0;
    double wearLoss = machine.bearingWear * 120.0; // More realistic wear impact
    double oilLoss = machine.oilDegradation * 80.0; // Oil quality impact
    double tempLoss = std::max(0.0, (machine.temperature - 75.0) * 0.2); // Temperature derating
    double loadLoss = std::abs(machine.load - 0.8) * 5.0; // Optimal load is 80%
    
    machine.efficiency = baseEfficiency - wearLoss - oilLoss - tempLoss - loadLoss;
    machine.efficiency = std::max(70.0, std::min(96.0, machine.efficiency));
    
    // Realistic vibration with multiple harmonics and resonance effects
    double baseVibration = 1.0;
    double speedHarmonic = sin(machine.currentSpeed * 0.01) * 0.3;
    double loadHarmonic = sin(machine.load * 10.0) * 0.2;
    double wearHarmonic = machine.bearingWear * 15.0;
    double resonanceEffect = sin(machine.operatingHours * 0.5) * 0.1; // Resonance over time
    
    machine.vibration = baseVibration + speedHarmonic + loadHarmonic + wearHarmonic + resonanceEffect;
    machine.vibration = std::max(0.5, std::min(8.0, machine.vibration));
    
    // Realistic speed control with load response and efficiency feedback
    double targetSpeed = machine.targetSpeed;
    double loadResponse = (machine.load - 0.7) * 300.0; // Speed adjustment for load
    double tempResponse = (machine.temperature - 65.0) * 1.5; // Temperature derating
    double efficiencyResponse = (machine.efficiency - 90.0) * 2.0; // Efficiency impact
    
    double speedChange = (targetSpeed + loadResponse - tempResponse - efficiencyResponse - machine.currentSpeed) * 0.1;
    machine.currentSpeed += speedChange * (elapsedSeconds / 60.0);
    machine.currentSpeed = std::max(targetSpeed * 0.7, std::min(targetSpeed * 1.3, machine.currentSpeed));
    
    // Realistic load variation with production cycles and demand patterns
    double productionCycle = sin(machine.operatingHours * 0.05) * 0.15; // 20-hour production cycle
    double demandVariation = sin(machine.operatingHours * 0.2) * 0.1; // 5-hour demand variation
    double efficiencyVariation = (machine.efficiency - 90.0) * 0.01; // Efficiency affects load
    double seasonalVariation = getSeasonalFactor() * 0.05; // Seasonal demand changes
    
    machine.load = 0.75 + productionCycle + demandVariation + efficiencyVariation + seasonalVariation;
    machine.load = std::max(0.2, std::min(1.0, machine.load));
    
    // Enhanced power consumption with realistic factors
    double basePower = 4.5;
    double loadPower = machine.load * 1.8; // Load-dependent power
    double efficiencyPower = (100.0 - machine.efficiency) * 0.15; // Efficiency losses
    double tempPower = (machine.temperature - 65.0) * 0.05; // Temperature overhead
    double wearPower = machine.bearingWear * 50.0; // Wear increases power consumption
    
    machine.powerConsumption = basePower + loadPower + efficiencyPower + tempPower + wearPower;
    machine.powerConsumption = std::max(2.0, std::min(15.0, machine.powerConsumption));
    
    // Enhanced health score calculation with weighted factors
    double baseHealth = 100.0;
    double wearImpact = machine.bearingWear * 250.0; // Bearing wear is critical
    double oilImpact = machine.oilDegradation * 150.0; // Oil quality affects health
    double tempImpact = std::max(0.0, (machine.temperature - 75.0) * 0.8); // Temperature stress
    double vibrationImpact = (machine.vibration - 1.0) * 12.0; // Vibration indicates problems
    double efficiencyImpact = (100.0 - machine.efficiency) * 0.8; // Efficiency loss
    double operatingHoursImpact = machine.operatingHours * 0.01; // Age factor
    
    machine.healthScore = baseHealth - wearImpact - oilImpact - tempImpact - vibrationImpact - efficiencyImpact - operatingHoursImpact;
    machine.healthScore = std::max(0.0, std::min(100.0, machine.healthScore));
    
    
    // Update maintenance status
    if (machine.bearingWear > 0.1 || machine.oilDegradation > 0.05 || machine.temperature > 90.0 || machine.vibration > 3.0) {
        machine.maintenanceStatus = 2; // Critical
    } else if (machine.bearingWear > 0.05 || machine.oilDegradation > 0.02 || machine.temperature > 80.0 || machine.vibration > 2.5 || machine.efficiency < 85.0) {
        machine.maintenanceStatus = 1; // Warning
    } else if (machine.operatingHours > 0 && (int)(machine.operatingHours) % 100 == 0) {
        machine.maintenanceStatus = 3; // Maintenance Due
    } else {
        machine.maintenanceStatus = 0; // Good
    }
}

// Update Edge Node Performance
static void updateEdgeNodePerformance(EdgeNode& node, double elapsedSeconds) {
    if (!node.isOnline) return;
    
    // Simulate realistic edge node performance variations
    double baseCpu = 45.0 + sin(elapsedSeconds * 0.1) * 10.0;
    node.cpuUsage = std::max(20.0, std::min(90.0, baseCpu + (rand() % 20 - 10)));
    
    double baseMemory = 60.0 + cos(elapsedSeconds * 0.05) * 15.0;
    node.memoryUsage = std::max(30.0, std::min(95.0, baseMemory + (rand() % 15 - 7)));
    
    double baseLatency = 15.0 + sin(elapsedSeconds * 0.2) * 5.0;
    node.networkLatency = std::max(5.0, std::min(50.0, baseLatency + (rand() % 10 - 5)));
    
    double baseProcessing = 50.0 + cos(elapsedSeconds * 0.15) * 20.0;
    node.processingTime = std::max(20.0, std::min(150.0, baseProcessing + (rand() % 30 - 15)));
    
    // Update last sync time
    node.lastSync = std::chrono::steady_clock::now();
}

// Update ML Model Predictions
static void updateMLModelPredictions(MLModel& model, double elapsedSeconds) {
    // Simulate ML model learning and prediction updates
    model.predictionCount++;
    
    // Update accuracy slightly (simulate model improvement)
    model.accuracy += (rand() % 20 - 10) * 0.01;
    model.accuracy = std::max(85.0, std::min(98.0, model.accuracy));
    
    // Update confidence based on recent predictions
    model.confidence += (rand() % 10 - 5) * 0.01;
    model.confidence = std::max(0.7, std::min(0.95, model.confidence));
    
    // Update failure probability based on machine conditions
    double avgHealth = 0.0;
    for (const auto& machine : industrialMachines) {
        avgHealth += machine.healthScore;
    }
    avgHealth /= industrialMachines.size();
    
    model.failureProbability = std::max(0.0, std::min(15.0, (100.0 - avgHealth) * 0.2));
    
    // Update remaining useful life
    model.remainingUsefulLife -= elapsedSeconds / 3600.0; // Decrease by hours
    model.remainingUsefulLife = std::max(30.0, model.remainingUsefulLife);
}

// Utility Functions
static int random_int(int min, int max) {
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

static double random_double(double min, double max) {
    std::uniform_real_distribution<> dis(min, max);
    return dis(gen);
}

// Enhanced API Functions

// Get all industrial machines
int GetIndustrialMachineCount() {
    initializeIndustrialSystem();
    return static_cast<int>(industrialMachines.size());
}

// Get machine by index
const char* GetMachineId(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        static char buffer[256];
        strcpy(buffer, industrialMachines[index].id.c_str());
        return buffer;
    }
    return "UNKNOWN";
}

const char* GetMachineName(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        static char buffer[256];
        strcpy(buffer, industrialMachines[index].name.c_str());
        return buffer;
    }
    return "Unknown Machine";
}

int GetMachineType(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        return static_cast<int>(industrialMachines[index].type);
    }
    return 0;
}

bool GetMachineRunning(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        return industrialMachines[index].isRunning;
    }
    return false;
}

double GetMachineSpeed(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0); // Update with 1 second elapsed
        return machine.currentSpeed + random_double(-1.0, 1.0);
    }
    return 0.0;
}

double GetMachineTemperature(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.temperature + random_double(-0.5, 0.5);
    }
    return 0.0;
}

double GetMachineLoad(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.load + random_double(-0.05, 0.05);
    }
    return 0.0;
}

double GetMachineEfficiency(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.efficiency + random_double(-0.5, 0.5);
    }
    return 0.0;
}

double GetMachinePowerConsumption(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.powerConsumption + random_double(-0.2, 0.2);
    }
    return 0.0;
}

double GetMachineVibration(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.vibration + random_double(-0.1, 0.1);
    }
    return 0.0;
}

double GetMachineHealthScore(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.healthScore + random_double(-1.0, 1.0);
    }
    return 0.0;
}

int GetMachineMaintenanceStatus(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        auto& machine = industrialMachines[index];
        updateMachinePhysics(machine, 1.0);
        return machine.maintenanceStatus;
    }
    return 0;
}

// Edge Computing Functions
int GetEdgeNodeCount() {
    initializeIndustrialSystem();
    return static_cast<int>(edgeNodes.size());
}

const char* GetEdgeNodeId(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        static char buffer[256];
        strcpy(buffer, edgeNodes[index].id.c_str());
        return buffer;
    }
    return "UNKNOWN";
}

const char* GetEdgeNodeName(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        static char buffer[256];
        strcpy(buffer, edgeNodes[index].name.c_str());
        return buffer;
    }
    return "Unknown Node";
}

double GetEdgeNodeCpuUsage(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        auto& node = edgeNodes[index];
        updateEdgeNodePerformance(node, 1.0);
        return node.cpuUsage + random_double(-2.0, 2.0);
    }
    return 0.0;
}

double GetEdgeNodeMemoryUsage(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        auto& node = edgeNodes[index];
        updateEdgeNodePerformance(node, 1.0);
        return node.memoryUsage + random_double(-2.0, 2.0);
    }
    return 0.0;
}

double GetEdgeNodeNetworkLatency(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        auto& node = edgeNodes[index];
        updateEdgeNodePerformance(node, 1.0);
        return node.networkLatency + random_double(-1.0, 1.0);
    }
    return 0.0;
}

double GetEdgeNodeProcessingTime(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < edgeNodes.size()) {
        auto& node = edgeNodes[index];
        updateEdgeNodePerformance(node, 1.0);
        return node.processingTime + random_double(-5.0, 5.0);
    }
    return 0.0;
}

// ML Model Functions
int GetMLModelCount() {
    initializeIndustrialSystem();
    return static_cast<int>(mlModels.size());
}

const char* GetMLModelId(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        static char buffer[256];
        strcpy(buffer, mlModels[index].modelId.c_str());
        return buffer;
    }
    return "UNKNOWN";
}

const char* GetMLModelName(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        static char buffer[256];
        strcpy(buffer, mlModels[index].modelName.c_str());
        return buffer;
    }
    return "Unknown Model";
}

double GetMLModelAccuracy(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        auto& model = mlModels[index];
        updateMLModelPredictions(model, 1.0);
        return model.accuracy + random_double(-0.5, 0.5);
    }
    return 0.0;
}

double GetMLModelConfidence(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        auto& model = mlModels[index];
        updateMLModelPredictions(model, 1.0);
        return model.confidence + random_double(-0.02, 0.02);
    }
    return 0.0;
}

double GetMLModelFailureProbability(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        auto& model = mlModels[index];
        updateMLModelPredictions(model, 1.0);
        return model.failureProbability + random_double(-0.1, 0.1);
    }
    return 0.0;
}

double GetMLModelRemainingUsefulLife(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < mlModels.size()) {
        auto& model = mlModels[index];
        updateMLModelPredictions(model, 1.0);
        return model.remainingUsefulLife + random_double(-1.0, 1.0);
    }
    return 0.0;
}

// Control Functions
void StartMachine(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        industrialMachines[index].isRunning = true;
    }
}

void StopMachine(int index) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        industrialMachines[index].isRunning = false;
    }
}

void SetMachineTargetSpeed(int index, double speed) {
    initializeIndustrialSystem();
    if (index >= 0 && index < industrialMachines.size()) {
        industrialMachines[index].targetSpeed = speed;
    }
}

// System Status Functions
double GetSystemOverallEfficiency() {
    initializeIndustrialSystem();
    double totalEfficiency = 0.0;
    int runningMachines = 0;
    
    for (auto& machine : industrialMachines) {
        if (machine.isRunning) {
            updateMachinePhysics(machine, 1.0);
            totalEfficiency += machine.efficiency;
            runningMachines++;
        }
    }
    
    return runningMachines > 0 ? totalEfficiency / runningMachines : 0.0;
}

double GetSystemTotalPowerConsumption() {
    initializeIndustrialSystem();
    double totalPower = 0.0;
    
    for (auto& machine : industrialMachines) {
        if (machine.isRunning) {
            updateMachinePhysics(machine, 1.0);
            totalPower += machine.powerConsumption;
        }
    }
    
    return totalPower;
}

int GetSystemHealthScore() {
    initializeIndustrialSystem();
    double totalHealth = 0.0;
    int machineCount = 0;
    
    for (auto& machine : industrialMachines) {
        updateMachinePhysics(machine, 1.0);
        totalHealth += machine.healthScore;
        machineCount++;
    }
    
    return machineCount > 0 ? static_cast<int>(totalHealth / machineCount) : 0;
}

// Working Hours and Seasonal Functions
bool GetIsWorkingHours() {
    return isWorkingHours();
}

double GetSeasonalFactor() {
    return getSeasonalFactor();
}

// Legacy Functions (for backward compatibility)
int GetMotorSpeed() {
    return static_cast<int>(GetMachineSpeed(0)); // Main motor is index 0
}

int GetMotorTemperature() {
    return static_cast<int>(GetMachineTemperature(0));
}

double GetVibrationX() {
    return GetMachineVibration(0);
}

double GetVibrationY() {
    return GetMachineVibration(0) * 0.8;
}

double GetVibrationZ() {
    return GetMachineVibration(0) * 0.6;
}

double GetOilPressure() {
    return 3.5 + random_double(-0.1, 0.1);
}

double GetAirPressure() {
    return 7.2 + random_double(-0.2, 0.2);
}

double GetHydraulicPressure() {
    return 175.0 + random_double(-5.0, 5.0);
}

double GetCoolantFlowRate() {
    return 15.0 + random_double(-1.0, 1.0);
}

double GetFuelFlowRate() {
    return 10.0 + random_double(-0.5, 0.5);
}

double GetVoltage() {
    return 230.0 + random_double(-2.0, 2.0);
}

double GetCurrent() {
    return 20.0 + random_double(-1.0, 1.0);
}

double GetPowerFactor() {
    return 0.92 + random_double(-0.02, 0.02);
}

double GetPowerConsumption() {
    return GetSystemTotalPowerConsumption();
}

int GetRPM() {
    return static_cast<int>(GetMachineSpeed(0) * 0.6);
}

double GetTorque() {
    return 55.0 + random_double(-2.0, 2.0);
}

double GetEfficiency() {
    return GetSystemOverallEfficiency();
}

double GetHumidity() {
    return 50.0 + getSeasonalFactor() * 10.0 + random_double(-3.0, 3.0);
}

double GetAmbientTemperature() {
    return 22.0 + getSeasonalFactor() * 5.0 + random_double(-1.0, 1.0);
}

double GetAmbientPressure() {
    return 101.3 + random_double(-0.2, 0.2);
}

double GetShaftPosition() {
    return fmod(GetMachineSpeed(0) * 6.0, 360.0);
}

double GetDisplacement() {
    return 0.1 + random_double(-0.05, 0.05);
}

double GetStrainGauge1() {
    return 400.0 + random_double(-50.0, 50.0);
}

double GetStrainGauge2() {
    return 350.0 + random_double(-40.0, 40.0);
}

double GetStrainGauge3() {
    return 380.0 + random_double(-45.0, 45.0);
}

double GetSoundLevel() {
    return 70.0 + random_double(-3.0, 3.0);
}

double GetBearingHealth() {
    return 95.0 + random_double(-2.0, 2.0);
}

int GetOperatingHours() {
    return 0; // Legacy function - always returns 0
}

int GetOperatingMinutes() {
    return 0; // Legacy function - always returns 0
}

double GetOperatingSeconds() {
    return 0.0; // Legacy function - always returns 0
}

int GetMaintenanceStatus() {
    return GetMachineMaintenanceStatus(0); // Main motor maintenance status
}

int GetSystemHealth() {
    return GetSystemHealthScore();
}

void StartMotor() {
    StartMachine(0); // Start main motor
}

void StopMotor() {
    StopMachine(0); // Stop main motor
}

void ResetMotorState() {
    initializeIndustrialSystem();
    // Reset all machines to initial state
    for (auto& machine : industrialMachines) {
        machine.bearingWear = 0.0;
        machine.oilDegradation = 0.0;
        machine.operatingHours = 0.0;
        machine.healthScore = 95.0;
        machine.maintenanceStatus = 0;
    }
}


#ifdef __cplusplus
}
#endif
