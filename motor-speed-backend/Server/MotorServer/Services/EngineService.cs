using System.Runtime.InteropServices;
using MotorServer.Data;
using MotorServer.Hubs;
using MotorServer.Models;
using Microsoft.AspNetCore.SignalR;

namespace MotorServer.Services {
    public class EngineService {
        private const string LIB_NAME =
#if WINDOWS
            "motor_engine.dll";
#elif LINUX
            "libmotor_engine.so";
#else
            "libmotor_engine.dylib";
#endif

        [DllImport(LIB_NAME)]
        public static extern int GetMotorSpeed();

        [DllImport(LIB_NAME)]
        public static extern int GetMotorTemperature();

        private readonly AppDbContext _db;
        private readonly IHubContext<MotorHub> _hub;

        public EngineService(AppDbContext db, IHubContext<MotorHub> hub) {
            _db = db; _hub = hub;
        }

        public async Task<MotorReading> Sample() {
            var reading = new MotorReading {
                Speed = GetMotorSpeed(),
                Temperature = GetMotorTemperature(),
                Timestamp = DateTime.UtcNow
            };
            _db.MotorReadings.Add(reading);
            await _db.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("NewReading", reading);
            return reading;
        }
    }
}
