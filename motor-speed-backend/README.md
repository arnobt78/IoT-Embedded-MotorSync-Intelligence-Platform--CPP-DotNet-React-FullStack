# IoT Embedded Motor Sync Intelligence Backend - Real-time Industrial IoT Dashboard, Motor Physics Engine, Business Intelligence Platform for Industrial IoT (C++, .NET, PostgreSQL, SignalR, Docker)

**A production-ready ASP.NET Core 8.0 backend that integrates C++ physics calculations with a PostgreSQL database for real-time industrial motor monitoring and business intelligence.**

This backend powers a comprehensive motor monitoring system with real-time data updates via SignalR, advanced business analytics, predictive maintenance, and IoT edge computing capabilities.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?logo=postgresql)](https://neon.tech/)
[![C++](https://img.shields.io/badge/C++-17-00599C?logo=cplusplus)](https://isocpp.org/)
[![SignalR](https://img.shields.io/badge/SignalR-Real--time-FF6600)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Project Structure](#-project-structure)
- [Architecture](#%EF%B8%8F-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Real-time Updates](#-real-time-updates-signalr)
- [C++ Physics Engine](#-c-physics-engine)
- [Database Schema](#-database-schema)
- [Business Intelligence](#-business-intelligence)
- [Deployment](#-deployment)
- [Code Examples](#-code-examples)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🌟 Overview

The **Motor Speed Backend** is a sophisticated industrial monitoring system that combines:

- **C++ Physics Engine**: Real industrial motor physics calculations based on IEEE 112 and IEC 60034 standards
- **ASP.NET Core 8.0**: Modern, high-performance web API framework
- **PostgreSQL Database**: Cloud-based persistent storage with NeonDB
- **SignalR**: Real-time bi-directional communication for live updates
- **Entity Framework Core**: ORM for database operations with migrations
- **Docker**: Containerized deployment for Hetzner VPS (Coolify) and other cloud platforms

### What Makes This Special?

✅ **Real Physics**: All motor data (speed, temperature, vibration, efficiency, power) calculated using authentic industrial physics formulas  
✅ **Multi-Machine Support**: Dynamically generates and monitors 17 different industrial machines (motors, pumps, compressors, crushers, etc.)  
✅ **Business Intelligence**: Comprehensive analytics including OEE, MTBF, ROI, energy costs, and predictive maintenance  
✅ **Edge Computing**: Simulates 9 edge nodes for distributed processing and local analytics  
✅ **Real-time Updates**: WebSocket-based live data streaming to connected clients  
✅ **Production Ready**: Deployed on Hetzner VPS (Coolify) with persistent PostgreSQL database

---

## ✨ Key Features

### 🔧 Core Functionality

- **Real-time Motor Monitoring**: Live speed, temperature, vibration, efficiency tracking
- **50+ Sensor Parameters**: Comprehensive industrial sensor data (pressure, flow rate, electrical, mechanical, environmental)
- **Multi-Machine Fleet**: Monitor 17 diverse industrial machines simultaneously
- **Working Hours Simulation**: Realistic machine online/offline patterns based on business hours

### 📊 Business Intelligence

- **Executive Dashboard**: System health, uptime, efficiency, critical issues
- **Financial Analytics**: Energy costs (24h/7d/30d), ROI, maintenance costs, savings potential
- **Operational KPIs**: OEE, availability, performance, quality, MTBF, MTTR
- **Trend Analysis**: Historical efficiency, energy, uptime, maintenance trends
- **Comparative Analytics**: Machine performance, department comparison, shift analysis
- **Predictive Insights**: Maintenance forecasting, downtime prediction, capacity planning

### 🌐 Advanced Features

- **Edge Computing**: 9 simulated edge nodes with CPU, memory, latency, storage metrics
- **Machine Learning**: Predictive maintenance models with accuracy tracking
- **Quality Control**: Defect rate monitoring, inspection tracking, quality scores
- **Supply Chain**: Inventory management, stockout tracking, optimization recommendations
- **IoT Integration**: Cloud service status, data upload tracking, API analytics

### 🔄 Real-time Capabilities

- **SignalR Hub**: WebSocket connections for instant data updates
- **Live Alerts**: Temperature, vibration, efficiency threshold alerts
- **Motor Control**: Start/stop machines, adjust speed setpoints
- **Data Streaming**: Continuous motor reading updates every 2 seconds

---

## 🛠️ Technology Stack

### Backend Framework

- **ASP.NET Core 8.0**: Modern web framework for building APIs
- **C# 12**: Latest C# language features with top-level statements
- **Entity Framework Core 8.0**: ORM for database operations
- **SignalR**: Real-time WebSocket communication

### Database

- **PostgreSQL 15+**: Primary database (NeonDB cloud hosting)
- **Npgsql**: .NET PostgreSQL provider
- **Entity Framework Migrations**: Database versioning and schema management

### Physics Engine

- **C++ 17**: High-performance physics calculations
- **Platform Interop**: P/Invoke for C# ↔ C++ communication
- **Cross-platform**: Compiled for Windows (`.dll`), macOS (`.dylib`), Linux (`.so`)

### External Libraries

- **Swashbuckle.AspNetCore**: OpenAPI/Swagger documentation
- **DotNetEnv**: Environment variable loading from `.env` files
- **System.Text.Json**: High-performance JSON serialization

### Development Tools

- **Docker**: Container-based deployment
- **Coolify**: Self-hosting platform for Hetzner VPS
- **Visual Studio 2022** / **VS Code**: IDEs for development
- **dotnet CLI**: Command-line build and run tools

---

## 📁 Project Structure

```bash
motor-speed-backend/
│
├── EngineMock/                     # C++ Physics Engine
│   ├── motor_engine.cpp           # Main physics calculations
│   ├── motor_engine.hpp           # C API header file
│   ├── motor_engine.so            # Linux compiled library (Render)
│   ├── motor_engine.dylib         # macOS compiled library (localhost)
│   └── test_motor.cpp             # C++ engine test suite
│
├── Server/
│   ├── Dockerfile                 # Production Docker configuration
│   │
│   └── MotorServer/               # Main ASP.NET Core Application
│       ├── Program.cs             # Application entry point & configuration
│       ├── MotorServer.csproj     # Project file & dependencies
│       ├── appsettings.json       # Application configuration
│       ├── .env                   # Environment variables (local dev)
│       │
│       ├── Controllers/
│       │   └── MotorController.cs # API endpoints (40+ routes)
│       │
│       ├── Models/
│       │   └── MotorModels.cs     # Data models (20+ classes)
│       │
│       ├── Services/
│       │   └── EngineService.cs   # Business logic & C++ integration
│       │
│       ├── Data/
│       │   └── AppDbContext.cs    # Entity Framework database context
│       │
│       ├── Hubs/
│       │   └── MotorHub.cs        # SignalR real-time hub
│       │
│       ├── Migrations/            # EF Core database migrations
│       │   └── [7 migration files]
│       │
│       └── Properties/
│           └── launchSettings.json # Development launch configuration
│
├── Tests/                         # Unit & Integration Tests
│   ├── Unit/
│   │   └── EngineServiceTests.cs
│   └── Integration/
│       └── MotorApiTests.cs.bak
│
├── motor-speed-backend.sln        # Visual Studio Solution file
└── README.md                      # This file
```

---

## 🏗️ Architecture

### System Architecture Diagram

```bash
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                     Netlify: motor-speed-temperature             │
└────────────────┬────────────────────────────┬───────────────────┘
                 │                            │
                 │ HTTP/REST API              │ WebSocket (SignalR)
                 │                            │
┌────────────────▼────────────────────────────▼───────────────────┐
│                    ASP.NET Core 8.0 Backend                      │
│        Hetzner VPS (Coolify): your-backend.duckdns.org           │
│        OR Render.com: your-backend.onrender.com                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MotorController.cs (40+ API endpoints)                  │  │
│  │  • GET /api/motor/sample  - Generate reading             │  │
│  │  • GET /api/motor/machines - Get 17 machines             │  │
│  │  • GET /api/motor/business-insights - BI analytics       │  │
│  │  • GET /api/motor/edge-nodes - Edge computing            │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐  │
│  │  EngineService.cs (Business Logic Layer)                 │  │
│  │  • C++ interop via P/Invoke                              │  │
│  │  • Industrial machine generation (17 machines)           │  │
│  │  • Business analytics calculations                       │  │
│  │  • Real-time alert generation                            │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐  │
│  │  motor_engine.so/dylib (C++ Physics Engine)              │  │
│  │  • Real industrial physics formulas                      │  │
│  │  • IEEE 112 / IEC 60034 standards                        │  │
│  │  • 60+ sensor calculations                               │  │
│  │  • Platform-specific compilation                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AppDbContext (Entity Framework Core)                    │  │
│  │  • MotorReadings table                                   │  │
│  │  • Alerts table                                          │  │
│  │  • Machines table                                        │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              PostgreSQL Database (NeonDB)                        │
│  • Cloud-hosted persistent storage                              │
│  • Automatic backups and scaling                                │
│  • Connection pooling (1-20 connections)                         │
│  • SSL encryption (sslmode=require)                              │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Frontend Request** → HTTP GET/POST to API endpoint
2. **MotorController** → Receives request, calls EngineService
3. **EngineService** →
   - Calls C++ engine via P/Invoke for physics calculations
   - Queries PostgreSQL for historical data
   - Generates industrial machines dynamically
   - Calculates business analytics
4. **C++ Engine** → Computes real physics (speed, temp, vibration, efficiency)
5. **Database** → Stores readings, retrieves historical data
6. **Response** → JSON data returned to frontend
7. **SignalR** → Broadcasts real-time updates to all connected clients

---

## 🚀 Getting Started

### Prerequisites

- **.NET 8.0 SDK** or later ([Download](https://dotnet.microsoft.com/download))
- **C++ Compiler** (g++ for Linux/macOS, MSVC for Windows)
- **PostgreSQL Database** (NeonDB account or local PostgreSQL)
- **Git** for cloning the repository
- **Docker** (optional, for containerized deployment)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/motor-dashboard.git
cd motor-dashboard/motor-speed-backend
```

#### 2. Compile the C++ Physics Engine

**For macOS (Development):**

```bash
cd EngineMock
g++ -shared -fPIC -o motor_engine.dylib motor_engine.cpp -std=c++17
cd ..
```

**For Linux (Production/Render):**

```bash
cd EngineMock
g++ -shared -fPIC -o motor_engine.so motor_engine.cpp -std=c++17
cd ..
```

**For Windows:**

```bash
cd EngineMock
cl /LD motor_engine.cpp /Fe:motor_engine.dll
cd ..
```

#### 3. Set Up Environment Variables

Create a `.env` file in `Server/MotorServer/`:

```bash
cd Server/MotorServer
touch .env
```

Add the following content (see [Environment Variables](#-environment-variables) section for details):

```env
# PostgreSQL Database Connection String (NeonDB)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require&channel_binding=require"

# Frontend URL for CORS (production)
FRONTEND_URL="https://your-frontend.netlify.app"

# Server Port (optional - defaults handled by launchSettings.json or Dockerfile)
PORT=
```

#### 4. Restore NuGet Packages

```bash
dotnet restore
```

#### 5. Run Database Migrations (First time only)

```bash
dotnet ef database update
```

This creates the required tables in your PostgreSQL database.

#### 6. Run the Application

```bash
dotnet run
```

The server will start at `http://localhost:5001`

#### 7. Verify Installation

Open your browser and navigate to:

- **Swagger UI**: `http://localhost:5001/swagger`
- **Health Check**: `http://localhost:5001/health`

You should see:

```json
{ "status": "Healthy", "time": "2025-10-13T..." }
```

---

## 🔐 Environment Variables

### Local Development (`.env` file)

Create `Server/MotorServer/.env`:

```env
# PostgreSQL Database Connection String (NeonDB)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Frontend URL for CORS (production)
FRONTEND_URL="https://your-frontend.netlify.app"

# Server Port (leave empty for localhost - defaults to 5001)
PORT=
```

**Important Notes:**

- ✅ **Wrap values in quotes** for local `.env` files
- ✅ **Keep `.env` file secure** - never commit to Git (already in `.gitignore`)
- ✅ **Get NeonDB credentials** from [neon.tech](https://neon.tech) dashboard

### Production Deployment (Hetzner VPS - Coolify)

Set these environment variables in Coolify dashboard (without quotes):

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

FRONTEND_URL=https://your-frontend.netlify.app
```

**Port Configuration:**

- **Localhost**: Uses `5001` (from `launchSettings.json`)
- **Coolify**: Uses `10000` (from `Dockerfile` ENV)
- **No manual PORT variable needed** - handled automatically!

### How to Get NeonDB Connection String

1. **Sign up** at [neon.tech](https://neon.tech)
2. **Create a new project** (free tier available)
3. **Copy the connection string** from project dashboard
4. **Important**: Use the **pooled connection string** (contains `-pooler`)
5. **Keep `sslmode=require&channel_binding=require`** for security

Example format:

```env
postgresql://neondb_owner:npg_xxxXXXxxx@ep-misty-sunset-xxx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🌐 API Endpoints

### Base URL

- **Local**: `http://localhost:5001/api/motor`
- **Production**: `https://your-backend.duckdns.org/api/motor` or `https://your-backend.onrender.com/api/motor`

### Core Motor Endpoints

#### 📊 Generate Motor Reading

```http
GET /api/motor/sample
```

**Response:**

```json
{
  "id": 1,
  "speed": 2720,
  "temperature": 70,
  "efficiency": 94.5,
  "vibration": 3.91,
  "powerConsumption": 5.46,
  "systemHealth": 94,
  "timestamp": "2025-10-13T21:39:48.956Z",
  "status": "normal",
  "machineId": "MOTOR-001"
}
```

**Use Case**: Generate a new motor reading with real C++ physics calculations

---

#### 📋 Get All Readings

```http
GET /api/motor
```

**Response:**

```json
[
  {
    "id": 2,
    "speed": 2720,
    "temperature": 70,
    "efficiency": 94.5,
    ...
  },
  {
    "id": 1,
    "speed": 2982,
    "temperature": 80,
    "efficiency": 75.3,
    ...
  }
]
```

**Use Case**: Retrieve last 100 motor readings for charts and analysis

---

#### 📈 Dashboard Statistics

```http
GET /api/motor/stats
```

**Response:**

```json
{
  "totalMachines": 17,
  "onlineMachines": 1,
  "totalReadings": 2,
  "averageEfficiency": 84.9,
  "criticalAlerts": 0,
  "maintenanceDue": 1
}
```

**Use Case**: Get aggregated statistics for main dashboard

---

### Industrial Machine Endpoints

#### 🏭 Get All Machines

```http
GET /api/motor/machines
```

**Response:**

```json
[
  {
    "id": "MOTOR-001",
    "name": "Main Drive Motor",
    "type": "Motor",
    "isRunning": true,
    "currentSpeed": 2720.5,
    "efficiency": 94.5,
    "powerConsumption": 5.46,
    "healthScore": 94,
    "location": "Building 1, Floor 1",
    "department": "Production"
  },
  {
    "id": "PUMP-101",
    "name": "Industrial Pump 1",
    "type": "Pump",
    "isRunning": false,
    "efficiency": 91.7,
    ...
  }
]
```

**Use Case**: Monitor entire industrial fleet (17 machines)

---

#### ⚙️ Machine Control

```http
POST /api/motor/machines/{index}/start
POST /api/motor/machines/{index}/stop
POST /api/motor/machines/{index}/speed
```

**Request Body (for speed):**

```json
{
  "speed": 2500
}
```

**Use Case**: Control individual machines (start, stop, adjust speed)

---

### Business Intelligence Endpoints

#### 💼 Business Insights

```http
GET /api/motor/business-insights
```

**Response:**

```json
{
  "executive": {
    "systemHealthScore": 68,
    "totalUptime": 5.9,
    "overallEfficiency": 90.5,
    "criticalIssues": 0
  },
  "financial": {
    "totalEnergyCost24h": 410.42,
    "totalEnergyCost30d": 12312.52,
    "roi": 4.5
  },
  "operational": {
    "oee": 5.0,
    "availability": 5.9,
    "performance": 90.5,
    "quality": 93.0,
    "mtbf": 720.0,
    "mttr": 2.5
  },
  "trends": { ... },
  "comparative": { ... },
  "predictive": { ... }
}
```

**Use Case**: Comprehensive business analytics dashboard

---

#### 🌍 Edge Computing Nodes

```http
GET /api/motor/edge-nodes
```

**Response:**

```json
[
  {
    "id": "EDGE-001",
    "name": "Production Floor Edge Node",
    "cpuUsage": 84.3,
    "memoryUsage": 90.0,
    "networkLatency": 43.0,
    "storageUsed": 70.9,
    "powerConsumption": 2.0,
    "isOnline": true
  }
]
```

**Use Case**: Monitor distributed edge computing infrastructure

---

### Predictive Maintenance Endpoints

#### 🔮 Health Score Analysis

```http
GET /api/motor/predictive/health-score/{machineId}
```

**Response:**

```json
{
  "machineId": "MOTOR-001",
  "healthScore": 89.5,
  "riskLevel": "Low Risk",
  "readingsAnalyzed": 10
}
```

---

#### 🔧 Maintenance Predictions

```http
GET /api/motor/predictive/predictions/{machineId}
```

**Response:**

```json
[
  {
    "component": "Motor Bearings",
    "issue": "Excessive wear detected",
    "severity": "Warning",
    "predictedFailureTime": "2025-11-13T...",
    "confidence": 85.0
  }
]
```

---

### Production & Quality Endpoints

#### 📈 Production Line Analysis

```http
GET /api/motor/production-line/{lineId}/business-insights
```

**Response:**

```json
{
  "lineId": "LINE-001",
  "totalMachines": 17,
  "onlineMachines": 1,
  "overallEfficiency": 94.5,
  "throughput": 5.9,
  "qualityRate": 87.0,
  "bottlenecks": [],
  "recommendations": [...]
}
```

---

#### ✅ Quality Control Metrics

```http
GET /api/motor/quality-control/{machineId}
```

**Response:**

```json
{
  "machineId": "MOTOR-001",
  "qualityScore": 94.2,
  "defectRate": 5.9,
  "totalInspections": 84,
  "passedInspections": 79,
  "commonDefects": [...]
}
```

---

### Data Management Endpoints

#### 🔍 Search Readings

```http
GET /api/motor/search?status=warning&machineId=MOTOR-001&limit=50
```

---

#### 📤 Export Data

```http
GET /api/motor/export?format=csv
GET /api/motor/export?format=json
```

**Response**: Downloads file with motor readings

---

#### 🗑️ Clear All Data

```http
POST /api/motor/clear
```

**Response:**

```json
{
  "message": "Cleared 100 readings from database",
  "clearedCount": 100
}
```

---

## 🔄 Real-time Updates (SignalR)

### SignalR Hub Endpoint

**URL**: `http://localhost:5001/motorHub` (local) or `https://your-backend.duckdns.org/motorHub` (production with DuckDNS) or `https://your-backend.onrender.com/motorHub` (production with Render.com)

### Client Connection (JavaScript/TypeScript)

```typescript
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5001/motorHub")
  .withAutomaticReconnect()
  .build();

// Listen for motor data updates
connection.on("MotorDataUpdate", (reading) => {
  console.log("New reading:", reading);
  // Update UI with new data
});

// Listen for alerts
connection.on("Alert", (alert) => {
  console.log("Alert:", alert);
  // Show notification
});

// Start connection
await connection.start();
console.log("SignalR Connected!");
```

### Server-Side Broadcasting (C#)

```csharp
// In EngineService.cs
await _hub.Clients.All.SendAsync("MotorDataUpdate", reading);
await _hub.Clients.All.SendAsync("Alert", alert);
```

### Available Events

| Event             | Payload        | Description                            |
| ----------------- | -------------- | -------------------------------------- |
| `MotorDataUpdate` | `MotorReading` | New reading generated                  |
| `Alert`           | `Alert`        | Temperature/vibration/efficiency alert |

---

## ⚡ C++ Physics Engine

### Overview

The `motor_engine.cpp` file contains **real industrial motor physics calculations** based on:

- **IEEE 112**: Standard test procedure for electric motors
- **IEC 60034**: Rotating electrical machines standards
- **ISO 10816 / ISO 20816**: Vibration severity standards

### Key Physics Formulas

#### Speed Calculation

```cpp
// Formula: Speed = BaseSpeed + LoadEffect + AmbientEffect + TimeEffect + SeasonalEffect - WearEffect - MaintenanceEffect + RandomVariation
double loadEffect = (operatingLoad - 0.5) * 200.0;
double ambientEffect = (ambientTemp - 30.0) * 1.0;
double timeEffect = sin(timeOfDay * 0.26) * 100.0;
double wearEffect = motor.bearingWear * 50.0;
double newSpeed = baseSpeed + loadEffect + ambientEffect + timeEffect - wearEffect + randomVariation;
newSpeed = clamp(newSpeed, 2000.0, 3000.0);  // Realistic range
```

#### Temperature Calculation

```cpp
// Formula: Temperature = BaseTemp + SpeedHeat + LoadHeat + AmbientHeat + WearHeat + OilHeat / (CoolingEfficiency × ThermalMass)
double speedHeat = (operatingSpeed / 2500.0 - 1.0) * 1.0;
double loadHeat = (operatingLoad - 0.5) * 1.5;
double wearHeat = motor.bearingWear * 2.0;
double newTemp = (baseTemp + speedHeat + loadHeat + wearHeat) / (1.0 + coolingEfficiency * 0.8);
newTemp = clamp(newTemp, 45.0, 95.0);  // Realistic range
```

#### Vibration Calculation (RMS)

```cpp
// Formula: RMS = √(VibrationX² + VibrationY² + VibrationZ²)
double baseAxisVibration = newVibration / sqrt(3.0);
motor.vibrationX = baseAxisVibration * (0.9 + random() * 0.4);
motor.vibrationY = baseAxisVibration * (0.9 + random() * 0.4);
motor.vibrationZ = baseAxisVibration * (0.9 + random() * 0.4);
motor.vibration = sqrt(vibrationX² + vibrationY² + vibrationZ²);
```

#### Efficiency Calculation

```cpp
// Formula: Efficiency = BaseEfficiency + LoadEffect - TempLoss - SpeedLoss - AgeLoss - BearingLoss - OilLoss
double tempEffect = (operatingTemp - 70.0) * tempLoss;
double bearingLoss = motor.bearingWear * 8.0;
double oilLoss = motor.oilDegradation * 4.0;
double newEfficiency = baseEfficiency + loadEffect - tempEffect - bearingLoss - oilLoss;
newEfficiency = clamp(newEfficiency, 70.0, 94.0);  // Realistic range
```

#### System Health Calculation

```cpp
// Formula: Health = (Efficiency × 40%) + (Vibration Health × 25%) + (Temperature Health × 20%) + (Bearing × 10%) + (Oil × 5%)
double efficiencyHealth = motor.efficiency * 0.40;
double vibrationHealth = calculateVibrationHealth() * 0.25;  // Based on ISO 10816
double temperatureHealth = calculateTempHealth() * 0.20;
double bearingHealth = (100.0 - motor.bearingWear * 50.0) * 0.10;
double oilHealth = (100.0 - motor.oilDegradation * 50.0) * 0.05;
motor.systemHealth = efficiencyHealth + vibrationHealth + temperatureHealth + bearingHealth + oilHealth;
```

### P/Invoke Integration

**C# Calling C++ Functions:**

```csharp
// In EngineService.cs
[DllImport("motor_engine.so")]  // Linux
[DllImport("motor_engine.dylib")]  // macOS
[DllImport("motor_engine.dll")]  // Windows
public static extern double GetMotorSpeed();

// Usage
var speed = GetMotorSpeed();  // Calls C++ function directly
```

### 60+ Available C++ Functions

**Basic Motor:**

- `GetMotorSpeed()`, `GetMotorTemperature()`, `GetMotorEfficiency()`, `GetMotorVibration()`, `GetMotorLoad()`

**Vibration Sensors:**

- `GetVibrationX()`, `GetVibrationY()`, `GetVibrationZ()`

**Pressure Sensors:**

- `GetOilPressure()`, `GetAirPressure()`, `GetHydraulicPressure()`

**Electrical:**

- `GetVoltage()`, `GetCurrent()`, `GetPowerFactor()`, `GetPowerConsumption()`

**Mechanical:**

- `GetRPM()`, `GetTorque()`, `GetEfficiency()`

**Environmental:**

- `GetHumidity()`, `GetAmbientTemperature()`, `GetAmbientPressure()`

**Daily Life Applications:**

- `GetHVACEfficiency()`, `GetFuelEfficiency()`, `GetBoatEngineEfficiency()`, `GetWashingMachineEfficiency()`

**Control:**

- `StartMotor()`, `StopMotor()`, `ResetMotorState()`, `ResetPhysicsUpdateFlag()`

See `motor_engine.hpp` for complete API reference.

---

## 💾 Database Schema

### Tables

#### 1. MotorReadings

Stores motor sensor data with 60+ columns:

```sql
CREATE TABLE "MotorReadings" (
    "Id" INTEGER PRIMARY KEY,
    "Speed" INTEGER NOT NULL,
    "Temperature" INTEGER NOT NULL,
    "Timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "MachineId" VARCHAR(50) NOT NULL,
    "Status" VARCHAR(50) NOT NULL,

    -- Vibration (3-axis)
    "VibrationX" DOUBLE PRECISION,
    "VibrationY" DOUBLE PRECISION,
    "VibrationZ" DOUBLE PRECISION,
    "Vibration" DOUBLE PRECISION,

    -- Pressure sensors
    "OilPressure" DOUBLE PRECISION,
    "AirPressure" DOUBLE PRECISION,
    "HydraulicPressure" DOUBLE PRECISION,

    -- Electrical
    "Voltage" DOUBLE PRECISION,
    "Current" DOUBLE PRECISION,
    "PowerFactor" DOUBLE PRECISION,
    "PowerConsumption" DOUBLE PRECISION,

    -- Mechanical
    "RPM" INTEGER,
    "Torque" DOUBLE PRECISION,
    "Efficiency" DOUBLE PRECISION,

    -- Health & Maintenance
    "SystemHealth" INTEGER,
    "MaintenanceStatus" INTEGER,
    "BearingHealth" DOUBLE PRECISION,
    "BearingWear" DOUBLE PRECISION,
    "OilDegradation" DOUBLE PRECISION,

    -- 40+ more sensor fields...
);

CREATE INDEX "IX_MotorReadings_Timestamp" ON "MotorReadings" ("Timestamp");
CREATE INDEX "IX_MotorReadings_MachineId" ON "MotorReadings" ("MachineId");
```

#### 2. Alerts

Stores system alerts and notifications:

```sql
CREATE TABLE "Alerts" (
    "Id" VARCHAR(100) PRIMARY KEY,
    "Type" VARCHAR(50) NOT NULL,
    "Severity" VARCHAR(20) NOT NULL,
    "Message" VARCHAR(500) NOT NULL,
    "Timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "MachineId" VARCHAR(50) NOT NULL,
    "Acknowledged" BOOLEAN NOT NULL
);
```

#### 3. Machines

Stores machine metadata:

```sql
CREATE TABLE "Machines" (
    "Id" VARCHAR(50) PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Type" VARCHAR(50) NOT NULL,
    "Location" VARCHAR(100),
    "Status" VARCHAR(20) NOT NULL,
    "LastSeen" TIMESTAMP WITH TIME ZONE NOT NULL,
    "TotalReadings" INTEGER,
    "AverageEfficiency" DOUBLE PRECISION
);
```

### Entity Framework Models

**MotorReading Model:**

```csharp
public class MotorReading
{
    public int Id { get; set; }
    public int Speed { get; set; }              // RPM
    public int Temperature { get; set; }        // °C
    public DateTime Timestamp { get; set; }
    public string MachineId { get; set; } = "MOTOR-001";
    public string Status { get; set; } = "normal";

    // Vibration sensors
    public double? VibrationX { get; set; }
    public double? VibrationY { get; set; }
    public double? VibrationZ { get; set; }
    public double? Vibration { get; set; }

    // 50+ more properties...
}
```

### Running Migrations

**Create a new migration:**

```bash
dotnet ef migrations add YourMigrationName
```

**Apply migrations:**

```bash
dotnet ef database update
```

**Remove last migration:**

```bash
dotnet ef migrations remove
```

---

## 📊 Business Intelligence Analytics

### Executive Summary

Calculated from all 17 machines:

```csharp
// System Health Score (0-100)
healthScore = (avgEfficiency × 0.4) +
              ((onlineMachines / totalMachines × 100) × 0.3) +
              ((100 - criticalIssues × 10) × 0.3)

// Example: (90.5 × 0.4) + (5.9 × 0.3) + (100 × 0.3) = 68
```

### Financial Metrics

Energy cost projections:

```csharp
// 24-hour cost
cost24h = totalPowerConsumption × 24 × $0.12/kWh

// 30-day cost
cost30d = totalPowerConsumption × 720 × $0.12/kWh

// Potential savings
savings = cost30d × ((targetEfficiency - currentEfficiency) / 100)
```

### Operational KPIs

Overall Equipment Effectiveness:

```csharp
// OEE Formula (Industry Standard)
OEE = (Availability × Performance × Quality) / 10000

// Components:
Availability = (onlineMachines / totalMachines) × 100
Performance = Average(machine.Efficiency)
Quality = Average(machine.HealthScore)
```

### Predictive Insights

Maintenance forecasting:

```csharp
// Predicted maintenance date
predictedDate = DateTime.UtcNow.AddDays(7 + (healthScore / 10))

// Confidence level
confidence = healthScore < 70 ? 95% : 75%

// Estimated cost
cost = maintenanceStatus == 2 ? $1500 : $500  // Critical vs Preventive
```

---

## 🐳 Deployment

### Docker Deployment (Hetzner VPS - Coolify)

The `Server/Dockerfile` handles:

1. **Multi-stage build** (SDK for build, Runtime for deployment)
2. **C++ compilation** (compiles `motor_engine.so` for Linux)
3. **.NET build & publish**
4. **Port configuration** (10000 for Coolify)
5. **Non-root user** security

**Build Docker image:**

```bash
docker build -f Server/Dockerfile -t motor-backend .
```

**Run locally with Docker:**

```bash
docker run -p 10000:10000 \
  -e DATABASE_URL="postgresql://..." \
  -e FRONTEND_URL="http://localhost:5173" \
  motor-backend
```

### Hetzner VPS - Coolify Deployment

1. **Set up Hetzner VPS** and install Coolify
2. **Connect GitHub repository** to Coolify
3. **Select Docker deployment**
4. **Set build command**: (automatic from Dockerfile)
5. **Set environment variables**:

   ```env
   DATABASE_URL=postgresql://neondb_owner:password@host/db?sslmode=require&channel_binding=require
   FRONTEND_URL=https://your-frontend.netlify.app
   ```

6. **Configure Container Labels** for HTTPS routing (Traefik/Caddy) - if using Coolify
7. **Deploy** - Coolify/Render automatically builds and deploys

**Service URL**: `https://your-backend.duckdns.org` (Coolify) or `https://your-backend.onrender.com` (Render.com)

### Health Checks

Docker includes automatic health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

---

## 💻 Code Examples

### Example 1: Generate and Save a Motor Reading

```csharp
// In EngineService.cs
public async Task<MotorReading> Sample()
{
    // Reset physics flag for new calculation
    ResetPhysicsUpdateFlag();

    // Get real physics from C++
    var speed = (int)GetMotorSpeed();
    var temperature = (int)GetMotorTemperature();
    var efficiency = GetMotorEfficiency();
    var vibrationX = GetVibrationX();
    var vibrationY = GetVibrationY();
    var vibrationZ = GetVibrationZ();
    var vibration = Math.Sqrt(vibrationX*vibrationX + vibrationY*vibrationY + vibrationZ*vibrationZ);

    // Create reading object
    var reading = new MotorReading
    {
        Speed = speed,
        Temperature = temperature,
        Efficiency = Math.Round(efficiency, 1),
        Vibration = Math.Round(vibration, 2),
        VibrationX = Math.Round(vibrationX, 2),
        VibrationY = Math.Round(vibrationY, 2),
        VibrationZ = Math.Round(vibrationZ, 2),
        Timestamp = DateTime.UtcNow,
        MachineId = "MOTOR-001",
        Status = DetermineStatus(speed, temperature, vibration, efficiency)
    };

    // Save to database
    _db.MotorReadings.Add(reading);
    await _db.SaveChangesAsync();

    // Send real-time update
    await _hub.Clients.All.SendAsync("MotorDataUpdate", reading);

    return reading;
}
```

### Example 2: Generate 17 Industrial Machines

```csharp
public async Task<List<IndustrialMachine>> GetIndustrialMachinesAsync()
{
    var machines = new List<IndustrialMachine>();

    // Get base data from latest database reading
    var latestReading = await _db.MotorReadings
        .Where(r => r.MachineId == "MOTOR-001")
        .OrderByDescending(r => r.Timestamp)
        .FirstOrDefaultAsync();

    double baseEfficiency = latestReading?.Efficiency ?? 92.0;
    double basePower = latestReading?.PowerConsumption ?? 4.5;

    // Check working hours
    var now = DateTime.Now;
    bool isWorkingHours = (now.DayOfWeek >= DayOfWeek.Monday && now.DayOfWeek <= DayOfWeek.Friday)
                       && (now.Hour >= 8 && now.Hour < 18);

    // Generate main motor (always online)
    machines.Add(new IndustrialMachine
    {
        Id = "MOTOR-001",
        Name = "Main Drive Motor",
        IsRunning = true,  // 24/7 operation
        Efficiency = baseEfficiency,
        PowerConsumption = basePower,
        // ... other properties
    });

    // Generate pumps (online during working hours)
    for (int i = 1; i <= 3; i++)
    {
        machines.Add(new IndustrialMachine
        {
            Id = $"PUMP-{100 + i}",
            Name = $"Industrial Pump {i}",
            IsRunning = isWorkingHours,
            Efficiency = Math.Min(95, baseEfficiency * (0.95 + i * 0.02)),
            PowerConsumption = basePower * (0.5 + i * 0.1),
            // ... other properties
        });
    }

    // ... generate 13 more machines

    return machines;
}
```

### Example 3: Calculate Business Insights

```csharp
public async Task<BusinessInsights> GetBusinessInsightsAsync()
{
    // Get all machines (17 total)
    var machines = await GetIndustrialMachinesAsync();

    // Get recent readings from database
    var recentReadings = await _db.MotorReadings
        .Where(r => r.Timestamp >= DateTime.UtcNow.AddDays(-30))
        .ToListAsync();

    // Calculate Executive Summary
    var executive = new ExecutiveSummary
    {
        SystemHealthScore = CalculateSystemHealth(machines),
        TotalUptime = (double)machines.Count(m => m.IsRunning) / machines.Count * 100,
        OverallEfficiency = machines.Average(m => m.Efficiency),
        CriticalIssues = machines.Count(m => m.HealthScore < 70)
    };

    // Calculate Financial Metrics
    var financial = new FinancialMetrics
    {
        TotalEnergyCost24h = machines.Sum(m => m.PowerConsumption) * 24 * 0.12,
        TotalEnergyCost30d = machines.Sum(m => m.PowerConsumption) * 720 * 0.12,
        ROI = CalculateROI(machines, recentReadings)
    };

    // Calculate Operational KPIs
    var operational = new OperationalKPIs
    {
        OEE = CalculateOEE(machines),
        Availability = (double)machines.Count(m => m.IsRunning) / machines.Count * 100,
        Performance = machines.Average(m => m.Efficiency),
        Quality = machines.Average(m => m.HealthScore)
    };

    return new BusinessInsights
    {
        Executive = executive,
        Financial = financial,
        Operational = operational,
        // ... other sections
    };
}
```

### Example 4: Configure Database Context

```csharp
// In Program.cs
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (string.IsNullOrEmpty(databaseUrl))
{
    throw new InvalidOperationException("DATABASE_URL is required");
}

// Parse PostgreSQL URI manually
var uri = new Uri(databaseUrl);
var username = uri.UserInfo.Split(':')[0];
var password = uri.UserInfo.Split(':')[1];
var host = uri.Host;
var port = uri.Port;
var database = uri.AbsolutePath.TrimStart('/');

// Build connection string
var builder = new NpgsqlConnectionStringBuilder
{
    Host = host,
    Port = port,
    Username = username,
    Password = password,
    Database = database,
    SslMode = SslMode.Require,
    Pooling = true,
    MinPoolSize = 1,
    MaxPoolSize = 20
};

// Configure DbContext
services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.ConnectionString, npgsqlOpt =>
    {
        npgsqlOpt.EnableRetryOnFailure(maxRetryCount: 5);
        npgsqlOpt.CommandTimeout(30);
    }));
```

### Example 5: CORS Configuration

```csharp
// In Program.cs
var allowedOrigins = new[] {
    "http://localhost:5173",
    "https://your-frontend.netlify.app",
    Environment.GetEnvironmentVariable("FRONTEND_URL") ?? ""
};

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials()));  // Required for SignalR

app.UseCors();  // Must be before UseAuthorization
```

---

## 🧪 Testing

### Run Unit Tests

```bash
cd Tests
dotnet test
```

### Test C++ Engine

```bash
cd EngineMock
g++ -o test_motor test_motor.cpp motor_engine.cpp -std=c++17
./test_motor
```

Expected output:

```bash
Real Industrial Motor Physics Engine Test:
Speed: 2720.5 RPM (Range: 0-4000)
Temperature: 70.2 °C (Range: 0-100)
Efficiency: 94.5%
Power: 5.46 kW
Vibration: 3.91 mm/s
```

### Integration Testing

**Test API endpoints:**

```bash
# Health check
curl http://localhost:5001/health

# Get sample reading
curl http://localhost:5001/api/motor/sample

# Get all machines
curl http://localhost:5001/api/motor/machines

# Get business insights
curl http://localhost:5001/api/motor/business-insights
```

### Load Testing

Use tools like **Apache Bench** or **k6**:

```bash
# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:5001/api/motor/sample
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Database Connection Failed**

**Error:**

```bash
Couldn't set postgresql://...
```

**Solution:**

- Verify `DATABASE_URL` is set correctly
- Check NeonDB connection string is complete (includes `?sslmode=require`)
- Ensure password matches exactly (case-sensitive!)
- Test connection: `psql "postgresql://..."`

---

#### 2. **C++ Library Not Found**

**Error:**

```bash
DllNotFoundException: Unable to load 'motor_engine.so'
```

**Solution:**

- Ensure C++ library is compiled for your platform
- macOS: `motor_engine.dylib`
- Linux: `motor_engine.so`
- Windows: `motor_engine.dll`
- Check library is in output directory: `bin/Debug/net8.0/`

---

#### 3. **Port Already in Use**

**Error:**

```bash
Failed to bind to address http://127.0.0.1:5001: address already in use
```

**Solution:**

```bash
# Find process using port 5001
lsof -ti:5001

# Kill the process
lsof -ti:5001 | xargs kill -9

# Or use different port in launchSettings.json
```

---

#### 4. **CORS Policy Error**

**Error:**

```bash
Access to fetch has been blocked by CORS policy
```

**Solution:**

- Add your frontend URL to `allowedOrigins` in `Program.cs`
- Ensure `UseCors()` is called before `UseAuthorization()`
- Check frontend is using correct backend URL

---

#### 5. **SignalR Connection Failed**

**Error:**

```bash
WebSocket connection failed
```

**Solution:**

- Ensure SignalR hub is mapped: `app.MapHub<MotorHub>("/motorHub")`
- Check CORS allows credentials: `.AllowCredentials()`
- Verify frontend SignalR URL matches backend

---

## 🔄 Reusing Components in Other Projects

### 1. Reuse C++ Physics Engine

**Copy these files:**

```bash
EngineMock/motor_engine.cpp
EngineMock/motor_engine.hpp
```

**Compile for your platform:**

```bash
g++ -shared -fPIC -o motor_engine.so motor_engine.cpp -std=c++17
```

**Integrate with C#:**

```csharp
[DllImport("motor_engine.so")]
public static extern double GetMotorSpeed();

var speed = GetMotorSpeed();
```

**Customize Physics:**

- Modify constants in `motor_engine.cpp` (BASE_SPEED, BASE_TEMPERATURE)
- Add new sensors by adding functions
- Adjust physics formulas to match your equipment

---

### 2. Reuse SignalR Real-time Updates

**Copy these files:**

```bash
Hubs/MotorHub.cs
```

**Configure in Program.cs:**

```csharp
builder.Services.AddSignalR();
app.MapHub<YourHub>("/yourHub");
```

**Broadcast updates:**

```csharp
public class YourService
{
    private readonly IHubContext<YourHub> _hub;

    public async Task SendUpdate(object data)
    {
        await _hub.Clients.All.SendAsync("DataUpdate", data);
    }
}
```

---

### 3. Reuse Business Analytics

**Copy these files:**

```bash
Services/EngineService.cs (methods: GetBusinessInsightsAsync, CalculateOEE, etc.)
Models/MotorModels.cs (classes: BusinessInsights, OperationalKPIs, etc.)
```

**Adapt to your data:**

```csharp
public async Task<BusinessInsights> GetYourInsights()
{
    var machines = await GetYourMachines();
    var readings = await GetYourReadings();

    var oee = (availability * performance * quality) / 10000;
    var roi = (savings / totalCost) * 100;

    return new BusinessInsights { ... };
}
```

---

### 4. Reuse Database Context

**Copy these files:**

```bash
Data/AppDbContext.cs
Models/MotorModels.cs
```

**Customize models:**

```csharp
public class YourReading
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public double Value { get; set; }
}

public class YourDbContext : DbContext
{
    public DbSet<YourReading> Readings { get; set; }
}
```

**Configure PostgreSQL:**

```csharp
services.AddDbContext<YourDbContext>(opt =>
    opt.UseNpgsql(connectionString));
```

---

### 5. Reuse API Controller Pattern

**Copy controller structure:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class YourController : ControllerBase
{
    private readonly YourService _service;
    private readonly YourDbContext _db;

    [HttpGet("endpoint")]
    public async Task<ActionResult<YourModel>> GetData()
    {
        try
        {
            var data = await _service.GetData();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
```

---

## 🎯 Key Concepts & Keywords

### Industrial Monitoring

- **OEE (Overall Equipment Effectiveness)**: Availability × Performance × Quality
- **MTBF (Mean Time Between Failures)**: Operating hours / failure count
- **MTTR (Mean Time To Repair)**: Average repair time
- **Uptime**: Percentage of time machines are operational
- **Availability**: Equipment readiness for production

### Physics & Engineering

- **RMS Vibration**: Root Mean Square = √(X² + Y² + Z²)
- **Power Consumption**: P = V × I × PF (Voltage × Current × Power Factor)
- **Efficiency**: (Useful Output Power / Total Input Power) × 100%
- **Torque**: Rotational force (Nm)
- **Angular Velocity**: ω = 2π × RPM ÷ 60 (rad/s)

### IoT & Edge Computing

- **Edge Node**: Local processing unit near data source
- **Latency**: Network response time (ms)
- **Bandwidth**: Data transmission capacity (Mbps)
- **Local Processing**: Computation at edge vs cloud
- **Data Reduction**: Compression and filtering at edge

### Business Analytics

- **ROI (Return on Investment)**: (Savings / Cost) × 100%
- **Energy Cost**: Power (kW) × Hours × Rate ($/kWh)
- **Capacity Planning**: Resource allocation and scaling
- **Predictive Maintenance**: AI-based failure prediction
- **KPI (Key Performance Indicator)**: Measurable business metric

### Database & Backend

- **Entity Framework Core**: ORM (Object-Relational Mapping)
- **Migrations**: Database schema versioning
- **Connection Pooling**: Reuse database connections (1-20 pool)
- **P/Invoke**: Platform Invoke for C++ interop
- **SignalR Hub**: Real-time communication server

---

## 📚 Technical Deep Dive

### How Motor Reading Generation Works

**Step-by-step process:**

1. **Frontend clicks "Generate Reading"** → POST to `/api/motor/sample`

2. **MotorController receives request**:

   ```csharp
   [HttpPost("generate")]
   public async Task<MotorReading> GenerateReading()
   {
       return await _engineService.Sample();
   }
   ```

3. **EngineService.Sample() executes**:

   ```csharp
   // Reset physics flag (ensures fresh calculation)
   ResetPhysicsUpdateFlag();

   // Call C++ engine for each sensor
   var speed = GetMotorSpeed();          // C++ calculates speed
   var temp = GetMotorTemperature();     // C++ calculates temperature
   var vibX = GetVibrationX();           // C++ calculates X-axis
   var vibY = GetVibrationY();           // C++ calculates Y-axis
   var vibZ = GetVibrationZ();           // C++ calculates Z-axis
   ```

4. **C++ Engine (motor_engine.cpp) calculates**:

   ```cpp
   // UpdateMotorPhysics() runs once per reading
   CalculateLoad();           // Determines operating load
   CalculateSpeed();          // Physics-based speed calculation
   CalculateTemperature();    // Thermal dynamics
   CalculateEfficiency();     // Energy conversion efficiency
   CalculateVibration();      // Mechanical vibration analysis
   CalculateBearingWear();    // Bearing degradation over time
   CalculateOilDegradation(); // Lubrication quality
   ```

5. **C# computes derived values**:

   ```csharp
   var vibration = Math.Sqrt(vibX*vibX + vibY*vibY + vibZ*vibZ);  // RMS
   var status = DetermineStatus(speed, temp, vibration, efficiency);
   ```

6. **Save to PostgreSQL database**:

   ```csharp
   _db.MotorReadings.Add(reading);
   await _db.SaveChangesAsync();
   ```

7. **Broadcast via SignalR**:

   ```csharp
   await _hub.Clients.All.SendAsync("MotorDataUpdate", reading);
   ```

8. **Return to frontend** → Display on dashboard

**Total time**: ~150ms (C++ calc: 1ms, DB save: 120ms, SignalR: 10ms, Network: 20ms)

---

### How Industrial Machines Are Generated

**Dynamic Generation Process:**

```csharp
// 1. Get base data from LATEST database reading (consistency)
var latestReading = await _db.MotorReadings
    .Where(r => r.MachineId == "MOTOR-001")
    .OrderByDescending(r => r.Timestamp)
    .FirstOrDefaultAsync();

double baseEfficiency = latestReading?.Efficiency ?? 92.0;  // Example: 94.5%

// 2. Check current time for working hours
bool isWorkingHours = (DateTime.Now.Hour >= 8 && DateTime.Now.Hour < 18);

// 3. Generate 17 machines with variations
// MOTOR-001: Uses exact database values
machines.Add(new IndustrialMachine {
    Id = "MOTOR-001",
    Efficiency = baseEfficiency,  // 94.5%
    IsRunning = true  // Always online
});

// PUMP-101: Variation of base data
machines.Add(new IndustrialMachine {
    Id = "PUMP-101",
    Efficiency = baseEfficiency * 0.97,  // 94.5 × 0.97 = 91.7%
    IsRunning = isWorkingHours  // Online 8AM-6PM only
});

// CRUSHER-101: Heavy duty equipment (lower efficiency)
machines.Add(new IndustrialMachine {
    Id = "CRUSH-101",
    Efficiency = baseEfficiency * 0.82,  // 94.5 × 0.82 = 77.5%
    MaintenanceStatus = 1  // Needs maintenance
});

// ... 14 more machines
```

**Why This Approach?**

- ✅ **Consistency**: All machines based on same real reading
- ✅ **Realism**: Different machine types have different efficiency profiles
- ✅ **Scalability**: Easy to add more machines
- ✅ **Business Logic**: Working hours affect online/offline status

---

### How Business Insights Are Calculated

**Multi-source data aggregation:**

```csharp
public async Task<BusinessInsights> GetBusinessInsightsAsync()
{
    // Data Source 1: 17 dynamically generated machines
    var machines = await GetIndustrialMachinesAsync();
    // Returns: MOTOR-001, PUMP-101, PUMP-102, PUMP-103, CONV-101, etc.

    // Data Source 2: Historical database readings (last 30 days)
    var readings = await _db.MotorReadings
        .Where(r => r.Timestamp >= DateTime.UtcNow.AddDays(-30))
        .ToListAsync();
    // Returns: All MOTOR-001 readings from database

    // Calculate Executive Summary (uses MACHINES)
    var avgEfficiency = machines.Average(m => m.Efficiency);  // 90.5%
    var uptime = machines.Count(m => m.IsRunning) / (double)machines.Count * 100;  // 5.9%

    // Calculate Financial (uses MACHINES for projections)
    var totalPower = machines.Sum(m => m.PowerConsumption);  // 142.51 kW
    var cost30d = totalPower * 720 * 0.12;  // $12,312.52

    // Calculate Trends (uses DATABASE READINGS)
    var efficiencyTrend = readings
        .GroupBy(r => r.Timestamp.Date)
        .Select(g => new { Date = g.Key, AvgEff = g.Average(r => r.Efficiency) });

    // Calculate Predictive (uses DATABASE READINGS)
    var maintenanceEvents = readings.Count(r => r.MaintenanceStatus > 0);
    var forecastedCost = maintenanceEvents * 500 * 1.1;  // 10% increase

    return new BusinessInsights { ... };
}
```

**Key Understanding:**

- **Machines (17)**: Current fleet status, capacity planning
- **Readings (Database)**: Historical trends, maintenance history
- **Combined**: Comprehensive business intelligence

---

## 🔑 Configuration Options

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "MotorServer": "Debug"
    }
  },
  "SignalR": {
    "EnableDetailedErrors": true,
    "KeepAliveInterval": 15,
    "ClientTimeoutInterval": 30,
    "HandshakeTimeout": 15
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-frontend.netlify.app"
    ]
  }
}
```

### launchSettings.json (Development)

```json
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "applicationUrl": "http://localhost:5001",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

---

## 🚢 Production Deployment Checklist

### Pre-deployment

- [ ] Compile C++ engine for Linux: `motor_engine.so`
- [ ] Set up NeonDB PostgreSQL database
- [ ] Configure environment variables in Coolify
- [ ] Test locally with production database
- [ ] Review CORS settings
- [ ] Check SignalR configuration

### Deployment

- [ ] Push code to GitHub
- [ ] Coolify auto-deploys from main branch
- [ ] Verify Docker build completes
- [ ] Check database migrations run successfully
- [ ] Test health endpoint: `/health`
- [ ] Verify API endpoints work
- [ ] Test SignalR connection from frontend

### Post-deployment

- [ ] Monitor logs for errors
- [ ] Check database connection pooling
- [ ] Verify C++ engine loads correctly
- [ ] Test real-time updates
- [ ] Monitor response times
- [ ] Check SSL/TLS certificates

---

## 📖 Learning Resources

### Understanding the Codebase

**Start here:**

1. `Program.cs` - Application startup and configuration
2. `MotorController.cs` - API endpoints and routing
3. `EngineService.cs` - Business logic and C++ integration
4. `motor_engine.cpp` - Physics calculations
5. `AppDbContext.cs` - Database schema

**Key Learning Paths:**

#### Path 1: API Development

- Study `MotorController.cs` for RESTful API patterns
- Learn async/await patterns with Entity Framework
- Understand error handling and status codes
- Practice with Swagger UI for testing

#### Path 2: C++ Interop

- Examine P/Invoke declarations in `EngineService.cs`
- Study `motor_engine.hpp` for C API design
- Learn cross-platform library compilation
- Understand memory management between C++ and C#

#### Path 3: Real-time Communication

- Study `MotorHub.cs` for SignalR implementation
- Learn WebSocket connection management
- Understand broadcast patterns
- Practice with SignalR client libraries

#### Path 4: Business Logic

- Analyze `GetBusinessInsightsAsync()` method
- Learn OEE, MTBF, ROI calculations
- Understand industrial analytics formulas
- Practice with real-world data

---

## 🎓 Educational Use Cases

### For Students

**Learn about:**

- Industrial motor physics and engineering
- Real-time web applications with SignalR
- C++ and C# interoperability
- Database design and ORM patterns
- RESTful API development
- Docker containerization
- Cloud deployment strategies

**Projects you can build:**

- Home automation monitoring system
- Vehicle performance tracker
- Fitness equipment monitor
- Solar panel efficiency tracker
- HVAC system controller
- IoT sensor dashboard

### For Developers

**Reusable patterns:**

- Multi-language integration (C++ ↔ C#)
- Real-time data streaming architecture
- Business intelligence calculations
- Time-series data management
- Dynamic entity generation
- Comprehensive API design

---

## 🔬 Advanced Topics

### Connection Pooling Configuration

```csharp
var npgsqlBuilder = new NpgsqlConnectionStringBuilder
{
    // Connection pooling (improves performance)
    Pooling = true,
    MinPoolSize = 1,        // Keep 1 connection alive
    MaxPoolSize = 20,       // Allow up to 20 concurrent connections
    ConnectionLifetime = 300, // Recycle connections after 5 minutes

    // Timeouts
    Timeout = 30,           // Connection timeout (seconds)
    CommandTimeout = 30,    // Query timeout (seconds)

    // Reliability
    // (Handled by EF Core retry logic below)
};

// Entity Framework retry configuration
services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(connectionString, npgsqlOpt =>
    {
        npgsqlOpt.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null
        );
    }));
```

### Custom JSON Serialization

```csharp
services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convert enums to strings
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

        // Use camelCase for property names
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

        // Ignore null values
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;

        // UTC datetime conversion
        options.JsonSerializerOptions.Converters.Add(new DateTimeUtcConverter());
    });
```

### Platform-Specific C++ Library Loading

```csharp
// Automatic platform detection
private const string LIB_NAME =
#if WINDOWS
    "motor_engine.dll";
#elif OSX
    "motor_engine.dylib";
#else
    "motor_engine.so";  // Linux
#endif

[DllImport(LIB_NAME)]
public static extern double GetMotorSpeed();
```

### Working Hours Business Logic

```csharp
// Realistic working hours check
var now = DateTime.Now;
int hour = now.Hour;
int dayOfWeek = (int)now.DayOfWeek;

bool isWorkingHours = (dayOfWeek >= 1 && dayOfWeek <= 5)  // Monday-Friday
                   && (hour >= 8 && hour < 18);             // 8AM-6PM

// Apply to machines
foreach (var machine in machines)
{
    if (machine.Id == "MOTOR-001")
    {
        machine.IsRunning = true;  // Critical equipment runs 24/7
    }
    else if (machine.Type == "Generator")
    {
        machine.IsRunning = false;  // Backup generators on standby
    }
    else
    {
        machine.IsRunning = isWorkingHours;  // Other machines follow schedule
    }
}
```

---

## 🎨 Best Practices Implemented

### Code Organization

✅ **Separation of Concerns**: Controllers, Services, Models, Data layers  
✅ **Single Responsibility**: Each class has one clear purpose  
✅ **DRY Principle**: Reusable helper methods  
✅ **Async/Await**: Non-blocking operations throughout

### Database Operations

✅ **Migrations**: Version-controlled schema changes  
✅ **Indexing**: Optimized queries on Timestamp and MachineId  
✅ **Connection Pooling**: Efficient resource utilization  
✅ **Retry Logic**: Automatic recovery from transient failures

### Security

✅ **CORS**: Restricted to specific origins  
✅ **SSL/TLS**: Required for database connections  
✅ **Non-root User**: Docker container runs as `appuser`  
✅ **Environment Variables**: Sensitive data not in code

### Performance

✅ **Query Optimization**: `Take()`, `Where()`, indexed fields  
✅ **Lazy Loading**: Load data only when needed  
✅ **SignalR Compression**: Efficient real-time updates  
✅ **Compiled C++**: High-performance physics calculations

### Monitoring

✅ **Health Checks**: Docker healthcheck and `/health` endpoint  
✅ **Logging**: Console logging for debugging  
✅ **Error Handling**: Try-catch with detailed error messages  
✅ **Status Codes**: Proper HTTP status codes (200, 404, 500)

---

## 🔄 Extending the Project

### Add a New Sensor

**1. Add C++ function** (`motor_engine.cpp`):

```cpp
extern "C" double GetYourNewSensor() {
    UpdateMotorPhysics();
    return motor.yourNewValue;
}
```

**2. Add C# P/Invoke** (`EngineService.cs`):

```csharp
[DllImport(LIB_NAME)]
public static extern double GetYourNewSensor();
```

**3. Add to MotorReading model** (`MotorModels.cs`):

```csharp
public class MotorReading
{
    // ... existing properties
    public double? YourNewSensor { get; set; }
}
```

**4. Create migration**:

```bash
dotnet ef migrations add AddYourNewSensor
dotnet ef database update
```

**5. Use in Sample()** (`EngineService.cs`):

```csharp
var yourValue = GetYourNewSensor();
reading.YourNewSensor = Math.Round(yourValue, 2);
```

---

### Add a New Machine Type

**In `GetIndustrialMachinesAsync()`:**

```csharp
// Add robot machine type
machines.Add(new IndustrialMachine
{
    Id = "ROBOT-101",
    Name = "Robotic Arm 1",
    Type = "Robot",
    IsRunning = isWorkingHours,
    Efficiency = baseEfficiency * 0.88,  // Robots have different efficiency
    PowerConsumption = basePower * 2.5,  // Higher power draw
    Location = "Building 3, Assembly Line",
    Department = "Production"
});
```

---

### Add a New API Endpoint

**In `MotorController.cs`:**

```csharp
[HttpGet("your-endpoint/{param}")]
public async Task<ActionResult<YourModel>> GetYourData(string param)
{
    try
    {
        var data = await _engineService.YourMethod(param);
        return Ok(data);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        return StatusCode(500, new { error = ex.Message });
    }
}
```

**In `EngineService.cs`:**

```csharp
public async Task<YourModel> YourMethod(string param)
{
    var readings = await _db.MotorReadings
        .Where(r => r.MachineId == param)
        .ToListAsync();

    var result = new YourModel
    {
        // Your calculations
    };

    return result;
}
```

---

## 📊 Performance Benchmarks

### API Response Times (Localhost)

| Endpoint                       | Average | 95th Percentile |
| ------------------------------ | ------- | --------------- |
| `/health`                      | 1ms     | 2ms             |
| `/api/motor/sample`            | 150ms   | 200ms           |
| `/api/motor`                   | 120ms   | 180ms           |
| `/api/motor/machines`          | 5ms     | 10ms            |
| `/api/motor/business-insights` | 250ms   | 350ms           |
| `/api/motor/edge-nodes`        | 8ms     | 15ms            |

### Database Query Performance

| Operation        | Time  | Notes                 |
| ---------------- | ----- | --------------------- |
| Insert Reading   | 120ms | PostgreSQL with SSL   |
| Query Last 100   | 125ms | With ordering         |
| Count Readings   | 50ms  | Indexed query         |
| Complex BI Query | 200ms | Multiple aggregations |

### C++ Engine Performance

| Calculation   | Time    | Calls per Reading |
| ------------- | ------- | ----------------- |
| Single Sensor | <0.01ms | 60+ sensors       |
| Full Update   | 0.8ms   | 1 per reading     |
| RMS Vibration | <0.01ms | 1 calculation     |

**Total reading generation**: ~150ms (mostly database I/O)

---

## 🎯 Use Cases

### 1. Industrial Motor Monitoring

Monitor production floor motors in real-time, track efficiency, predict failures, optimize energy consumption.

### 2. Predictive Maintenance

Use ML models to predict bearing failures, oil degradation, and schedule maintenance before breakdowns.

### 3. Energy Management

Track power consumption across 17 machines, calculate costs, identify savings opportunities.

### 4. Quality Control

Monitor production quality through machine health scores, detect defects early, reduce waste.

### 5. Fleet Management

Oversee entire industrial facility, compare department performance, optimize resource allocation.

### 6. Edge Computing Simulation

Test edge computing architectures, optimize local vs cloud processing, reduce bandwidth costs.

### 7. IoT Platform Development

Build IoT applications with real-time data, cloud integration, distributed processing.

### 8. Educational Tool

Learn industrial engineering, physics simulations, full-stack development, cloud deployment.

---

## 🛡️ Security Considerations

### Implemented Security Measures

✅ **SSL/TLS Encryption**: All database connections encrypted  
✅ **CORS Policy**: Restricted to specific origins  
✅ **Environment Variables**: Credentials not in code  
✅ **Non-root Container**: Docker runs as unprivileged user  
✅ **Input Validation**: API parameter validation  
✅ **Error Handling**: No sensitive data in error messages

### Recommended Additions

For production use, consider:

- **Authentication**: JWT tokens or OAuth
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent API abuse
- **API Keys**: Secure endpoint access
- **Audit Logging**: Track data access
- **Secrets Management**: Azure Key Vault or AWS Secrets Manager

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Contribution Ideas

- 🔧 Add more machine types (robots, AGVs, etc.)
- 📊 Implement additional business analytics
- 🧪 Add unit tests for new features
- 📚 Improve documentation
- 🐛 Fix bugs and optimize performance
- 🌍 Add internationalization (i18n)

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Make your changes**
4. **Test thoroughly**: `dotnet test`
5. **Commit**: `git commit -m 'Add AmazingFeature'`
6. **Push**: `git push origin feature/AmazingFeature`
7. **Open a Pull Request**

### Code Standards

- Follow C# naming conventions (PascalCase for public, camelCase for private)
- Add XML documentation comments to public methods
- Include unit tests for new features
- Update README for significant changes
- Keep commits atomic and well-described

---

## 📄 License

This project is open-source and available for educational and commercial use.

---

## 🙏 Acknowledgments

### Technologies & Standards

- **ASP.NET Core Team** - Excellent web framework
- **PostgreSQL & NeonDB** - Reliable cloud database
- **IEEE & IEC** - Industrial motor standards
- **SignalR Team** - Real-time communication library

### Inspiration

This project demonstrates real-world industrial IoT monitoring with:

- Authentic physics calculations
- Production-ready architecture
- Comprehensive business analytics
- Educational value for learning

---

## 📞 Support & Contact

### Get Help

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/yourusername/motor-dashboard/issues)
- 💬 **Ask Questions**: [GitHub Discussions](https://github.com/yourusername/motor-dashboard/discussions)
- 📧 **Email**: <your-email@example.com>
- 🌐 **Portfolio**: [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/)

### Useful Links

- **Live Demo (Frontend)**: <https://motor-speed-temperature.netlify.app>
- **Live API**: <https://your-backend.duckdns.org> or <https://your-backend.onrender.com>
- **Swagger Docs**: <https://your-backend.duckdns.org/swagger> or <https://your-backend.onrender.com/swagger>
- **NeonDB**: <https://neon.tech>
- **Coolify**: <https://coolify.io>

---

## 🎉 Happy Coding

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
