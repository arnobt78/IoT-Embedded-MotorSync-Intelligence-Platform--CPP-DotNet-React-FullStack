# Embedded Motor Engine Speed Dashboard C++, .Net, React Project (Backend)

---

## Project Overview (motor-speed-backend)

This backend powers the Motor Dashboard, providing real-time motor data from a native C++ engine (mock or real) to a modern web frontend. It demonstrates:

- Native C++/C# interop (P/Invoke)
- Real-time updates with SignalR
- Data persistence with EF Core
- RESTful API endpoints
- Dockerized deployment

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [C++ Mock Engine & Real-World Integration](#c-mock-engine--real-world-integration)
5. [.NET Backend: P/Invoke, EF Core, SignalR](#net-backend-pinvoke-ef-core-signalr)
6. [API Endpoints & Data Flow](#api-endpoints--data-flow)
7. [Running the Backend](#running-the-backend)
8. [Docker Usage](#docker-usage)
9. [Testing (xUnit)](#testing-xunit)
10. [Nginx & SSL](#nginx--ssl)
11. [Extending & Reusing](#extending--reusing)
12. [Keywords](#keywords)
13. [Conclusion](#conclusion)

---

## Architecture & Technology Stack

- **C++ (EngineMock):** Native DLL/SO/DYLIB for motor data (mock or real)
- **.NET 8+ (ASP.NET Core):** Backend API, SignalR, P/Invoke, EF Core
- **Entity Framework Core:** SQLite (default), migrations
- **SignalR:** Real-time WebSocket-style communication
- **Docker:** Containerized backend
- **Nginx:** HTTPS, routing (see root README)

---

## Project Structure

```bash
motor-speed-backend/
├── EngineMock/           # C++ mock engine (DLL/SO/DYLIB)
│   ├── motor_engine.cpp
│   ├── motor_engine.hpp
│   └── libmotor_engine.dylib
├── Server/
│   ├── MotorServer/      # ASP.NET Core backend
│   │   ├── Controllers/  # API endpoints
│   │   ├── Data/         # EF Core DbContext
│   │   ├── Hubs/         # SignalR hub
│   │   ├── Models/       # Data models
│   │   ├── Services/     # EngineService (P/Invoke)
│   │   ├── Migrations/   # EF Core migrations
│   │   ├── ...           # Program.cs, config, etc.
│   └── Tests/            # Backend tests (xUnit)
└── Tests/                # Integration/unit tests
```

---

## C++ Mock Engine & Real-World Integration

## C++ Mock Engine

- `EngineMock/motor_engine.cpp` and `motor_engine.hpp` export:
  
  ```cpp
  extern "C" {
      int GetMotorSpeed();
      int GetMotorTemperature();
  }
  ```

- Compiled as a shared library (DLL/SO/DYLIB) for use by .NET.

## Real-World Integration

- Replace mock with your real C++/C library for CAN/USB/EtherCAT.
- Use P/Invoke for direct calls, or C++/CLI wrappers for complex interop.
- For advanced scenarios, use a message queue, gRPC, or microservice for hardware abstraction.

---

## .NET Backend: P/Invoke, EF Core, SignalR

## P/Invoke to C++

- `EngineService.cs` uses `[DllImport]` to call C++ functions:
  
  ```csharp
  [DllImport(LIB_NAME)]
  public static extern int GetMotorSpeed();
  ```

- `Sample()` method fetches data, stores in DB, and broadcasts via SignalR.

## Entity Framework Core

- `AppDbContext` manages the `MotorReadings` table.
- Migrations and schema managed via EF Core CLI.
- Example model:
  
  ```csharp
  public class MotorReading {
      public int Id { get; set; }
      public int Speed { get; set; }
      public int Temperature { get; set; }
      public DateTime Timestamp { get; set; }
  }
  ```

## SignalR

- `MotorHub` broadcasts new readings to all connected clients in real time.
- Real-time log activity and notification via SignalR.

---

## API Endpoints & Data Flow

- `GET /api/motor` — fetch latest readings
- `GET /api/motor/sample` — trigger a new reading (from C++ engine)
- `GET /health` — health check
- `GET /swagger/index.html` — OpenAPI docs

---

## Running the Backend

## Prerequisites

- .NET 8+ SDK
- C++ compiler (for EngineMock)
- Docker (optional)

## Local Development

```sh
cd Server/MotorServer
# Build C++ engine if needed
# e.g. g++ -shared -o libmotor_engine.dylib motor_engine.cpp
# Run backend
 dotnet run
```

## Running with Docker

```sh
docker build -t motor-backend ./Server/MotorServer
# Or use docker-compose from project root
# docker-compose up --build
```

---

## Docker Usage

- Backend has its own `Dockerfile` for containerization.
- Use `docker-compose.yml` at project root to orchestrate backend, frontend, and Nginx.
- Example backend Dockerfile:
  
  ```dockerfile
  FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
  WORKDIR /app
  COPY . .
  RUN dotnet build
  ENTRYPOINT ["dotnet", "MotorServer.dll"]
  ```

---

## Testing (xUnit)

- Unit and integration tests are in `Tests/` and `Server/Tests/`.
- To run all backend tests:
  
  ```sh
  dotnet test Tests/
  dotnet test Server/Tests/
  ```

- Example test:
  
  ```csharp
  [Fact]
  public async Task Sample_ShouldReturnValidReading() {
      var svc = new EngineService(...);
      var reading = await svc.Sample();
      Assert.InRange(reading.Speed, 800, 3000);
  }
  ```

---

## Nginx & SSL

- Nginx is used for serving the frontend, reverse proxying to the backend, and handling HTTPS.
- Nginx config for HTTPS, static file serving, and reverse proxy to backend/frontend (see root README and `nginx.conf`).
- Self-signed certs for dev in `/etc/nginx/certs/`.
- For production, replace with real certs.

---

## Extending & Reusing

- The backend is modular and reusable:
  - Add new C++ functions to `EngineMock` and update P/Invoke in `EngineService`.
  - Create new API endpoints in `Controllers/`.
  - Extend SignalR hubs for additional real-time features.
  - Use EF Core migrations to evolve the database schema.
- Backend services and controllers are easily extensible for new endpoints or hardware.
- To use in another project, copy the relevant service/controller and update as needed.

---

## Keywords

C++, C#, .NET, ASP.NET Core, SignalR, EF Core, SQLite, Docker, Nginx, CAN, USB, EtherCAT, P/Invoke, C++/CLI, real-time, dashboard, IoT, industrial, API, notification, OpenAPI, Swagger, modular, reusable, hardware integration

---

## Conclusion

This backend provides a robust foundation for building real-time machine dashboards, integrating native C++ code with .NET technologies. It supports both mock and real-world hardware integration, making it suitable for various industrial and IoT applications. The architecture is designed to be modular and extensible, allowing you to adapt it to your specific needs.
This backend is a practical, modern, and extensible template for real-time machine dashboards, bridging native C++ code and .NET. Use it for learning, prototyping, or as a foundation for your next industrial or IoT project.

---

Happy coding! 🚀

If you have any questions or need further assistance, feel free to reach out. Your feedback is always welcome, and contributions to improve this project are encouraged.

Thank you!

---
