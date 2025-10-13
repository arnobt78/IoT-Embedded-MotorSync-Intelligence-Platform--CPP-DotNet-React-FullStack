// ========================================================================
// REAL INDUSTRIAL MOTOR PHYSICS ENGINE HEADER
// Based on IEEE 112, IEC 60034, and industrial standards
// ========================================================================

#ifndef MOTOR_ENGINE_HPP
#define MOTOR_ENGINE_HPP

#ifdef __cplusplus
extern "C" {
#endif

// ========================================================================
// BASIC MOTOR PARAMETERS
// ========================================================================
double GetMotorSpeed();
double GetMotorTemperature();
double GetMotorEfficiency();
double GetMotorPowerConsumption();
double GetMotorVibration();
double GetMotorLoad();
double GetMotorBearingWear();
double GetMotorOilDegradation();
double GetMotorOperatingHours();

// ========================================================================
// 3-AXIS VIBRATION SENSORS
// ========================================================================
double GetVibrationX();
double GetVibrationY();
double GetVibrationZ();

// ========================================================================
// PRESSURE SENSORS
// ========================================================================
double GetOilPressure();
double GetAirPressure();
double GetHydraulicPressure();

// ========================================================================
// FLOW RATE SENSORS
// ========================================================================
double GetCoolantFlowRate();
double GetFuelFlowRate();

// ========================================================================
// ELECTRICAL MONITORING
// ========================================================================
double GetVoltage();
double GetCurrent();
double GetPowerFactor();
double GetPowerConsumption();

// ========================================================================
// MECHANICAL MEASUREMENTS
// ========================================================================
double GetRPM();
double GetTorque();
double GetEfficiency();

// ========================================================================
// ENVIRONMENTAL SENSORS
// ========================================================================
double GetHumidity();
double GetAmbientTemperature();
double GetAmbientPressure();

// ========================================================================
// POSITION SENSORS
// ========================================================================
double GetShaftPosition();
double GetDisplacement();

// ========================================================================
// STRAIN SENSORS
// ========================================================================
double GetStrainGauge1();
double GetStrainGauge2();
double GetStrainGauge3();

// ========================================================================
// ACOUSTIC SENSORS
// ========================================================================
double GetSoundLevel();
double GetBearingHealth();

// ========================================================================
// SYSTEM STATUS
// ========================================================================
int GetOperatingHours();
int GetMaintenanceStatus();
double GetSystemHealth();

// ========================================================================
// DAILY LIFE APPLICATIONS - HOME AUTOMATION
// ========================================================================
double GetHVACEfficiency();
double GetEnergySavings();
double GetComfortLevel();
double GetAirQuality();
int GetSmartDevices();

// ========================================================================
// DAILY LIFE APPLICATIONS - PERSONAL VEHICLE
// ========================================================================
double GetFuelEfficiency();
double GetEngineHealth();
double GetBatteryLevel();
double GetTirePressure();

// ========================================================================
// DAILY LIFE APPLICATIONS - RECREATION EQUIPMENT
// ========================================================================
double GetBoatEngineEfficiency();
int GetBoatEngineHours();
double GetBladeSharpness();
double GetFuelLevel();
double GetGeneratorPowerOutput();
double GetGeneratorFuelEfficiency();
double GetPoolPumpFlowRate();
double GetPoolPumpEnergyUsage();

// ========================================================================
// DAILY LIFE APPLICATIONS - SMART APPLIANCES
// ========================================================================
double GetWashingMachineEfficiency();
double GetDishwasherEfficiency();
double GetRefrigeratorEfficiency();
double GetAirConditionerEfficiency();

// ========================================================================
// INDUSTRIAL MACHINE FUNCTIONS
// ========================================================================
int GetIndustrialMachineCount();
bool GetMachineRunning(int index);
double GetMachineLoad(int index);

// ========================================================================
// MOTOR CONTROL FUNCTIONS
// ========================================================================
void StartMotor();
void StopMotor();
void ResetMotorState();
void ResetPhysicsUpdateFlag();

// ========================================================================
// TEST FUNCTION
// ========================================================================
int TestEngine();

#ifdef __cplusplus
}
#endif

#endif // MOTOR_ENGINE_HPP
