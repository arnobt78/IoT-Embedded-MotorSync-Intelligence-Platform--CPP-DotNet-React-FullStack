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
static double totalRuntimeSeconds = 0.0;
static bool isInitialized = false;

static int random_int(int min, int max) {
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

static double random_double(double min, double max) {
    std::uniform_real_distribution<> dis(min, max);
    return dis(gen);
}

// Initialize motor runtime tracking
static void initializeMotorTracking() {
    if (!isInitialized) {
        motorInstallationTime = std::chrono::steady_clock::now();
        lastReadingTime = motorInstallationTime;
        isMotorRunning = true; // Assume motor starts running when first reading is taken
        totalRuntimeSeconds = 0.0;
        isInitialized = true;
    }
}

// Update runtime based on actual time passage
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
    }
    
    lastReadingTime = currentTime;
}

// Basic motor parameters
// Motor speed
int GetMotorSpeed() {
    // Simulate realistic motor speed with some variation
    static int base_speed = 2500;
    int variation = random_int(-200, 200);
    return std::max(0, std::min(5000, base_speed + variation));
}

// Motor temperature
int GetMotorTemperature() {
    // Simulate temperature with realistic ranges
    static int base_temp = 65;
    int variation = random_int(-15, 25);
    return std::max(20, std::min(120, base_temp + variation));
}

// 3-axis vibration sensors (mm/s)
double GetVibrationX() {
    return random_double(0.1, 5.0);
}

// Vibration sensors
double GetVibrationY() {
    return random_double(0.1, 4.8);
}

// Vibration sensors
double GetVibrationZ() {
    return random_double(0.1, 3.2);
}

// Pressure sensors (bar)
double GetOilPressure() {
    return random_double(2.5, 4.2);
}

// Pressure sensors
double GetAirPressure() {
    return random_double(6.0, 8.5);
}

// Pressure sensors
double GetHydraulicPressure() {
    return random_double(150.0, 200.0);
}

// Flow rate sensors (L/min)
double GetCoolantFlowRate() {
    return random_double(15.0, 25.0);
}

// Flow rate sensors
double GetFuelFlowRate() {
    return random_double(8.0, 12.0);
}

// Electrical monitoring
// Voltage
double GetVoltage() {
    return random_double(220.0, 240.0);
}

// Electrical monitoring
// Current
double GetCurrent() {
    return random_double(15.0, 25.0);
}

// Electrical monitoring
// Power factor
double GetPowerFactor() {
    return random_double(0.85, 0.95);
}

// Electrical monitoring
// Power consumption
double GetPowerConsumption() {
    return random_double(3.5, 6.0);
}

// Mechanical measurements
int GetRPM() {
    return random_int(1400, 1500);
}

// Mechanical measurements
// Torque
double GetTorque() {
    return random_double(45.0, 65.0);
}

// Mechanical measurements
// Efficiency
double GetEfficiency() {
    return random_double(88.0, 94.0);
}

// Environmental sensors
// Humidity
double GetHumidity() {
    return random_double(30.0, 70.0);
}

// Environmental sensors
// Ambient temperature
double GetAmbientTemperature() {
    return random_double(18.0, 28.0);
}

// Environmental sensors
// Ambient pressure
double GetAmbientPressure() {
    return random_double(101.0, 103.0);
}

// Proximity and position sensors
// Shaft position
double GetShaftPosition() {
    return random_double(0.0, 360.0);
}

// Proximity and position sensors
// Displacement
double GetDisplacement() {
    return random_double(0.0, 0.5);
}

// Strain and stress sensors (microstrain)
// Strain gauge 1
double GetStrainGauge1() {
    return random_double(100.0, 800.0);
}

// Strain and stress sensors (microstrain)
// Strain gauge 2
double GetStrainGauge2() {
    return random_double(80.0, 750.0);
}

// Strain and stress sensors (microstrain)
// Strain gauge 3
double GetStrainGauge3() {
    return random_double(90.0, 780.0);
}

// Acoustic sensors
// Sound level
double GetSoundLevel() {
    return random_double(65.0, 85.0);
}

// Acoustic sensors
// Bearing health
double GetBearingHealth() {
    return random_double(85.0, 98.0);
}

// System status
// Operating hours - now tracks real runtime
int GetOperatingHours() {
    updateRuntime();
    
    // Convert total runtime seconds to hours
    double totalHours = totalRuntimeSeconds / 3600.0;
    
    // Return as integer hours (rounded down)
    return static_cast<int>(totalHours);
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

// System status
// Maintenance status
int GetMaintenanceStatus() {
    // 0 = Good, 1 = Warning, 2 = Critical, 3 = Maintenance Due
    return random_int(0, 3);
}

// System status
// System health
int GetSystemHealth() {
    // 0-100 health percentage
    return random_int(75, 95);
}
