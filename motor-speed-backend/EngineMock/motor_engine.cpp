#include "motor_engine.hpp"
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <random>

// Global random number generator for better randomness
static std::random_device rd;
static std::mt19937 gen(rd());

static int random_int(int min, int max) {
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

static double random_double(double min, double max) {
    std::uniform_real_distribution<> dis(min, max);
    return dis(gen);
}

// Basic motor parameters
int GetMotorSpeed() {
    // Simulate realistic motor speed with some variation
    static int base_speed = 2500;
    int variation = random_int(-200, 200);
    return std::max(0, std::min(5000, base_speed + variation));
}

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

double GetVibrationY() {
    return random_double(0.1, 4.8);
}

double GetVibrationZ() {
    return random_double(0.1, 3.2);
}

// Pressure sensors (bar)
double GetOilPressure() {
    return random_double(2.5, 4.2);
}

double GetAirPressure() {
    return random_double(6.0, 8.5);
}

double GetHydraulicPressure() {
    return random_double(150.0, 200.0);
}

// Flow rate sensors (L/min)
double GetCoolantFlowRate() {
    return random_double(15.0, 25.0);
}

double GetFuelFlowRate() {
    return random_double(8.0, 12.0);
}

// Electrical monitoring
double GetVoltage() {
    return random_double(220.0, 240.0);
}

double GetCurrent() {
    return random_double(15.0, 25.0);
}

double GetPowerFactor() {
    return random_double(0.85, 0.95);
}

double GetPowerConsumption() {
    return random_double(3.5, 6.0);
}

// Mechanical measurements
int GetRPM() {
    return random_int(1400, 1500);
}

double GetTorque() {
    return random_double(45.0, 65.0);
}

double GetEfficiency() {
    return random_double(88.0, 94.0);
}

// Environmental sensors
double GetHumidity() {
    return random_double(30.0, 70.0);
}

double GetAmbientTemperature() {
    return random_double(18.0, 28.0);
}

double GetAmbientPressure() {
    return random_double(101.0, 103.0);
}

// Proximity and position sensors
double GetShaftPosition() {
    return random_double(0.0, 360.0);
}

double GetDisplacement() {
    return random_double(0.0, 0.5);
}

// Strain and stress sensors (microstrain)
double GetStrainGauge1() {
    return random_double(100.0, 800.0);
}

double GetStrainGauge2() {
    return random_double(80.0, 750.0);
}

double GetStrainGauge3() {
    return random_double(90.0, 780.0);
}

// Acoustic sensors
double GetSoundLevel() {
    return random_double(65.0, 85.0);
}

double GetBearingHealth() {
    return random_double(85.0, 98.0);
}

// System status
int GetOperatingHours() {
    static int hours = 1250;
    hours += random_int(0, 2);
    return hours;
}

int GetMaintenanceStatus() {
    // 0 = Good, 1 = Warning, 2 = Critical, 3 = Maintenance Due
    return random_int(0, 3);
}

int GetSystemHealth() {
    // 0-100 health percentage
    return random_int(75, 95);
}
