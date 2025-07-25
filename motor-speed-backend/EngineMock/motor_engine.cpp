#include "motor_engine.hpp"
#include <cstdlib>
#include <ctime>

static int random_int(int min, int max) {
    return min + rand() % (max - min + 1);
}

int GetMotorSpeed() {
    srand(time(nullptr));
    return random_int(800, 3000);
}

int GetMotorTemperature() {
    srand(time(nullptr));
    return random_int(30, 90);
}
