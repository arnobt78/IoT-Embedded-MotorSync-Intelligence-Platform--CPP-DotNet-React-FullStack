
# Embedded Motor Engine Speed Temperature Measurement Dashboard C++, .Net, React Project

![Screenshot 2025-07-25 at 23 11 13](https://github.com/user-attachments/assets/7eb6ad46-73a4-4170-a10e-75ff6b4b9966)
![Screenshot 2025-07-25 at 23 11 36](https://github.com/user-attachments/assets/7d0562ee-b9f7-4655-a486-c8e4c49a06b9)
![Screenshot 2025-07-25 at 23 11 49](https://github.com/user-attachments/assets/c304f109-e689-4bda-b496-be94f741155b)
![Screenshot 2025-07-25 at 23 13 54](https://github.com/user-attachments/assets/a01c4b2a-a9ce-480f-bc7c-50dbb4f5648c)

---

## Project Overview (motor-dashboard, motor-speed-backend, motor-speed-frontend)

This project demonstrates a complete workflow for real-time machine data monitoring, from a native C++ engine (mock or real, via DLL) to a .NET backend (with SignalR and EF Core) to a modern React frontend. It is designed for learning, prototyping, and as a reference for real-world industrial or IoT dashboards.

---

## Features

- Real-time motor readings with SignalR
- Animated 3D gear and shadow
- Grouped reading list by date with color-coded cards
- Notification sidebar for highest/lowest temp and RPM
- Real-time charts with Recharts
- Unit & integration tests (backend: xUnit, frontend: React Testing Library)
- Nginx config for routing, HTTPS/SSL
- Dockerized backend, frontend, and Nginx
- Responsive, modern UI

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [How It Works: C++ → C# → React](#how-it-works-c---c---react)
5. [Backend: .NET, C++ DLL, and Real-World Integration](#backend-net-c-dll-and-real-world-integration)
6. [Frontend: React, Vite, Tailwind, shadcn/ui](#frontend-react-vite-tailwind-shadcnui)
7. [Real-Time Communication with SignalR](#real-time-communication-with-signalr)
8. [Database & Persistence (EF Core)](#database--persistence-ef-core)
9. [API Endpoints & Data Flow](#api-endpoints--data-flow)
10. [Running the Project](#running-the-project)
11. [Testing](#testing)
12. [Docker Usage](#docker-usage)
13. [Features & Functionality](#features--functionality)
14. [Extending & Reusing Components](#extending--reusing-components)
15. [Real-World Practical Notes](#real-world-practical-notes)
16. [Keywords](#keywords)
17. [Conclusion](#conclusion)

---

## Architecture & Technology Stack

- **C++ (EngineMock):** Native library simulating motor data (speed, temperature).
- **.NET 8+ (ASP.NET Core):** Backend API, SignalR hub, P/Invoke to C++ DLL, EF Core for persistence.
- **React (Vite):** Frontend UI, real-time charts, notifications, settings, CSV export.
- **SignalR:** Real-time WebSocket-style updates from backend to frontend.
- **Entity Framework Core:** Database ORM for storing readings.
- **Tailwind CSS + shadcn/ui:** Modern, responsive, and accessible UI.
- **Docker & Nginx:** Containerized deployment, HTTPS, and routing.

---

## Project Structure

```bash
motor-dashboard/
├── motor-speed-backend/
│   ├── EngineMock/           # C++ mock engine (DLL/SO/DYLIB)
│   ├── Server/
│   │   ├── MotorServer/      # ASP.NET Core backend
│   │   │   ├── Controllers/  # API endpoints
│   │   │   ├── Data/         # EF Core DbContext
│   │   │   ├── Hubs/         # SignalR hub
│   │   │   ├── Models/       # Data models
│   │   │   ├── Services/     # EngineService (P/Invoke)
│   │   │   ├── Migrations/   # EF Core migrations
│   │   │   ├── ...           # Config, Program.cs, etc.
│   │   └── Tests/            # Backend tests
│   └── Tests/                # Integration/unit tests
├── motor-speed-frontend/
│   ├── src/
│   │   ├── components/       # React UI components
│   │   ├── lib/              # Utilities (date, etc.)
│   │   ├── services/         # API/auth helpers
│   │   ├── types/            # TypeScript types
│   │   └── ...               # App, main, etc.
│   ├── public/               # Static assets
│   ├── ...                   # Config, Dockerfile, etc.
├── nginx.conf                # Nginx config for HTTPS/routing
└── README.md                 # This file
```

---

## How It Works: C++ → C# → React

1. **C++ EngineMock:**  
   - Simulates a real motor controller, exporting `GetMotorSpeed()` and `GetMotorTemperature()` via a shared library (DLL/SO/DYLIB).
   - In a real project, this could be replaced with a library that reads from CAN, USB, EtherCAT, or other industrial protocols.
   - **Example:**

     ```cpp
     extern "C" {
         int GetMotorSpeed();
         int GetMotorTemperature();
     }
     ```

2. **.NET Backend:**  
   - Uses P/Invoke (`[DllImport]`) to call the C++ functions directly from C#.
   - `EngineService` samples the engine, stores readings in SQLite (via EF Core), and broadcasts new readings to all clients using SignalR.
   - API endpoints allow fetching all readings, sampling new data, and health checks.
   - **Example:**

     ```csharp
     [DllImport(LIB_NAME)]
     public static extern int GetMotorSpeed();
     ```

3. **React Frontend:**  
   - Connects to the backend SignalR hub for real-time updates.
   - Fetches historical data via REST API (using axios).
   - Displays readings in charts, lists, and notifications, with CSV export and settings.

---

## Backend: .NET, C++ DLL, and Real-World Integration

### C++ Mock Engine

- `EngineMock/motor_engine.cpp` and `motor_engine.hpp` define and export mock functions.
- Compiled as a shared library (`libmotor_engine.dylib`, `.so`, or `.dll`).

### P/Invoke in C#

- `EngineService.cs` uses `[DllImport]` to call C++ functions.
- Example:
  
  ```csharp
  [DllImport(LIB_NAME)]
  public static extern int GetMotorSpeed();
  ```

### Real-World Integration

- Replace `EngineMock` with your real C++/C library for CAN/USB/EtherCAT.
- Use P/Invoke for direct calls, or C++/CLI wrappers for more complex interop.
- For advanced scenarios, use a message queue, gRPC, or a microservice for hardware abstraction.

### Entity Framework Core

- `AppDbContext` manages the `MotorReadings` table.
- Migrations and schema are managed via EF Core CLI.

### SignalR

- `MotorHub` broadcasts new readings to all connected clients in real time.

---

## Frontend: React, Vite, Tailwind, shadcn/ui

- **Vite** for fast dev/build.
- **React** for UI, with functional components and hooks.
- **Tailwind CSS** and **shadcn/ui** for styling and accessibility.
- **Recharts** for real-time data visualization.
- **SettingsModal**, **NotificationSidebar**, **AnimatedMotor**, etc., are reusable components.

---

## Real-Time Communication with SignalR

- Backend pushes new readings instantly to all clients via SignalR.
- Frontend uses `@microsoft/signalr` to subscribe and update UI in real time.

---

## Database & Persistence (EF Core)

- All readings are stored in SQLite by default (can be swapped for SQL Server, PostgreSQL, etc.).
- Migrations ensure schema is up to date.

---

## API Endpoints & Data Flow

- `GET /api/motor` — fetch latest readings
- `GET /api/motor/sample` — trigger a new reading (from C++ engine)
- `GET /health` — health check
- `GET /swagger/index.html` — OpenAPI docs

Frontend uses axios to call these endpoints and SignalR for real-time updates.

---

## Running the Project

### Prerequisites

- Docker & Docker Compose
- Node.js (for frontend dev)
- .NET 8+ SDK (for backend dev)
- C++ compiler (for building EngineMock)

### Local Development

```sh
docker-compose up --build
```

Or run backend and frontend separately:

**Backend:**

```sh
cd motor-speed-backend/Server/MotorServer
dotnet run
```

**Frontend:**

```sh
cd motor-speed-frontend
npm install
npm run dev
```

---

## Testing

### Backend (xUnit)

- Unit and integration tests are in `motor-speed-backend/Tests/` and `motor-speed-backend/Server/Tests/`.
- To run all backend tests:
  
  ```sh
  dotnet test motor-speed-backend/Tests/
  dotnet test motor-speed-backend/Server/Tests/
  ```

- Example test (C#):
  
  ```csharp
  [Fact]
  public async Task Sample_ShouldReturnValidReading() {
      var svc = new EngineService(...);
      var reading = await svc.Sample();
      Assert.InRange(reading.Speed, 800, 3000);
  }
  ```

### Frontend (React Testing Library)

- Tests are in `motor-speed-frontend/src/components/__tests__/`.
- To run all frontend tests:
  
  ```sh
  cd motor-speed-frontend
  npm test
  ```

- Example test (React):
  
  ```tsx
  import { render } from '@testing-library/react';
  import AnimatedMotor from '../AnimatedMotor';
  test('renders without crashing', () => {
    render(<AnimatedMotor rpm={1200} />);
  });
  ```

---

## Docker Usage

### Overview

- Both backend and frontend have their own `Dockerfile` for containerization.
- The project uses `docker-compose.yml` to orchestrate backend, frontend, and Nginx for HTTPS/routing.

### Building and Running with Docker Compose

```sh
docker-compose up --build
```

This will:

- Build the C++ engine, .NET backend, and React frontend
- Start all services and Nginx for HTTPS
- Serve the dashboard at `https://localhost/` (or as configured)

### Backend Dockerfile Example

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
COPY . .
RUN dotnet build
ENTRYPOINT ["dotnet", "MotorServer.dll"]
```

### Frontend Dockerfile Example

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Nginx

- Handles HTTPS, static file serving, and reverse proxy to backend/frontend.
- Self-signed certs for dev in `/etc/nginx/certs/` (see nginx.conf)
- For production, replace with real certs

---

## Features & Functionality

- Real-time motor readings (SignalR)
- Animated 3D gear and shadow
- Grouped reading list by date, color-coded
- Notification sidebar for highest/lowest temp and RPM
- Real-time charts (Recharts)
- CSV export
- Health check endpoint
- OpenAPI/Swagger docs
- Dark mode toggle
- Settings modal (max readings, dark mode)
- Responsive, modern UI

---

## Extending & Reusing Components

- All React components are modular and reusable.
- Backend services and controllers are easily extensible for new endpoints or hardware.
- To use in another project, copy the relevant component/service and update types as needed.

---

## Real-World Practical Notes

- **Hardware Integration:**  Replace the mock C++ engine with your real hardware library. Use P/Invoke or C++/CLI as needed.
- **Protocols:**  For CAN/USB/EtherCAT, use a vendor SDK or open-source stack, and expose a C API for .NET interop.
- **Security:**  Add authentication/authorization for production.
- **Scalability:**  Swap SQLite for a production DB, use Redis for SignalR backplane if scaling out.

---

## Keywords

C++, C#, .NET, ASP.NET Core, React, Vite, SignalR, WebSocket, EF Core, SQLite, Docker, Tailwind CSS, shadcn/ui, CAN, USB, EtherCAT, P/Invoke, C++/CLI, real-time, dashboard, IoT, industrial, chart, notification, CSV, OpenAPI, Swagger, modular, reusable, microservice, hardware integration

---

## Conclusion

This project is a practical, modern, and extensible template for real-time machine dashboards, bridging native C++ code, .NET backend, and a beautiful React frontend. Use it for learning, prototyping, or as a foundation for your next industrial or IoT project.

---

Happy coding! 🚀  
Thank you!

---
