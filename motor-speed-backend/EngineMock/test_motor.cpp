#include <iostream>
#include "motor_engine.hpp"

int main() {
    std::cout << "Testing Real Industrial Motor Physics Engine..." << std::endl;
    
    // Test the engine
    int result = TestEngine();
    
    if (result == 1) {
        std::cout << "✅ C++ Engine test successful!" << std::endl;
        
        // Test individual functions
        std::cout << "\n📊 Individual Function Tests:" << std::endl;
        std::cout << "Speed: " << GetMotorSpeed() << " RPM" << std::endl;
        std::cout << "Temperature: " << GetMotorTemperature() << " °C" << std::endl;
        std::cout << "Efficiency: " << GetMotorEfficiency() << "%" << std::endl;
        std::cout << "Power: " << GetMotorPowerConsumption() << " kW" << std::endl;
        std::cout << "Vibration: " << GetMotorVibration() << " mm/s" << std::endl;
        std::cout << "Operating Hours: " << GetMotorOperatingHours() << " hours" << std::endl;
        
        return 0;
    } else {
        std::cout << "❌ C++ Engine test failed!" << std::endl;
        return 1;
    }
}