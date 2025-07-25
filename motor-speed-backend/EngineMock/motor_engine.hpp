#pragma once

extern "C" {
    __attribute__((visibility("default"))) int GetMotorSpeed();
    __attribute__((visibility("default"))) int GetMotorTemperature();
}
