#ifndef ENHANCED_MOTOR_ENGINE_HPP
#define ENHANCED_MOTOR_ENGINE_HPP

#ifdef __cplusplus
extern "C" {
#endif

// Industrial Machine Types
typedef enum {
    MACHINE_TYPE_MOTOR = 0,
    MACHINE_TYPE_PUMP = 1,
    MACHINE_TYPE_CONVEYOR = 2,
    MACHINE_TYPE_COMPRESSOR = 3,
    MACHINE_TYPE_FAN = 4,
    MACHINE_TYPE_GENERATOR = 5,
    MACHINE_TYPE_TURBINE = 6,
    MACHINE_TYPE_CRUSHER = 7,
    MACHINE_TYPE_MIXER = 8,
    MACHINE_TYPE_PRESS = 9
} MachineType;

// Enhanced Industrial System Functions

// Industrial Machine Management
int GetIndustrialMachineCount();
const char* GetMachineId(int index);
const char* GetMachineName(int index);
int GetMachineType(int index);
bool GetMachineRunning(int index);
double GetMachineSpeed(int index);
double GetMachineTemperature(int index);
double GetMachineLoad(int index);
double GetMachineEfficiency(int index);
double GetMachinePowerConsumption(int index);
double GetMachineVibration(int index);
double GetMachineHealthScore(int index);
int GetMachineMaintenanceStatus(int index);

// Machine Control Functions
void StartMachine(int index);
void StopMachine(int index);
void SetMachineTargetSpeed(int index, double speed);

// Edge Computing Functions
int GetEdgeNodeCount();
const char* GetEdgeNodeId(int index);
const char* GetEdgeNodeName(int index);
double GetEdgeNodeCpuUsage(int index);
double GetEdgeNodeMemoryUsage(int index);
double GetEdgeNodeNetworkLatency(int index);
double GetEdgeNodeProcessingTime(int index);

// ML Model Functions
int GetMLModelCount();
const char* GetMLModelId(int index);
const char* GetMLModelName(int index);
double GetMLModelAccuracy(int index);
double GetMLModelConfidence(int index);
double GetMLModelFailureProbability(int index);
double GetMLModelRemainingUsefulLife(int index);

// System Status Functions
double GetSystemOverallEfficiency();
double GetSystemTotalPowerConsumption();
int GetSystemHealthScore();
bool GetIsWorkingHours();
double GetSeasonalFactor();

// Legacy Functions (for backward compatibility)
int GetMotorSpeed();
int GetMotorTemperature();
double GetVibrationX();
double GetVibrationY();
double GetVibrationZ();
double GetOilPressure();
double GetAirPressure();
double GetHydraulicPressure();
double GetCoolantFlowRate();
double GetFuelFlowRate();
double GetVoltage();
double GetCurrent();
double GetPowerFactor();
double GetPowerConsumption();
int GetRPM();
double GetTorque();
double GetEfficiency();
double GetHumidity();
double GetAmbientTemperature();
double GetAmbientPressure();
double GetShaftPosition();
double GetDisplacement();
double GetStrainGauge1();
double GetStrainGauge2();
double GetStrainGauge3();
double GetSoundLevel();
double GetBearingHealth();
int GetOperatingHours();
int GetOperatingMinutes();
double GetOperatingSeconds();
int GetMaintenanceStatus();
int GetSystemHealth();
void StartMotor();
void StopMotor();
void ResetMotorState();

#ifdef __cplusplus
}
#endif

#endif // ENHANCED_MOTOR_ENGINE_HPP
