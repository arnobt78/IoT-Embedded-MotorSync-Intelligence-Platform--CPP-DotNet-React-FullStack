# IoT Embedded Motor Sync Intelligence - Real-time Industrial IoT Dashboard, Motor Physics Engine, Business Intelligence Platform for Industrial IoT (C++, .NET, PostgreSQL, SignalR, Docker, React, TypeScript, Vite, TailwindCSS, Shadcn UI, Recharts)

**A production-ready full-stack industrial monitoring system combining C++ physics engine, .NET backend, React frontend, and PostgreSQL database for real-time motor analytics and business intelligence.**

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?logo=postgresql)](https://neon.tech/)
[![C++](https://img.shields.io/badge/C++-17-00599C?logo=cplusplus)](https://isocpp.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 🌟 Live Demo

- **Frontend-Live:** [https://motor-speed-temperature.netlify.app/](https://motor-speed-temperature.netlify.app/)
- **Backend-Live:** [https://embedded-motor-engine-speed-temperature.onrender.com/](https://embedded-motor-engine-speed-temperature.onrender.com/)
- **API Documentation**: [https://embedded-motor-engine-speed-temperature.onrender.com/swagger](https://embedded-motor-engine-speed-temperature.onrender.com/swagger)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🌟 Overview

**MotorSync Intelligence** is a comprehensive industrial monitoring platform that brings together:

### What It Does

- 📊 **Real-time Monitoring**: Live motor speed, temperature, vibration, and efficiency tracking
- 🏭 **Fleet Management**: Monitor 17 diverse industrial machines (motors, pumps, compressors, crushers, etc.)
- 💼 **Business Intelligence**: OEE, ROI, energy costs, predictive maintenance analytics
- 🔮 **Predictive AI**: Machine learning models for failure prediction and maintenance scheduling
- 🌐 **Edge Computing**: Distributed processing with 9 edge nodes
- 📈 **Advanced Analytics**: Comprehensive charts, trends, and comparisons
- 🔄 **Real-time Updates**: WebSocket-based live data streaming
- 🎓 **Educational**: Physics formulas and industrial standards explained

### Why It's Special

✅ **Real Physics**: Authentic industrial motor calculations (IEEE 112, IEC 60034, ISO 10816)  
✅ **Production Ready**: Deployed on Render + Netlify with persistent cloud database  
✅ **Full Stack**: C++ physics → .NET API → React dashboard  
✅ **Business Focused**: Not just data, but actionable business insights  
✅ **Educational**: Learn physics, engineering, and software development

---

## ✨ Features

### 🎯 Core Capabilities

**Real-time Monitoring**

- Live motor speed (2000-3000 RPM)
- Temperature tracking (45-95°C)
- 3-axis vibration analysis (RMS calculation)
- Efficiency monitoring (70-95%)
- Power consumption (kW)
- 50+ industrial sensor parameters

**Multi-Machine Fleet**

- MOTOR-001: Main drive motor (24/7 operation)
- 3× Industrial Pumps
- 2× Conveyor Belts
- 2× Air Compressors
- 2× Industrial Fans
- 2× Backup Generators
- 1× Steam Turbine
- 1× Jaw Crusher
- 2× Industrial Mixers
- 1× Hydraulic Press

**Business Intelligence**

- Executive dashboard (system health, uptime, efficiency)
- Financial analytics (energy costs, ROI, maintenance)
- Operational KPIs (OEE, MTBF, MTTR, production output)
- Trend analysis (30-day charts)
- Comparative analysis (machine ranking, departments)
- Predictive insights (maintenance forecasts, downtime)

**Advanced Features**

- Edge computing simulation (9 nodes)
- ML model tracking (92.6% accuracy)
- Quality control monitoring
- Supply chain optimization
- Production line analysis
- Facility management

---

## 🛠️ Technology Stack

### Backend (motor-speed-backend)

- **ASP.NET Core 8.0** - Web API framework
- **C# 12** - Programming language
- **C++ 17** - Physics engine
- **PostgreSQL** - Database (NeonDB)
- **Entity Framework Core** - ORM
- **SignalR** - Real-time communication
- **Docker** - Containerization

### Frontend (motor-speed-frontend)

- **React 19.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.0** - Build tool
- **TailwindCSS 3.4** - Styling
- **Recharts 3.1** - Charts
- **Shadcn UI** - Component library
- **SignalR Client** - WebSocket

### Database

- **PostgreSQL 15+** - Cloud database
- **NeonDB** - Serverless Postgres hosting
- **3 Tables** - MotorReadings, Alerts, Machines
- **7 Migrations** - Schema versioning

### DevOps

- **Docker** - Containerization
- **Render** - Backend hosting
- **Netlify** - Frontend hosting
- **GitHub** - Version control
- **CI/CD** - Auto-deploy on push

---

## 🏗️ Architecture

### System Overview

```bash
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Netlify)                  │
│  • 10+ Dashboards  • Recharts  • Real-time UI              │
│  • TailwindCSS     • TypeScript • SignalR Client           │
└────────────┬───────────────────────────┬────────────────────┘
             │ REST API                  │ WebSocket
             │ (HTTP/JSON)               │ (SignalR)
┌────────────▼───────────────────────────▼────────────────────┐
│              ASP.NET Core Backend (Render)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MotorController (40+ endpoints)                     │   │
│  └────────────┬────────────────────────────────────────┘   │
│  ┌────────────▼────────────────────────────────────────┐   │
│  │ EngineService (Business logic + C++ interop)        │   │
│  └────────────┬────────────────────────────────────────┘   │
│  ┌────────────▼────────────────────────────────────────┐   │
│  │ motor_engine.so (C++ Physics - 60+ functions)       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ AppDbContext (Entity Framework Core)                 │  │
│  └────────────┬─────────────────────────────────────────┘  │
└───────────────┼────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────┐
│            PostgreSQL Database (NeonDB Cloud)               │
│  • MotorReadings table (60+ columns)                       │
│  • Alerts table  • Machines table                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User clicks "Generate Reading"** in React
2. **Frontend** → POST `/api/motor/sample`
3. **Backend Controller** → calls `EngineService.Sample()`
4. **EngineService** → calls C++ `GetMotorSpeed()`, `GetMotorTemperature()`, etc.
5. **C++ Engine** → calculates physics (speed, temp, vibration, efficiency)
6. **EngineService** → saves to PostgreSQL, broadcasts via SignalR
7. **Frontend** → receives SignalR update, re-renders UI
8. **Total time**: ~150ms (C++: 1ms, DB: 120ms, Network: 30ms)

---

## 🚀 Quick Start

### Option 1: Run Locally (Development)

```bash
# 1. Start Backend
cd motor-speed-backend/EngineMock
g++ -shared -fPIC -o motor_engine.dylib motor_engine.cpp -std=c++17  # macOS
# OR
g++ -shared -fPIC -o motor_engine.so motor_engine.cpp -std=c++17  # Linux

cd ../Server/MotorServer
# Create .env file (see Environment Setup section)
dotnet restore
dotnet run
# Backend runs at http://localhost:5001

# 2. Start Frontend (in new terminal)
cd motor-speed-frontend
npm install
# Create .env file (see Environment Setup section)
npm run dev
# Frontend runs at http://localhost:5173

# 3. Open browser
# Navigate to http://localhost:5173
```

### Option 2: Use Production URLs

No installation needed! Visit:

- **Dashboard**: [https://motor-speed-temperature.netlify.app](https://motor-speed-temperature.netlify.app)
- **API**: [https://embedded-motor-engine-speed-temperature.onrender.com](https://embedded-motor-engine-speed-temperature.onrender.com)

### Option 3: Docker Compose

```bash
# Build and run both frontend and backend
make up

# Or manually:
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:5001
```

---

## 📁 Project Structure

```bash
motor-dashboard/
│
├── motor-speed-backend/          # .NET Backend
│   ├── EngineMock/              # C++ Physics Engine
│   │   ├── motor_engine.cpp    # Real physics calculations
│   │   ├── motor_engine.hpp    # C API header
│   │   └── motor_engine.so/.dylib  # Compiled libraries
│   │
│   └── Server/
│       ├── Dockerfile          # Backend Docker config
│       └── MotorServer/
│           ├── Program.cs      # Application entry
│           ├── Controllers/    # API endpoints
│           ├── Services/       # Business logic
│           ├── Models/         # Data models
│           ├── Data/           # Database context
│           ├── Hubs/           # SignalR hub
│           └── .env            # Backend environment
│
├── motor-speed-frontend/         # React Frontend
│   ├── src/
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Entry point
│   │   ├── components/        # 25+ React components
│   │   ├── services/          # API integration
│   │   ├── types/             # TypeScript types
│   │   ├── hooks/             # Custom hooks
│   │   └── lib/               # Utilities
│   │
│   ├── .env                   # Frontend environment
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite config
│   ├── tailwind.config.cjs    # Tailwind config
│   ├── Dockerfile             # Frontend Docker
│   └── netlify.toml           # Netlify config
│
├── docker-compose.yml            # Multi-container setup
├── Makefile                      # Build shortcuts
└── README.md                     # This file
```

---

## 🔐 Environment Setup

### Backend (.env in `motor-speed-backend/Server/MotorServer/`)

```env
# PostgreSQL Database (NeonDB)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# CORS Frontend URL
FRONTEND_URL="https://your-frontend-url.netlify.app"
```

### Frontend (.env in `motor-speed-frontend/`)

```env
# Backend API URLs
VITE_API_URL=http://localhost:5001
VITE_SIGNALR_URL=http://localhost:5001/motorHub

# Admin passkey (for delete operations)
VITE_ADMIN_PASSKEY=your-admin-passkey
```

### Get NeonDB Credentials

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project (free tier available)
3. Copy pooled connection string
4. Use in `DATABASE_URL` environment variable

---

## 🚀 Deployment

### Backend (Render)

**Steps:**

1. Connect GitHub repo to Render
2. Select "Docker" deployment
3. Set environment variables (DATABASE_URL, FRONTEND_URL)
4. Deploy automatically on push to main

**Result**: `https://your-backend-url.onrender.com`

### Frontend (Netlify)

**Steps:**

1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables (VITE_API_URL, VITE_SIGNALR_URL, VITE_ADMIN_PASSKEY)
4. Deploy automatically on push to main

**Result**: `https://your-frontend-url.netlify.app`

---

## 📊 Features Showcase

### Dashboard Metrics

- **17 Machines**: Motor, pumps, compressors, crushers, mixers, etc.
- **50+ Sensors**: Pressure, vibration, electrical, mechanical, environmental
- **60+ KPIs**: OEE, MTBF, MTTR, ROI, efficiency, uptime
- **10+ Dashboards**: Main, health, business, analytics, IoT, control
- **Real-time**: 2-second update intervals via SignalR

### Business Intelligence

- **Energy Costs**: 24h ($410), 7d ($2,873), 30d ($12,313)
- **OEE Analysis**: Availability, performance, quality breakdown
- **Predictive**: Maintenance forecasting, downtime prediction
- **Comparative**: Machine ranking, department comparison
- **Trends**: 30-day efficiency, energy, uptime charts

### Physics Calculations

All data based on real industrial physics:

- **Speed**: Load, ambient, time, seasonal, wear effects
- **Temperature**: Thermal dynamics with cooling
- **Vibration**: ISO 10816 standards (RMS from 3-axis)
- **Efficiency**: IEEE 112 with losses
- **Health**: Weighted composite (efficiency 40%, vibration 25%, temp 20%, etc.)

---

## 🎯 Use Cases

### Industrial Applications

- Production floor monitoring
- Predictive maintenance
- Energy management
- Quality control
- Fleet optimization

### Educational

- Learn full-stack development
- Understand industrial physics
- Practice React + TypeScript
- Study real-time systems
- Explore IoT architectures

### Business

- Reduce downtime
- Optimize energy costs
- Improve efficiency
- Schedule maintenance
- Track KPIs

---

## 🛠️ Development

### Prerequisites

- Node.js 20+
- .NET 8.0 SDK
- C++ compiler (g++)
- PostgreSQL (NeonDB account)
- Git

### Local Setup

```bash
# Clone repository
git clone https://github.com/yourusername/motor-dashboard.git
cd motor-dashboard

# Backend setup
cd motor-speed-backend/EngineMock
g++ -shared -fPIC -o motor_engine.dylib motor_engine.cpp -std=c++17
cd ../Server/MotorServer
# Create .env file
dotnet restore
dotnet run &

# Frontend setup
cd ../../../motor-speed-frontend
npm install
# Create .env file
npm run dev

# Open http://localhost:5173
```

### Using Makefile

```bash
# Start both backend and frontend
make up

# Stop all services
make down

# Run tests
make test-backend
make test-frontend

# Check health
make health
```

---

## 📖 Documentation

### Component READMEs

- **Backend**: See [motor-speed-backend/README.md](motor-speed-backend/README.md)
  - API endpoints, C++ integration, database schema
  - Business logic, physics formulas, deployment
- **Frontend**: See [motor-speed-frontend/README.md](motor-speed-frontend/README.md)
  - Component architecture, charts, styling
  - Real-time updates, state management, reusable components

### API Documentation

- **Swagger UI**: [https://embedded-motor-engine-speed-temperature.onrender.com/swagger](https://embedded-motor-engine-speed-temperature.onrender.com/swagger)
- **40+ endpoints** documented with request/response examples

---

## 🎓 Learning Objectives

### What You'll Learn

**Full-Stack Development:**

- C++ and C# interoperability (P/Invoke)
- RESTful API design with ASP.NET Core
- React with TypeScript and Hooks
- Real-time WebSocket communication (SignalR)
- PostgreSQL database with Entity Framework

**Industrial IoT:**

- Motor physics and engineering
- Industrial standards (IEEE, IEC, ISO)
- Sensor data collection and analysis
- Predictive maintenance
- Business intelligence and KPIs

**Modern Web Technologies:**

- Vite for fast development
- TailwindCSS for styling
- Recharts for data visualization
- Docker for deployment
- Cloud hosting (Render, Netlify)

**Software Architecture:**

- Microservices design
- Real-time data streaming
- Database design and migrations
- API integration patterns
- Component-based UI

---

## 🔧 Key Technologies Explained

### C++ Physics Engine

**What**: High-performance motor physics calculations  
**Why**: Authentic industrial formulas, faster than JavaScript  
**How**: Compiled to `.so`/`.dylib`, called via C# P/Invoke

### ASP.NET Core Backend

**What**: Modern web API framework  
**Why**: High performance, async/await, cross-platform  
**How**: 40+ endpoints, Entity Framework, SignalR hub

### PostgreSQL (NeonDB)

**What**: Cloud-hosted relational database  
**Why**: Persistent storage, auto-scaling, backups  
**How**: Connection pooling, SSL encryption, migrations

### React Frontend

**What**: Component-based UI library  
**Why**: Reusable components, hooks, virtual DOM  
**How**: 25+ components, real-time updates, responsive design

### SignalR

**What**: Real-time WebSocket library  
**Why**: Live updates without polling  
**How**: Hub on backend, client on frontend, auto-reconnect

### Recharts

**What**: React charting library  
**Why**: Responsive, customizable, performant  
**How**: BarChart, LineChart for trends and analytics

---

## 📊 Screenshots & Demos

### Main Dashboard

- Real-time motor metrics with live updates
- Interactive chart showing speed, temperature, efficiency
- Reading list with export and delete functionality

### Business Insights

- 6 tabs: Executive, Financial, Operational, Trends, Comparative, Predictive
- 40+ KPIs with educational notes
- Recharts visualizations

### Industrial Management

- 17 machines overview
- Production lines, maintenance, quality control
- Supply chain optimization

### Health Page

- System status, service monitoring
- 9 edge nodes with CPU/memory/latency
- Machine status summary

---

## 🎯 Performance

### Benchmarks

**Backend API:**

- Health check: 1ms
- Generate reading: 150ms (C++: 1ms, DB: 120ms)
- Get machines: 5ms
- Business insights: 250ms

**Frontend:**

- Initial load: 1.2s
- Chart render: 50ms
- Real-time update: 10ms

**Database:**

- Insert reading: 120ms (PostgreSQL SSL)
- Query 100 readings: 125ms
- Complex BI query: 200ms

---

## 🔒 Security

### Implemented

- ✅ SSL/TLS for database
- ✅ CORS restricted to specific origins
- ✅ Environment variables for secrets
- ✅ Passkey for delete operations
- ✅ Non-root Docker containers
- ✅ Input validation

### Recommended for Production

- JWT authentication
- Role-based access control
- Rate limiting
- API keys
- Audit logging

---

## 🤝 Contributing

We welcome contributions!

**How to contribute:**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Make changes and test
4. Commit: `git commit -m 'Add AmazingFeature'`
5. Push: `git push origin feature/AmazingFeature`
6. Open Pull Request

**Contribution ideas:**

- Add new machine types
- Implement authentication
- Add more charts
- Improve mobile UX
- Write tests
- Translate to other languages

---

## 📄 License

Open-source and available for educational and commercial use.

---

## 🙏 Acknowledgments

Built with these amazing technologies:

- ASP.NET Core, Entity Framework Core, SignalR
- React, TypeScript, Vite, TailwindCSS, Recharts
- PostgreSQL, NeonDB
- Docker, Render, Netlify

Inspired by real industrial IoT monitoring systems and designed for both production use and educational purposes.

---

## 📞 Support

- 🌐 **Portfolio**: [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/)

---

## 🎉 Happy Coding

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---

**Built with ❤️ by developers, for developers**

_A comprehensive full-stack IoT platform demonstrating real-world industrial monitoring with authentic physics, modern web technologies, and production-ready architecture._

⭐ **Star this repo if you find it useful!**
