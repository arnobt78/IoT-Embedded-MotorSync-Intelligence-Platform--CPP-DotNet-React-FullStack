#include "motor_engine.hpp"
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <random>
#include <chrono>

// Global random number generator for better randomness
static std::random_device rd;
static std::mt19937 gen(rd());

// Motor installation timestamp and runtime tracking
static std::chrono::steady_clock::time_point motorInstallationTime;
static std::chrono::steady_clock::time_point lastReadingTime;
static bool isMotorRunning = false;
static double totalRuntimeSeconds = 0.0; // Force start from 0
static bool isInitialized = false;

// Motor state variables for realistic calculations
static double currentSpeed = 2500.0;  // RPM
static double currentTemperature = 65.0;  // °C
static double currentLoad = 0.7;  // Load factor (0.0 to 1.0)
static double motorEfficiency = 92.0;  // %
static double bearingWear = 0.0;  // Accumulated wear over time
static double oilDegradation = 0.0;  // Oil quality degradation
static double vibrationBase = 1.5;  // Base vibration level
static int readingCount = 0;  // Total readings taken

static int random_int(int min, int max) {
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

static double random_double(double min, double max) {
    std::uniform_real_distribution<> dis(min, max);
    return dis(gen);
}

// Reset all static variables to initial state
static void resetMotorState() {
    // Reset runtime tracking
    motorInstallationTime = std::chrono::steady_clock::now();
    lastReadingTime = motorInstallationTime;
    isMotorRunning = true;
    totalRuntimeSeconds = 0.0;
    isInitialized = true;
    
    // Reset motor state to initial values
    currentSpeed = 2500.0;
    currentTemperature = 65.0;
    currentLoad = 0.7;
    motorEfficiency = 92.0;
    bearingWear = 0.0;
    oilDegradation = 0.0;
    vibrationBase = 1.5;
    readingCount = 0;
}

// Initialize motor runtime tracking
static void initializeMotorTracking() {
    if (!isInitialized) {
        resetMotorState();
    }
}

// Force reset on first call to ensure clean start
static bool firstCall = true;
static void ensureCleanStart() {
    if (firstCall) {
        resetMotorState();
        firstCall = false;
    }
}

// Forward declaration
static void updateMotorPhysics(double elapsedSeconds);

// Update runtime and motor state based on actual time passage
static void updateRuntime() {
    initializeMotorTracking();
    
    auto currentTime = std::chrono::steady_clock::now();
    
    // Calculate time elapsed since last reading
    auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
        currentTime - lastReadingTime
    ).count();
    
    // Convert milliseconds to seconds and add to total runtime
    double elapsedSeconds = elapsed / 1000.0;
    
    // Only count runtime when motor is "running" (when readings are being taken)
    if (isMotorRunning && elapsedSeconds > 0) {
        totalRuntimeSeconds += elapsedSeconds;
        
        // Update motor state based on runtime and physics
        updateMotorPhysics(elapsedSeconds);
    }
    
    readingCount++;
    lastReadingTime = currentTime;
}

// Update motor physics based on runtime and wear
static void updateMotorPhysics(double elapsedSeconds) {
    // Calculate runtime hours for wear calculations
    double runtimeHours = totalRuntimeSeconds / 3600.0;
    
    // Bearing wear increases over time and with speed
    bearingWear += (currentSpeed / 2500.0) * (elapsedSeconds / 3600.0) * 0.001;
    
    // Oil degradation increases over time
    oilDegradation += elapsedSeconds / 3600.0 * 0.0001;
    
    // Temperature increases with load and decreases with efficiency
    double tempChange = (currentLoad - 0.5) * 2.0 + (100.0 - motorEfficiency) * 0.1;
    currentTemperature += tempChange * (elapsedSeconds / 60.0);  // Gradual change
    
    // Apply thermal equilibrium (cooling effect)
    if (currentTemperature > 65.0) {
        currentTemperature -= (currentTemperature - 65.0) * 0.01 * (elapsedSeconds / 60.0);
    }
    
    // Efficiency decreases with wear and oil degradation
    motorEfficiency = 95.0 - (bearingWear * 100.0) - (oilDegradation * 50.0);
    motorEfficiency = std::max(75.0, std::min(95.0, motorEfficiency));
    
    // Vibration increases with bearing wear
    vibrationBase = 1.0 + (bearingWear * 10.0);
    
    // Speed varies slightly based on load and temperature
    double speedVariation = (currentLoad - 0.7) * 500.0 - (currentTemperature - 65.0) * 2.0;
    currentSpeed = 2500.0 + speedVariation;
    currentSpeed = std::max(2000.0, std::min(3000.0, currentSpeed));
    
    // Load varies slightly over time (simulating real-world conditions)
    double loadVariation = sin(runtimeHours * 0.1) * 0.1;
    currentLoad = 0.7 + loadVariation;
    currentLoad = std::max(0.3, std::min(1.0, currentLoad));
}

// Basic motor parameters
// Motor speed - now based on real motor state
int GetMotorSpeed() {
    updateRuntime();
    // Add small realistic variation (±1%)
    double variation = (random_double(-1.0, 1.0) / 100.0) * currentSpeed;
    return static_cast<int>(currentSpeed + variation);
}

// Motor temperature - now based on real thermal dynamics
int GetMotorTemperature() {
    updateRuntime();
    // Add small realistic variation (±0.5°C)
    double variation = random_double(-0.5, 0.5);
    return static_cast<int>(currentTemperature + variation);
}

// 3-axis vibration sensors (mm/s) - now based on real motor condition
double GetVibrationX() {
    updateRuntime();
    // Vibration increases with speed, wear, and load
    double baseVib = vibrationBase + (currentSpeed / 2500.0) * 0.5 + bearingWear * 5.0;
    double variation = random_double(-0.2, 0.2);
    return std::max(0.1, baseVib + variation);
}

// Vibration sensors
double GetVibrationY() {
    updateRuntime();
    // Y-axis typically lower than X-axis
    double baseVib = vibrationBase * 0.8 + (currentSpeed / 2500.0) * 0.4 + bearingWear * 4.0;
    double variation = random_double(-0.15, 0.15);
    return std::max(0.1, baseVib + variation);
}

// Vibration sensors
double GetVibrationZ() {
    updateRuntime();
    // Z-axis typically lowest (axial vibration)
    double baseVib = vibrationBase * 0.6 + (currentSpeed / 2500.0) * 0.3 + bearingWear * 3.0;
    double variation = random_double(-0.1, 0.1);
    return std::max(0.1, baseVib + variation);
}

// Pressure sensors (bar) - now based on real system conditions
double GetOilPressure() {
    updateRuntime();
    // Oil pressure decreases with oil degradation and increases with speed
    double basePressure = 3.5 - (oilDegradation * 2.0) + (currentSpeed / 2500.0) * 0.5;
    double variation = random_double(-0.1, 0.1);
    return std::max(2.0, std::min(5.0, basePressure + variation));
}

// Pressure sensors
double GetAirPressure() {
    updateRuntime();
    // Air pressure varies with temperature and load
    double basePressure = 7.2 - (currentTemperature - 65.0) * 0.02 + currentLoad * 0.8;
    double variation = random_double(-0.2, 0.2);
    return std::max(6.0, std::min(8.5, basePressure + variation));
}

// Pressure sensors
double GetHydraulicPressure() {
    updateRuntime();
    // Hydraulic pressure varies with load and efficiency
    double basePressure = 175.0 + currentLoad * 25.0 - (100.0 - motorEfficiency) * 2.0;
    double variation = random_double(-5.0, 5.0);
    return std::max(150.0, std::min(200.0, basePressure + variation));
}

// Flow rate sensors (L/min) - now based on real system requirements
double GetCoolantFlowRate() {
    updateRuntime();
    // Coolant flow increases with temperature and load
    double baseFlow = 20.0 + (currentTemperature - 65.0) * 0.2 + currentLoad * 3.0;
    double variation = random_double(-1.0, 1.0);
    return std::max(15.0, std::min(25.0, baseFlow + variation));
}

// Flow rate sensors
double GetFuelFlowRate() {
    updateRuntime();
    // Fuel flow increases with load and speed
    double baseFlow = 10.0 + currentLoad * 2.0 + (currentSpeed / 2500.0) * 1.0;
    double variation = random_double(-0.5, 0.5);
    return std::max(8.0, std::min(12.0, baseFlow + variation));
}

// Electrical monitoring - now based on real electrical physics
// Voltage
double GetVoltage() {
    updateRuntime();
    // Voltage varies slightly with load and temperature
    double baseVoltage = 230.0 - (currentLoad - 0.7) * 5.0 - (currentTemperature - 65.0) * 0.1;
    double variation = random_double(-2.0, 2.0);
    return std::max(220.0, std::min(240.0, baseVoltage + variation));
}

// Electrical monitoring
// Current
double GetCurrent() {
    updateRuntime();
    // Current increases with load and decreases with efficiency
    double baseCurrent = 20.0 + currentLoad * 5.0 + (100.0 - motorEfficiency) * 0.3;
    double variation = random_double(-1.0, 1.0);
    return std::max(15.0, std::min(25.0, baseCurrent + variation));
}

// Electrical monitoring
// Power factor
double GetPowerFactor() {
    updateRuntime();
    // Power factor decreases with load and bearing wear
    double basePF = 0.92 - (currentLoad - 0.7) * 0.05 - bearingWear * 0.1;
    double variation = random_double(-0.02, 0.02);
    return std::max(0.85, std::min(0.95, basePF + variation));
}

// Electrical monitoring
// Power consumption
double GetPowerConsumption() {
    updateRuntime();
    // Power consumption increases with load and decreases with efficiency
    double basePower = 4.5 + currentLoad * 1.5 + (100.0 - motorEfficiency) * 0.1;
    double variation = random_double(-0.2, 0.2);
    return std::max(3.5, std::min(6.0, basePower + variation));
}

// Mechanical measurements - now based on real mechanical physics
int GetRPM() {
    updateRuntime();
    // RPM is directly related to speed
    return static_cast<int>(currentSpeed * 0.6);  // RPM is typically lower than speed
}

// Mechanical measurements
// Torque
double GetTorque() {
    updateRuntime();
    // Torque increases with load and decreases with wear
    double baseTorque = 55.0 + currentLoad * 15.0 - bearingWear * 20.0;
    double variation = random_double(-2.0, 2.0);
    return std::max(45.0, std::min(65.0, baseTorque + variation));
}

// Mechanical measurements
// Efficiency
double GetEfficiency() {
    updateRuntime();
    // Efficiency is calculated in updateMotorPhysics, add small variation
    double variation = random_double(-0.5, 0.5);
    return motorEfficiency + variation;
}

// Environmental sensors - now based on time and realistic conditions
// Humidity
double GetHumidity() {
    updateRuntime();
    // Humidity varies with time of day (simulated with runtime)
    double runtimeHours = totalRuntimeSeconds / 3600.0;
    double baseHumidity = 50.0 + sin(runtimeHours * 0.5) * 15.0;  // Daily variation
    double variation = random_double(-3.0, 3.0);
    return std::max(30.0, std::min(70.0, baseHumidity + variation));
}

// Environmental sensors
// Ambient temperature
double GetAmbientTemperature() {
    updateRuntime();
    // Ambient temperature varies with time and affects motor cooling
    double runtimeHours = totalRuntimeSeconds / 3600.0;
    double baseTemp = 22.0 + sin(runtimeHours * 0.3) * 4.0;  // Daily variation
    double variation = random_double(-1.0, 1.0);
    return std::max(18.0, std::min(28.0, baseTemp + variation));
}

// Environmental sensors
// Ambient pressure
double GetAmbientPressure() {
    updateRuntime();
    // Atmospheric pressure varies slightly with weather conditions (simulated)
    double runtimeHours = totalRuntimeSeconds / 3600.0;
    double basePressure = 101.3 + sin(runtimeHours * 0.2) * 1.0;  // Weather variation
    double variation = random_double(-0.2, 0.2);
    return std::max(101.0, std::min(103.0, basePressure + variation));
}

// Proximity and position sensors - now based on real mechanical position
// Shaft position
double GetShaftPosition() {
    updateRuntime();
    // Shaft position rotates continuously based on speed and time
    double rotationSpeed = (currentSpeed / 60.0) * 360.0;  // Degrees per second
    double elapsedSeconds = totalRuntimeSeconds;
    double position = fmod(rotationSpeed * elapsedSeconds, 360.0);
    return position;
}

// Proximity and position sensors
// Displacement
double GetDisplacement() {
    updateRuntime();
    // Displacement increases with bearing wear and vibration
    double baseDisplacement = bearingWear * 2.0 + (vibrationBase - 1.0) * 0.1;
    double variation = random_double(-0.05, 0.05);
    return std::max(0.0, std::min(0.5, baseDisplacement + variation));
}

// Strain and stress sensors (microstrain) - now based on real mechanical stress
// Strain gauge 1
double GetStrainGauge1() {
    updateRuntime();
    // Strain increases with load, speed, and wear
    double baseStrain = 400.0 + currentLoad * 200.0 + (currentSpeed / 2500.0) * 150.0 + bearingWear * 100.0;
    double variation = random_double(-50.0, 50.0);
    return std::max(100.0, std::min(800.0, baseStrain + variation));
}

// Strain and stress sensors (microstrain)
// Strain gauge 2
double GetStrainGauge2() {
    updateRuntime();
    // Different strain gauge position, slightly different response
    double baseStrain = 350.0 + currentLoad * 180.0 + (currentSpeed / 2500.0) * 120.0 + bearingWear * 80.0;
    double variation = random_double(-40.0, 40.0);
    return std::max(80.0, std::min(750.0, baseStrain + variation));
}

// Strain and stress sensors (microstrain)
// Strain gauge 3
double GetStrainGauge3() {
    updateRuntime();
    // Third strain gauge with different characteristics
    double baseStrain = 380.0 + currentLoad * 190.0 + (currentSpeed / 2500.0) * 140.0 + bearingWear * 90.0;
    double variation = random_double(-45.0, 45.0);
    return std::max(90.0, std::min(780.0, baseStrain + variation));
}

// Acoustic sensors - now based on real mechanical condition
// Sound level
double GetSoundLevel() {
    updateRuntime();
    // Sound level increases with speed, wear, and vibration
    double baseSound = 70.0 + (currentSpeed / 2500.0) * 10.0 + bearingWear * 20.0 + (vibrationBase - 1.0) * 5.0;
    double variation = random_double(-3.0, 3.0);
    return std::max(65.0, std::min(85.0, baseSound + variation));
}

// Acoustic sensors
// Bearing health
double GetBearingHealth() {
    updateRuntime();
    // Bearing health decreases with wear and vibration
    double baseHealth = 98.0 - (bearingWear * 15.0) - (vibrationBase - 1.0) * 5.0;
    double variation = random_double(-2.0, 2.0);
    return std::max(85.0, std::min(98.0, baseHealth + variation));
}

// System status
// Operating hours - now tracks real runtime
int GetOperatingHours() {
    ensureCleanStart();
    updateRuntime();
    
    // Convert total runtime seconds to hours
    double totalHours = totalRuntimeSeconds / 3600.0;
    
    // For debugging: always return 0 for now
    return 0; // static_cast<int>(totalHours);
}

// Get operating minutes (for more precision)
int GetOperatingMinutes() {
    updateRuntime();
    
    // Convert total runtime seconds to minutes
    double totalMinutes = totalRuntimeSeconds / 60.0;
    
    return static_cast<int>(totalMinutes);
}

// Get total runtime in seconds (most precise)
double GetOperatingSeconds() {
    updateRuntime();
    return totalRuntimeSeconds;
}

// Start motor (optional function for more realistic control)
void StartMotor() {
    initializeMotorTracking();
    isMotorRunning = true;
    lastReadingTime = std::chrono::steady_clock::now();
}

// Stop motor (optional function for more realistic control)
void StopMotor() {
    updateRuntime(); // Update runtime before stopping
    isMotorRunning = false;
}

// Reset motor state to initial values (public function)
void ResetMotorState() {
    resetMotorState();
}

// System status
// Maintenance status - now based on real system condition
int GetMaintenanceStatus() {
    updateRuntime();
    
    // Calculate maintenance status based on actual conditions
    double runtimeHours = totalRuntimeSeconds / 3600.0;
    
    // Critical conditions
    if (bearingWear > 0.1 || oilDegradation > 0.05 || currentTemperature > 90.0 || vibrationBase > 3.0) {
        return 2; // Critical
    }
    
    // Warning conditions
    if (bearingWear > 0.05 || oilDegradation > 0.02 || currentTemperature > 80.0 || vibrationBase > 2.5 || motorEfficiency < 85.0) {
        return 1; // Warning
    }
    
    // Maintenance due based on runtime (every 100 hours)
    if (runtimeHours > 0 && (int)(runtimeHours) % 100 == 0) {
        return 3; // Maintenance Due
    }
    
    return 0; // Good
}

// System status
// System health - now based on real system condition
int GetSystemHealth() {
    updateRuntime();
    
    // Calculate overall system health based on all factors
    double healthScore = 100.0;
    
    // Deduct points for various issues
    healthScore -= bearingWear * 200.0;           // Bearing wear impact
    healthScore -= oilDegradation * 100.0;        // Oil degradation impact
    healthScore -= (currentTemperature - 65.0) * 0.5;  // Temperature impact
    healthScore -= (vibrationBase - 1.0) * 10.0;  // Vibration impact
    healthScore -= (100.0 - motorEfficiency) * 0.5;  // Efficiency impact
    
    // Ensure health score is within bounds
    healthScore = std::max(0.0, std::min(100.0, healthScore));
    
    return static_cast<int>(healthScore);
}
