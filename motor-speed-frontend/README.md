# IoT Embedded Motor Sync Intelligence Frontend - Real-time Industrial IoT Dashboard, Motor Physics Engine, Business Intelligence Platform for Industrial IoT (React, TypeScript, Vite, TailwindCSS, Shadcn UI, SignalR, Docker)

**A modern React + TypeScript frontend for real-time industrial motor monitoring with advanced analytics, business intelligence, and IoT visualization.**

Built with React 19, Vite, TailwindCSS, and Recharts for a responsive, real-time industrial monitoring experience.

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![SignalR](https://img.shields.io/badge/SignalR-Real--time-FF6600)](https://dotnet.microsoft.com/apps/aspnet/signalr)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Dashboard Overview](#-dashboard-overview)
- [Component Architecture](#-component-architecture)
- [Real-time Updates](#-real-time-updates)
- [Code Examples](#-code-examples)
- [Reusable Components](#-reusable-components)
- [Deployment](#-deployment)
- [Customization](#-customization)

---

## 🌟 Overview

The **Motor Speed Frontend** is a comprehensive industrial monitoring dashboard that provides:

- **Real-time Monitoring**: Live motor data with WebSocket updates
- **10+ Dashboards**: Main, Health, Business Insights, Analytics, Industrial Management, etc.
- **Advanced Charts**: Recharts-powered visualizations with trends and comparisons
- **Business Intelligence**: OEE, ROI, energy costs, predictive maintenance
- **Responsive Design**: Mobile-friendly with dark mode support
- **Educational Tooltips**: Physics formulas and industrial standards explained

### Live Demo

🌐 **Production**: [https://motor-speed-temperature.netlify.app](https://motor-speed-temperature.netlify.app)

---

## ✨ Key Features

### 🎯 Core Dashboards

**1. Main Dashboard** (`MainDashboard.tsx`)

- Real-time motor speed, temperature, vibration, efficiency
- Live chart with Recharts (speed, temp, efficiency over time)
- Reading list with export (CSV/JSON)
- Delete all data with passkey confirmation

**2. Industrial Sensor Dashboard** (`SensorDashboard.tsx`)

- 50+ sensor parameters displayed
- 3-axis vibration analysis
- Pressure sensors (oil, air, hydraulic)
- Electrical monitoring (voltage, current, power factor)
- Environmental data (humidity, ambient temp, pressure)

**3. Business Insights** (`BusinessInsightsPage.tsx`)

- **Executive Summary**: System health, uptime, efficiency
- **Financial**: Energy costs (24h/7d/30d), ROI, maintenance costs
- **Operational KPIs**: OEE, availability, performance, quality, MTBF, MTTR
- **Trends**: 30-day efficiency, energy, uptime charts (Recharts)
- **Comparative**: Machine performance, department analysis

- **Predictive**: Maintenance forecasts, downtime prediction

**4. Advanced Analytics** (`AdvancedAnalyticsDashboard.tsx`)

- Energy efficiency analysis
- OEE breakdown

- 7-day performance trends
- MTBF/MTTR calculations

**5. Industrial Management** (`IndustrialManagementDashboard.tsx`)

- Facility overview (17 machines)
- Production line analysis

- Maintenance scheduling
- Quality control metrics
- Supply chain optimization

**6. Edge Computing** (`EdgeComputingDashboard.tsx`)

- 9 edge nodes monitoring
- CPU, memory, latency metrics
- Storage and bandwidth tracking
- Performance trends

**7. Predictive Maintenance** (`PredictiveMaintenanceDashboard.tsx`)

- ML model accuracy (92.6%)
- Health score trends (24h chart)
- Failure predictions
- Maintenance recommendations

**8. IoT Cloud Integration** (`IoTCloudIntegration.tsx`)

- Cloud service status (AWS, Azure, Google Cloud)
- Data upload tracking
- API call monitoring
- Sync status

**9. Daily Life Applications** (`DailyLifeApplications.tsx`)

- Home automation (HVAC, energy savings)
- Personal vehicle (fuel efficiency, engine health)
- Recreation equipment (boat, generator)

- Smart appliances

**10. Motor Control** (`MotorControlDashboard.tsx`)

- Interactive start/stop controls
- Speed setpoint adjustment
- Real-time physics simulation
- Safety monitoring

**11. System Health** (`HealthPage.tsx`)

- Service status monitoring
- Machine status summary
- Edge node overview

---

## 🛠️ Technology Stack

### Core Framework

- **React 19.1**: Latest React with Hooks and Concurrent Features
- **TypeScript 5.8**: Type-safe development
- **Vite 7.0**: Lightning-fast build tool and dev server

### UI & Styling

- **TailwindCSS 3.4**: Utility-first CSS framework

- **Shadcn UI**: Radix UI components (Dialog, Tooltip, Input, Button)
- **React Icons 5.5**: Icon library
- **Heroicons 2.2**: Additional icons

### Data Visualization

- **Recharts 3.1**: Responsive chart library (BarChart, LineChart, PieChart)
- **Custom Charts**: Interactive motor speed/temperature charts

### Real-time Communication

- **@microsoft/signalr 8.0.7**: WebSocket client for live updates
- **Auto-reconnect**: Handles connection failures gracefully

### HTTP Client

- **Axios 1.10**: HTTP requests to backend API
- **Fetch API**: Alternative for simple requests

### State Management

- **React Hooks**: useState, useEffect, useCallback, useMemo, useRef
- **Context API**: Toast notifications

### Utilities

- **Sonner 2.0.7**: Beautiful toast notifications
- **date-fns**: Date formatting and manipulation
- **JWT Decode 4.0**: Token decoding (for future auth)

---

## 📁 Project Structure

```bash
motor-speed-frontend/
│
├── public/                        # Static assets
│   └── vite.svg
│
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with routing
│   ├── index.css                 # Global styles
│   ├── vite-env.d.ts            # Vite type definitions
│   │
│   ├── components/               # React Components (25+ files)
│   │   ├── MainDashboard.tsx           # Main monitoring dashboard
│   │   ├── HealthPage.tsx              # System health overview
│   │   ├── BusinessInsightsPage.tsx    # Business intelligence
│   │   ├── SensorDashboard.tsx         # Industrial sensors
│   │   ├── AdvancedAnalyticsDashboard.tsx  # Advanced analytics
│   │   ├── IndustrialManagementDashboard.tsx  # Facility management
│   │   ├── EdgeComputingDashboard.tsx  # Edge nodes
│   │   ├── PredictiveMaintenanceDashboard.tsx  # ML predictions
│   │   ├── IoTCloudIntegration.tsx     # Cloud services
│   │   ├── DailyLifeApplications.tsx   # Daily life apps
│   │   ├── MotorControlDashboard.tsx   # Motor controls
│   │   ├── NavBar.tsx                  # Navigation
│   │   ├── DashboardStats.tsx          # Stats cards
│   │   ├── MotorChart.tsx              # Speed/temp chart
│   │   ├── ReadingList.tsx             # Data table
│   │   ├── AlertSystem.tsx             # Alert notifications
│   │   ├── AnimatedMotor.tsx           # Visual motor animation
│   │   ├── DeleteConfirmationDialog.tsx # Delete modal
│   │   ├── ReportGenerator.tsx         # PDF reports
│   │   └── ...more components
│   │
│   ├── components/ui/            # Reusable UI Components
│   │   ├── AnimatedGearIcon.tsx        # Spinning gear
│   │   ├── PhysicsFormulaTooltip.tsx   # Formula tooltips
│   │   ├── ToastProvider.tsx           # Toast context
│   │   ├── dialog.tsx                  # Shadcn Dialog
│   │   ├── input.tsx                   # Shadcn Input
│   │   ├── button.tsx                  # Shadcn Button
│   │   └── tooltip.tsx                 # Shadcn Tooltip
│   │
│   ├── services/                 # API Services
│   │   ├── api.ts                      # API configuration
│   │   ├── motorApi.ts                 # Motor endpoints
│   │   ├── enhancedApi.ts              # Enhanced endpoints
│   │   └── auth.ts                     # Authentication
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   └── useToast.ts                 # Toast notifications hook
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts                    # Helper functions
│   │   └── dateUtils.ts                # Date formatting
│   │
│   ├── types/                    # TypeScript Types
│   │   ├── types.ts                    # Interface definitions
│   │   └── index.ts                    # Type exports
│   │
│   └── styles/                   # Additional Styles
│       └── toast.css                   # Toast styles
│
├── .env                          # Environment variables (local)
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.cjs          # TailwindCSS configuration
├── netlify.toml                 # Netlify deployment config
├── Dockerfile                   # Docker configuration
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Backend API** running (see motor-speed-backend)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/motor-dashboard.git
cd motor-dashboard/motor-speed-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env file (see Environment Variables section)

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

---

## 🔐 Environment Variables

### Local Development (`.env`)

Create `.env` file in project root:

```env
# Motor Dashboard Frontend Environment Variables

# Backend API URLs (for localhost development)

VITE_API_URL=http://localhost:5001
VITE_SIGNALR_URL=http://localhost:5001/motorHub

# Admin passkey for delete confirmation
VITE_ADMIN_PASSKEY=motor2025
```

### Production (Netlify)

Set these in Netlify dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://embedded-motor-engine-speed-temperature.onrender.com

VITE_SIGNALR_URL=https://embedded-motor-engine-speed-temperature.onrender.com/motorHub
VITE_ADMIN_PASSKEY=motor2025
```

**Important:**

- ✅ All Vite env vars **must** start with `VITE_`
- ✅ Access in code: `import.meta.env.VITE_API_URL`

- ✅ Changes require restart of dev server

---

## 🎨 Dashboard Overview

### Main Dashboard (Home)

**URL**: `/?page=dashboard` or `/`

**Features:**

- Live motor metrics (speed, temp, vibration, efficiency)

- Real-time chart (Recharts) with 3 data series
- Generate reading button
- Reading list with filtering
- Export to CSV/JSON
- Delete all data (with passkey)

**Components Used:**

- `DashboardStats` - 6 metric cards
- `MotorChart` - Interactive chart
- `ReadingList` - Data table
- `AnimatedMotor` - Visual animation
- `DeleteConfirmationDialog` - Delete modal

---

### Health Page

**URL**: `/?page=health`

**Features:**

- System status overview
- 17 machines monitoring
- 9 edge nodes status

- Service health checks
- Real-time metrics

**Metrics:**

- Total machines, online count, uptime %
- Overall efficiency, power consumption
- Edge node CPU, memory, latency
- API response times

---

### Business Insights

**URL**: `/?page=business-insights`

**Features:**

- 6 tab navigation (Executive, Financial, Operational, Trends, Comparative, Predictive)
- 40+ KPIs and metrics
- Recharts visualizations
- Educational notes on every metric

**Key Tabs:**

1. **Executive**: System health, uptime, efficiency, critical issues
2. **Financial**: Energy costs, ROI, maintenance costs
3. **Operational**: OEE, MTBF, MTTR, production output
4. **Trends**: 30-day charts (efficiency, energy, uptime, maintenance)
5. **Comparative**: Machine ranking, department comparison
6. **Predictive**: Maintenance forecasts, downtime prediction

---

## 🏗️ Component Architecture

### App Structure

```
App.tsx (Root)
├── ToastProvider (Context)
├── SignalR Connection (WebSocket)
└── Page Router
    ├── MainDashboard (page=dashboard)
    ├── HealthPage (page=health)
    └── BusinessInsightsPage (page=business-insights)
```

### Component Hierarchy

```
MainDashboard
├── NavBar
├── DashboardStats (6 cards)
├── AnimatedMotor (visual)
├── MotorChart (Recharts)
├── ReadingList (table)
│   └── DeleteConfirmationDialog
└── Multiple sub-dashboards
    ├── SensorDashboard
    ├── AdvancedAnalyticsDashboard
    ├── IndustrialManagementDashboard
    ├── EdgeComputingDashboard
    ├── PredictiveMaintenanceDashboard
    ├── IoTCloudIntegration
    ├── DailyLifeApplications
    └── MotorControlDashboard
```

---

## 📊 Data Flow

### API Integration

```typescript
// 1. Fetch from backend
const response = await fetch(`${API_BASE_URL}/api/motor`);
const readings: MotorReading[] = await response.json();

// 2. Update state
setReadings(readings);

// 3. Components re-render with new data

// 4. Charts update automatically (Recharts)
```

### SignalR Real-time Updates

```typescript
// Connection setup in App.tsx
const connection = new signalR.HubConnectionBuilder()
  .withUrl(SIGNALR_URL)
  .withAutomaticReconnect()
  .build();

await connection.start();

// Listen for updates
connection.on("MotorDataUpdate", (reading: MotorReading) => {
  setReadings((prev) => [reading, ...prev]);
});

connection.on("Alert", (alert: Alert) => {
  toast.warning(alert.message);
});
```

---

## 💻 Code Examples

### Example 1: Fetch Motor Readings

```typescript
import { API_BASE_URL } from "../services/api";
import type { MotorReading } from "../types";

async function fetchReadings() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/motor`);
    if (response.ok) {
      const data: MotorReading[] = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
  return [];
}
```

### Example 2: Generate New Reading

```typescript
async function generateReading() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/motor/sample`, {
      method: "GET",
    });

    if (response.ok) {
      const newReading: MotorReading = await response.json();
      console.log("New reading:", newReading);

      // Fetch updated list
      const allReadings = await fetchReadings();
      setReadings(allReadings);
    }
  } catch (error) {
    console.error("Generate failed:", error);
  }
}
```

### Example 3: Display Chart with Recharts

```typescript
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TrendChart({ data }: { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(v) => v.toFixed(1)}
          width={60}
        />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### Example 4: Calculate Vibration RMS

```typescript
function calculateRMS(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

// Usage
const vibrationRMS = calculateRMS(
  reading.vibrationX ?? 0,
  reading.vibrationY ?? 0,
  reading.vibrationZ ?? 0
);
// Result: 3.91 mm/s = √(2.36² + 2.30² + 2.10²)
```

### Example 5: Status Color Helper

```typescript
function getStatusColor(status: string) {
  switch (status) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
```

### Example 6: Custom Toast Hook

```typescript
import { useToast } from "../hooks/useToast";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Success!", "Operation completed");
  };

  const handleError = () => {
    toast.error("Error!", "Something went wrong");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

---

## 🔄 Reusable Components

### 1. AnimatedGearIcon

**Location**: `src/components/ui/AnimatedGearIcon.tsx`

**Usage:**

```typescript
<AnimatedGearIcon isActive={true} size="md" status="live" />
```

**Props:**

- `isActive`: boolean - Whether gear spins
- `size`: "sm" | "md" | "lg" - Size variant
- `status`: "live" | "offline" - Color theme

**Reuse:** Perfect for loading indicators, status badges

---

### 2. PhysicsFormulaTooltip

**Location**: `src/components/ui/PhysicsFormulaTooltip.tsx`

**Usage:**

```typescript
<PhysicsFormulaTooltip
  title="Motor Efficiency"
  formula="Efficiency = (Useful Power / Total Power) × 100%"
  explanation="Based on IEEE 112 standard"
>
  <div>94.5%</div>
</PhysicsFormulaTooltip>
```

**Reuse:** Add educational tooltips to any metric

---

### 3. DeleteConfirmationDialog

**Location**: `src/components/DeleteConfirmationDialog.tsx`

**Usage:**

```typescript
<DeleteConfirmationDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  onConfirm={handleDelete}
  requiredPasskey="motor2025"
/>
```

**Reuse:** Secure delete confirmation for any dangerous action

---

### 4. DashboardStats Cards

**Location**: `src/components/DashboardStats.tsx`

**Usage:**

```typescript
<DashboardStats
  totalMachines={17}
  onlineMachines={1}
  totalReadings={100}
  averageEfficiency={84.9}
  criticalAlerts={0}
  maintenanceDue={1}
/>
```

**Reuse:** Display summary statistics for any dashboard

---

### 5. MotorChart (Recharts)

**Location**: `src/components/MotorChart.tsx`

**Usage:**

```typescript
<MotorChart readings={readings} darkMode={darkMode} />
```

**Features:**

- Multi-series line chart (speed, temp, efficiency)
- Responsive design
- Interactive tooltips

- Dark mode support

**Reuse:** Adapt for any time-series data

---

## 🎨 Styling & Theming

### TailwindCSS Utilities

**Common Patterns:**

```tsx

// Card
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200">

// Gradient Background
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20">

// Button
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">

// Status Badge
<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Dark Mode

**Toggle dark mode:**

```typescript
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);
```

**Usage in components:**

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## 📦 Key Dependencies

### React & Core

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "typescript": "~5.8.3",
  "vite": "^7.0.4"
}
```

### UI Libraries

```json
{
  "tailwindcss": "^3.4.6",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-tooltip": "^1.2.8",
  "react-icons": "^5.5.0",
  "@heroicons/react": "^2.2.0",
  "sonner": "^2.0.7"
}
```

### Data & Charts

```json
{
  "recharts": "^3.1.0",
  "axios": "^1.10.0",
  "@microsoft/signalr": "^8.0.7"
}
```

---

## 🔌 API Integration

### API Configuration

**File**: `src/services/api.ts`

```typescript
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://embedded-motor-engine-speed-temperature.onrender.com"
    : "http://localhost:5001");

export const SIGNALR_URL =
  import.meta.env.VITE_SIGNALR_URL || `${API_BASE_URL}/motorHub`;
```

### Fetching Data

**Pattern used throughout:**

```typescript
async function loadData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/motor/endpoint`);
    if (response.ok) {
      const data = await response.json();
      setState(data);
    } else {
      console.error("Failed:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## 📱 Responsive Design

### Breakpoints (TailwindCSS)

- **Mobile**: `< 640px` - Single column layout
- **Tablet**: `md: 768px` - 2 column grids
- **Desktop**: `lg: 1024px` - 3-4 column grids
- **Large**: `xl: 1280px` - Full width dashboards

### Mobile Optimizations

- Responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Touch-friendly buttons: `px-6 py-3`
- Scrollable tables: `overflow-x-auto`
- Collapsible navigation on mobile

---

## 🧩 Component Patterns

### Pattern 1: Dashboard Component

```typescript
interface DashboardProps {
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function YourDashboard({
  signalRConnected = true,
  backendStatus = "connected",
}: DashboardProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/your-endpoint`);
    const result = await response.json();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavBar />
      {/* Your content */}
    </div>
  );
}
```

### Pattern 2: Metric Card Component

```typescript
function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`${colors[color]} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 uppercase">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <span className="text-5xl">{icon}</span>
      </div>
    </div>
  );
}
```

### Pattern 3: Chart Component

```typescript
function ChartComponent({ data }: ChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.timestamp).toLocaleTimeString(),
    speed: d.speed,
    temperature: d.temperature,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="speed" stroke="#3b82f6" />
        <Line type="monotone" dataKey="temperature" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 🎯 Key Features Deep Dive

### Real-time Chart Updates

**Implementation**: `MotorChart.tsx`

```typescript
const chartData = useMemo(() => {
  return readings
    .slice(0, 50)
    .reverse()
    .map((r) => ({
      time: format(new Date(r.timestamp), "HH:mm:ss"),
      speed: r.speed,
      temperature: r.temperature,
      efficiency: r.efficiency ?? 0,
    }));
}, [readings]);

// Recharts updates automatically when chartData changes
<LineChart data={chartData}>
  <Line dataKey="speed" stroke="#3b82f6" name="Speed (RPM)" />
  <Line dataKey="temperature" stroke="#ef4444" name="Temp (°C)" />
  <Line dataKey="efficiency" stroke="#10b981" name="Efficiency (%)" />
</LineChart>;
```

### Export to CSV/JSON

**Implementation**: `ReadingList.tsx`

```typescript
function exportToCSV(readings: MotorReading[]) {
  const headers = ["ID", "Speed", "Temperature", "Efficiency", "Timestamp"];
  const rows = readings.map((r) => [
    r.id,
    r.speed,
    r.temperature,
    r.efficiency,
    r.timestamp,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `motor-readings-${Date.now()}.csv`;
  a.click();
}

function exportToJSON(readings: MotorReading[]) {
  const json = JSON.stringify(readings, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `motor-readings-${Date.now()}.json`;
  a.click();
}
```

### Delete with Passkey Confirmation

**Implementation**: `DeleteConfirmationDialog.tsx`

```typescript
function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  requiredPasskey,
}) {
  const [passkey, setPasskey] = useState("");

  const handleConfirm = () => {
    if (passkey === requiredPasskey) {
      onConfirm();
      onOpenChange(false);

      setPasskey("");
    } else {
      alert("Incorrect passkey");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          placeholder="Enter passkey"
        />
        <DialogFooter>
          <Button onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎓 Educational Features

### Physics Formulas on Every Metric

All dashboards include educational notes explaining:

- Industrial standards (IEEE, IEC, ISO)
- Physics formulas
- Expected ranges
- Thresholds (normal, warning, critical)

**Example:**

```tsx
<div className="p-2 bg-blue-50 rounded-lg">
  <p className="text-xs text-blue-700">
    <strong>📚 Industrial Standard:</strong> Efficiency = (Useful Output Power /
    Input Power) × 100%
    <span className="block mt-1">
      <strong>🔬 Physics:</strong> Based on C++ engine: 92% - (Bearing Wear × 5)
      - (Oil Degradation × 2.5)
    </span>
  </p>
</div>
```

### Status Determination Logic

```typescript
// Based on real industrial thresholds
function determineStatus(reading: MotorReading): string {
  // Critical thresholds
  if (
    reading.temperature > 90 ||
    reading.vibration > 6.0 ||
    reading.efficiency < 75
  ) {
    return "critical";
  }

  // Warning thresholds
  if (
    reading.temperature > 80 ||
    reading.vibration > 4.5 ||
    reading.efficiency < 80
  ) {
    return "warning";
  }

  // Normal operation
  return "normal";
}
```

---

## 🚀 Build & Deployment

### Local Development

```bash
# Start dev server

npm run dev

# Server runs at http://localhost:5173
# Hot reload enabled
```

### Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
# Optimized, minified, tree-shaken

# Preview production build
npm run preview
```

### Netlify Deployment

**Auto-deploy from GitHub:**

1. Connect repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Set environment variables:

   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_SIGNALR_URL=https://your-backend.onrender.com/motorHub
   VITE_ADMIN_PASSKEY=motor2025
   ```

4. Deploy automatically on push to main

**Manual deploy:**

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Docker Deployment

```bash
# Build image
docker build -t motor-frontend .

# Run container
docker run -p 5173:5173 motor-frontend
```

---

## 🎨 Customization Guide

### Add a New Dashboard

**1. Create component:**

```typescript
// src/components/YourDashboard.tsx
export default function YourDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load your data
  }, []);

  return (
    <div>
      <NavBar />
      {/* Your content */}
    </div>
  );
}
```

**2. Add route in App.tsx:**

```typescript
{currentPage === 'your-dashboard' ? (
  <YourDashboard />
) : (
  // ... other pages
)}
```

**3. Add navigation in NavBar.tsx:**

```typescript
<a href="?page=your-dashboard">Your Dashboard</a>
```

### Add a New Chart

**Using Recharts:**

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function YourChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Add a New Metric Card

```typescript
<div className="bg-blue-50 rounded-xl p-6 shadow-lg">
  <p className="text-sm text-gray-600 uppercase">Your Metric</p>
  <p className="text-4xl font-bold text-blue-600">{value}</p>
  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
</div>
```

---

## 🔑 TypeScript Types

### Main Types

**File**: `src/types/types.ts`

```typescript
// Motor reading with 60+ fields
export interface MotorReading {
  id: number;
  speed: number;
  temperature: number;

  vibration?: number;
  efficiency?: number;
  powerConsumption?: number;

  timestamp: string;
  machineId: string;
  status: "normal" | "warning" | "critical";

  // ... 50+ more fields
}

// Industrial machine
export interface IndustrialMachine {
  id: string;

  name: string;
  type: string;
  isRunning: boolean;

  efficiency: number;
  powerConsumption: number;
  healthScore: number;

  // ... more fields
}

// Business insights
export interface BusinessInsights {
  executive: ExecutiveSummary;
  financial: FinancialMetrics;
  operational: OperationalKPIs;
  trends: TrendMetrics;
  comparative: ComparativeAnalysis;
  predictive: PredictiveInsights;
}

// 20+ more interfaces...
```

---

## 🎯 Use Cases

### 1. Industrial Motor Monitoring Dashboard

Display real-time motor data for production facilities

### 2. Energy Management System

Track power consumption and costs across equipment fleet

### 3. Predictive Maintenance Platform

ML-powered failure prediction and maintenance scheduling

### 4. Quality Control Dashboard

Monitor production quality and defect rates

### 5. IoT Fleet Management

Oversee distributed industrial equipment

### 6. Educational Tool

Learn React, TypeScript, real-time data, industrial concepts

### 7. Home Automation Dashboard

Adapt for smart home monitoring (HVAC, appliances)

### 8. Vehicle Telemetry

Track vehicle performance, fuel efficiency, diagnostics

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test


# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Files

- `src/components/__tests__/AnimatedMotor.test.tsx`
- `src/components/__tests__/ReadingList.test.tsx`

### Example Test

```typescript
import { render, screen } from "@testing-library/react";
import AnimatedMotor from "../AnimatedMotor";

test("renders motor animation", () => {
  render(<AnimatedMotor speed={2500} />);
  const motor = screen.getByTestId("animated-motor");
  expect(motor).toBeInTheDocument();
});
```

---

## 🎓 Learning Resources

### For Beginners

**Start with these files:**

1. `App.tsx` - Application structure
2. `MainDashboard.tsx` - Main dashboard logic
3. `api.ts` - API configuration
4. `types.ts` - Type definitions

**Key Concepts:**

- React Hooks (useState, useEffect, useCallback, useMemo)
- TypeScript interfaces
- API fetching patterns
- Real-time WebSocket connections
- Recharts for data visualization

### For Intermediate Developers

**Study these patterns:**

- Component composition (Dashboard → Cards → Charts)
- State management across components
- SignalR integration for real-time updates

- Custom hooks (useToast)
- Responsive design with TailwindCSS

### For Advanced Developers

**Explore:**

- Performance optimization (useMemo, useCallback)
- Complex state management
- Chart data transformation
- Business logic calculations
- Edge computing simulations

---

## 🔧 Scripts

### Available Commands

```json
{
  "dev": "vite", // Start dev server

  "build": "tsc -b && vite build", // Production build
  "lint": "eslint .", // Run linter
  "preview": "vite preview" // Preview production build
}
```

### Usage

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview
npm run preview
```

---

## 🌈 UI Components Library

### Shadcn UI Components Used

**Dialog** (`dialog.tsx`):

```typescript
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Input** (`input.tsx`):

```typescript
<Input
  type="text"
  placeholder="Enter value"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Button** (`button.tsx`):

```typescript
<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Tooltip** (`tooltip.tsx`):

```typescript
<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

---

## 📊 Business Insights Calculations

### Executive Summary

```typescript
// System Health (weighted formula)
systemHealth = (efficiency × 0.4) + (uptime × 0.3) + (issueScore × 0.3)

// Uptime (machine availability)
uptime = (onlineMachines / totalMachines) × 100

// Example: (90.5 × 0.4) + (5.9 × 0.3) + (100 × 0.3) = 68
```

### Financial Metrics

```typescript
// Energy cost calculations
cost24h = totalPower × 24 × $0.12/kWh
cost7d = totalPower × 168 × $0.12/kWh
cost30d = totalPower × 720 × $0.12/kWh

// ROI
roi = (potentialSavings / totalCost) × 100

// Example: ($549.94 / $12,312.52) × 100 = 4.5%
```

### Operational KPIs

```typescript
// OEE (Overall Equipment Effectiveness)
oee = (availability × performance × quality) / 10000


// Components
availability = (onlineMachines / totalMachines) × 100
performance = averageEfficiency
quality = averageHealthScore


// Example: (5.9 × 90.5 × 93.0) / 10000 = 5.0%
```

---

## 🎨 Styling Best Practices

### Color System

```typescript
// Status colors
const statusColors = {
  normal: "text-green-600 bg-green-100",
  warning: "text-yellow-600 bg-yellow-100",

  critical: "text-red-600 bg-red-100",
};

// Metric colors
const metricColors = {
  blue: "from-blue-50 to-indigo-50",
  green: "from-green-50 to-emerald-50",

  orange: "from-orange-50 to-red-50",
};
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

### Dark Mode Support

```tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Text</p>
</div>
```

---

## 🔄 State Management

### React Hooks Used

**useState**: Component state

```typescript
const [readings, setReadings] = useState<MotorReading[]>([]);
```

**useEffect**: Side effects (API calls, subscriptions)

```typescript
useEffect(() => {
  loadData();
  return () => cleanup();
}, [dependencies]);
```

**useCallback**: Memoized functions

```typescript
const loadData = useCallback(async () => {
  // Expensive operation
}, [dependencies]);
```

**useMemo**: Memoized values

```typescript
const chartData = useMemo(() => {
  return processData(readings);
}, [readings]);
```

**useRef**: Prevent double-loading

```typescript
const hasLoaded = useRef(false);
useEffect(() => {
  if (hasLoaded.current) return;
  hasLoaded.current = true;
  loadData();
}, []);
```

---

## 🌐 API Endpoints Used

### Core Endpoints

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |

| `/health` | GET | Health check |
| `/api/motor` | GET | All readings |
| `/api/motor/sample` | GET | Generate reading |
| `/api/motor/stats` | GET | Dashboard stats |
| `/api/motor/machines` | GET | 17 machines |
| `/api/motor/business-insights` | GET | BI analytics |
| `/api/motor/edge-nodes` | GET | Edge nodes |
| `/api/motor/clear` | POST | Delete all |

---

## 🎯 Keywords & Concepts

### Frontend Technologies

- **React Hooks**: useState, useEffect, useCallback, useMemo, useRef
- **TypeScript**: Interfaces, Types, Generics

- **Vite**: Build tool, HMR (Hot Module Replacement)
- **TailwindCSS**: Utility-first CSS
- **Recharts**: Data visualization library
- **SignalR**: WebSocket client

### Industrial Monitoring

- **Real-time Data**: Live updates via WebSocket
- **OEE**: Overall Equipment Effectiveness
- **MTBF**: Mean Time Between Failures
- **KPI**: Key Performance Indicator
- **Predictive Maintenance**: AI-based failure prediction

### Data Visualization

- **Recharts Components**: BarChart, LineChart, PieChart
- **ResponsiveContainer**: Auto-sizing
- **Tooltip**: Interactive data points
- **CartesianGrid**: Chart grid lines
- **XAxis / YAxis**: Chart axes

### UI/UX

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching
- **Toast Notifications**: User feedback
- **Loading States**: Skeleton screens
- **Error Handling**: Graceful degradation

---

## 🔍 Performance Optimization

### Implemented Optimizations

**1. Memoization**

```typescript
const latestReading = useMemo(() => readings[0], [readings]);

const chartData = useMemo(() => transformData(readings), [readings]);
```

**2. Lazy Loading**

```typescript
const LazyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;
```

**3. Debouncing**

```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => search(query), 300),

  []
);
```

**4. Virtual Scrolling** (for large lists)

- Reading list limits to 100 items
- Pagination for older data

---

## 🛠️ Troubleshooting

### CORS Errors

**Error**: `Access to fetch has been blocked by CORS policy`

**Solution**:

- Ensure backend has your frontend URL in CORS policy
- Check `VITE_API_URL` matches backend URL
- Verify backend is running

### SignalR Connection Failed

**Error**: `WebSocket connection to 'ws://...' failed`

**Solution**:

- Check `VITE_SIGNALR_URL` is correct
- Ensure backend SignalR hub is running at `/motorHub`
- Verify CORS allows credentials

### Build Errors

**Error**: `Module not found` or `Type error`

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Environment Variables Not Loading

**Error**: `import.meta.env.VITE_API_URL is undefined`

**Solution**:

- Ensure `.env` file exists in project root
- Verify all vars start with `VITE_`
- Restart dev server after changing .env

---

## 🎨 Component Reuse Examples

### Reuse in Another Project

**1. Copy Component Files**:

```bash

cp -r src/components/ui your-project/src/components/
cp src/components/DashboardStats.tsx your-project/src/components/
```

**2. Install Dependencies**:

```bash
npm install @radix-ui/react-dialog @radix-ui/react-tooltip recharts
```

**3. Import and Use**:

```typescript
import DashboardStats from "./components/DashboardStats";

<DashboardStats
  totalMachines={10}
  onlineMachines={8}
  totalReadings={500}
  averageEfficiency={92.5}
  criticalAlerts={0}
  maintenanceDue={2}
/>;
```

---

## 📱 Mobile Dashboard

**Features:**

- Responsive grid layouts
- Touch-friendly controls
- Collapsible navigation
- Optimized charts for mobile
- Swipe gestures (future)

**Mobile-specific code:**

```tsx
{
  /* Mobile: Stack vertically, Desktop: 4 columns */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricCard />
</div>;

{
  /* Hide on mobile */
}
<div className="hidden md:block">
  <DetailedChart />
</div>;

{
  /* Show only on mobile */
}
<div className="md:hidden">
  <SimpleChart />
</div>;
```

---

## 🎓 Educational Value

### What You'll Learn

**React Development:**

- Component composition
- Hooks patterns
- State management
- Side effects handling
- Performance optimization

**TypeScript:**

- Interface design
- Type safety
- Generics
- Type inference

**Real-time Applications:**

- WebSocket connections
- SignalR integration
- Live data updates
- Connection management

**Data Visualization:**

- Recharts library
- Chart configuration
- Data transformation
- Responsive charts

**Industrial Concepts:**

- Motor physics
- Industrial standards
- Business KPIs
- Predictive maintenance

---

## 🚀 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Multi-facility support
- [ ] Historical data playback
- [ ] Advanced filtering
- [ ] Custom dashboard builder
- [ ] Alarm configuration
- [ ] Report scheduling
- [ ] Mobile app (React Native)

### Contribution Ideas

- Add more chart types
- Improve mobile UX
- Add unit tests
- Internationalization (i18n)
- Accessibility improvements
- Performance monitoring
- Offline mode support

---

## 📄 License

Open-source and available for educational and commercial use.

---

## 🙏 Acknowledgments

### Technologies

- **React Team** - Amazing framework
- **Vite Team** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS
- **Recharts** - Beautiful charts
- **Microsoft** - SignalR client library

### Design Inspiration

- Modern industrial dashboards
- IoT monitoring platforms
- Business intelligence tools

---

## 📞 Support & Contact

### Get Help

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/yourusername/motor-dashboard/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/motor-dashboard/discussions)
- 🌐 **Portfolio**: [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/)

### Useful Links

- **Live Demo**: <https://motor-speed-temperature.netlify.app>
- **Backend API**: <https://embedded-motor-engine-speed-temperature.onrender.com>
- **Swagger Docs**: <https://embedded-motor-engine-speed-temperature.onrender.com/swagger>
- **React Docs**: <https://react.dev>
- **Vite Docs**: <https://vitejs.dev>
- **TailwindCSS**: <https://tailwindcss.com>
- **Recharts**: <https://recharts.org>

---

## 🎉 Happy Coding

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---

**Built with ❤️ using React, TypeScript, TailwindCSS, and modern web technologies**

_Last Updated: October 13, 2025_
