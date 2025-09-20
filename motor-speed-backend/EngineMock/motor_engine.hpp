#pragma once

extern "C" {
    // Basic motor parameters
    __attribute__((visibility("default"))) int GetMotorSpeed();
    __attribute__((visibility("default"))) int GetMotorTemperature();
    
    // 3-axis vibration sensors
    __attribute__((visibility("default"))) double GetVibrationX();
    __attribute__((visibility("default"))) double GetVibrationY();
    __attribute__((visibility("default"))) double GetVibrationZ();
    
    // Pressure sensors
    __attribute__((visibility("default"))) double GetOilPressure();
    __attribute__((visibility("default"))) double GetAirPressure();
    __attribute__((visibility("default"))) double GetHydraulicPressure();
    
    // Flow rate sensors
    __attribute__((visibility("default"))) double GetCoolantFlowRate();
    __attribute__((visibility("default"))) double GetFuelFlowRate();
    
    // Electrical monitoring
    __attribute__((visibility("default"))) double GetVoltage();
    __attribute__((visibility("default"))) double GetCurrent();
    __attribute__((visibility("default"))) double GetPowerFactor();
    __attribute__((visibility("default"))) double GetPowerConsumption();
    
    // Mechanical measurements
    __attribute__((visibility("default"))) int GetRPM();
    __attribute__((visibility("default"))) double GetTorque();
    __attribute__((visibility("default"))) double GetEfficiency();
    
    // Environmental sensors
    __attribute__((visibility("default"))) double GetHumidity();
    __attribute__((visibility("default"))) double GetAmbientTemperature();
    __attribute__((visibility("default"))) double GetAmbientPressure();
    
    // Proximity and position sensors
    __attribute__((visibility("default"))) double GetShaftPosition();
    __attribute__((visibility("default"))) double GetDisplacement();
    
    // Strain and stress sensors
    __attribute__((visibility("default"))) double GetStrainGauge1();
    __attribute__((visibility("default"))) double GetStrainGauge2();
    __attribute__((visibility("default"))) double GetStrainGauge3();
    
    // Acoustic sensors
    __attribute__((visibility("default"))) double GetSoundLevel();
    __attribute__((visibility("default"))) double GetBearingHealth();
    
    // System status
    __attribute__((visibility("default"))) int GetOperatingHours();
    __attribute__((visibility("default"))) int GetOperatingMinutes();
    __attribute__((visibility("default"))) double GetOperatingSeconds();
    __attribute__((visibility("default"))) void StartMotor();
    __attribute__((visibility("default"))) void StopMotor();
    __attribute__((visibility("default"))) void ResetMotorState();
    __attribute__((visibility("default"))) int GetMaintenanceStatus();
    __attribute__((visibility("default"))) int GetSystemHealth();
}
