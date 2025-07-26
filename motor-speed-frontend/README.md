# # Embedded Motor Engine Speed Temperature Measurement Dashboard C++, .Net, React Project (Frontend)

![Screenshot 2025-07-25 at 23 11 13](https://github.com/user-attachments/assets/7eb6ad46-73a4-4170-a10e-75ff6b4b9966)

---

## Project Overview (motor-speed-frontend)

This frontend is the UI for the Motor Dashboard, visualizing real-time motor data from a .NET backend (with C++ engine integration) using React, Vite, Tailwind CSS, and shadcn/ui. It demonstrates:

- Real-time charts and notifications
- Modern, responsive UI
- CSV export, settings, and dark mode
- Modular, reusable components

- **Live-Demo:** [https://motor-speed-temperature.netlify.app/](https://motor-speed-temperature.netlify.app/)
- **Backend-Live:** [https://embedded-motor-engine-speed-temperature.onrender.com/](https://embedded-motor-engine-speed-temperature.onrender.com/)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [How It Works: C++ → C# → React](#how-it-works-c---c---react)
5. [Frontend: React, Vite, Tailwind, shadcn/ui](#frontend-react-vite-tailwind-shadcnui)
6. [Real-Time Communication with SignalR](#real-time-communication-with-signalr)
7. [API Usage & Data Flow](#api-usage--data-flow)
8. [Components & Features](#components--features)
9. [Settings, Dark Mode, CSV, Local Date](#settings-dark-mode-csv-local-date)
10. [Running the Frontend](#running-the-frontend)
11. [Docker Usage](#docker-usage)
12. [Testing (React Testing Library)](#testing-react-testing-library)
13. [Nginx & SSL](#nginx--ssl)
14. [Extending & Reusing](#extending--reusing)
15. [Keywords](#keywords)
16. [Conclusion](#conclusion)

---

## Architecture & Technology Stack

- **C++ (EngineMock):** Native DLL/SO/DYLIB for motor data (mock or real)
- **.NET 8+ (ASP.NET Core):** Backend API, SignalR, P/Invoke, EF Core
- **Entity Framework Core:** SQLite (default), migrations
- **SignalR:** Real-time WebSocket-style communication
- **Docker:** Containerized backend
- **Nginx:** HTTPS, routing (see root README)
- **React 18+ (Vite):** Fast, modern SPA
- **TypeScript:** Type safety
- **Tailwind CSS + shadcn/ui:** Modern, accessible UI
- **Recharts:** Real-time data visualization
- **@microsoft/signalr:** Real-time updates from backend
- **Axios:** REST API calls
- **Docker:** Containerized frontend

---

## Project Structure

```bash
motor-speed-frontend/
├── src/
│   ├── components/       # UI components (AnimatedMotor, MotorChart, etc.)
│   ├── lib/              # Utilities (date, etc.)
│   ├── services/         # API/auth helpers
│   ├── types/            # TypeScript types
│   └── ...               # App, main, etc.
├── public/               # Static assets
├── Dockerfile            # For containerization
├── ...                   # Config, README, etc.
```

---

## How It Works: C++ → C# → React

1. **C++ EngineMock:**  
   - Simulates a real motor controller, exporting `GetMotorSpeed()` and `GetMotorTemperature()` via a shared library (DLL/SO/DYLIB).
   - In a real project, this could be replaced with a library that reads from CAN, USB, EtherCAT, or other industrial protocols.

2. **.NET Backend:**  
   - Uses P/Invoke (`[DllImport]`) to call the C++ functions directly from C#.
   - `EngineService` samples the engine, stores readings in SQLite (via EF Core), and broadcasts new readings to all clients using SignalR.
   - API endpoints allow fetching all readings, sampling new data, and health checks.

3. **React Frontend:**  
   - Connects to the backend SignalR hub for real-time updates.
   - Fetches historical data via REST API (using axios).
   - Displays readings in charts, lists, and notifications, with CSV export and settings.

---

## Frontend: React, Vite, Tailwind, shadcn/ui

- **Vite** for fast dev/build.
- **React** for UI, with functional components and hooks.
- **Tailwind CSS** and **shadcn/ui** for styling and accessibility.
- **Recharts** for real-time data visualization.
- **SettingsModal**, **NotificationSidebar**, **AnimatedMotor**, etc., are reusable components.

---

## Real-Time Communication with SignalR

- Frontend uses `@microsoft/signalr` to subscribe to backend updates and update UI in real time.
- Example usage:
  
  ```tsx
  import * as signalR from '@microsoft/signalr';
  const hub = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5001/motorHub')
    .withAutomaticReconnect()
    .build();
  hub.on('NewReading', (reading) => { /* update state */ });
  hub.start();
  ```

---

## API Usage & Data Flow

- Uses axios to call backend endpoints:
  - `GET /api/motor` — fetch latest readings
  - `GET /api/motor/sample` — trigger a new reading
  - `GET /health` — health check
- Example:
  
  ```tsx
  import axios from 'axios';
  useEffect(() => {
    axios.get('/api/motor').then(res => setReadings(res.data));
  }, []);
  ```

---

## Components & Features

- **AnimatedMotor:** 3D gear animation reflecting RPM
- **MotorChart:** Real-time chart (Recharts)
- **ReadingList:** Grouped readings by date, color-coded
- **NotificationSidebar:** Highest/lowest temp & RPM
- **SettingsModal:** Dark mode, max readings, etc.
- **CSV Export:**
  
  ```tsx
  function exportCsv() {
    const csv = readings.map(r => `${r.id},${r.speed},${r.temperature},${r.timestamp}`).join('\n');
    // ...download logic
  }
  ```

---

## Settings, Dark Mode, CSV, Local Date

- **Dark Mode:** Toggle in settings, uses Tailwind dark classes
- **Max Readings to Keep:** Adjustable in settings modal
- **CSV Export:** Exports all readings as CSV
- **Local Date Handling:**
  - All timestamps are UTC from backend, displayed in user's local time using `toLocaleString()`
  - Example:
  
  ```tsx
    const d = new Date(r.timestamp);
    const time = d.toLocaleTimeString();
    ```

---

## Running the Frontend

## Prerequisites

- Node.js (18+ recommended)
- Docker (optional)

## Local Development

```sh
cd motor-speed-frontend
npm install
npm run dev
```

---

## Docker Usage

- Frontend has its own `Dockerfile` for containerization.
- Use `docker-compose.yml` at project root to orchestrate backend, frontend, and Nginx.
- Example frontend Dockerfile:
  
  ```dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY . .
  RUN npm install && npm run build
  EXPOSE 5173
  CMD ["npm", "run", "preview"]
  ```

---

## Testing (React Testing Library)

- Tests are in `src/components/__tests__/`.
- To run all frontend tests:
  
  ```sh
  npm test
  ```

- Example test:
  
  ```tsx
  import { render } from '@testing-library/react';
  import AnimatedMotor from '../AnimatedMotor';
  test('renders without crashing', () => {
    render(<AnimatedMotor rpm={1200} />);
  });
  ```

---

## Nginx & SSL

- Nginx is used for serving the frontend, handling HTTPS, and reverse proxying to the backend.
- Configured in `docker-compose.yml` at project root.
- Example Nginx config:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://frontend:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Nginx config for HTTPS, static file serving, and reverse proxy to backend/frontend (see root README and `nginx.conf`).
- Self-signed certs for dev in `/etc/nginx/certs/`.
- For production, replace with real certs.

---

## Extending & Reusing

- Components are modular and reusable.
- To use in another project, copy the relevant component and update types as needed.
- All React components are modular and reusable.
- To use in another project, copy the relevant component and update types as needed.

---

## Keywords

C++, .NET, ASP.NET Core, SignalR, Entity Framework Core, SQLite, Docker, Nginx, React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts, real-time dashboard, industrial IoT, machine monitoring, real-time data visualization, modular components, extensible architecture, CSV export, dark mode settings, responsive UI, real-time updates, WebSocket communication, React, Vite, TypeScript, Tailwind CSS, shadcn/ui, SignalR, WebSocket, chart, notification, CSV, modular, reusable, dashboard, IoT, industrial, real-time, settings, dark mode

---

## Conclusion

This frontend provides a robust, modern, and extensible template for real-time dashboards, bridging a .NET backend and a beautiful React UI. It supports real-time data visualization, modular components, and is designed for easy extension and reuse. Use it for learning, prototyping, or as a foundation for your next industrial or IoT project.
It demonstrates a complete workflow for real-time machine data monitoring, from a native C++ engine to a .NET backend to a modern React frontend. It is designed for learning, prototyping, and as a reference for real-world industrial or IoT dashboards.
This frontend is a practical, modern, and extensible template for real-time dashboards, bridging .NET backend and a beautiful React UI. Use it for learning, prototyping, or as a foundation for your next industrial or IoT project.

---

Happy coding! 🚀

If you have any questions or need further assistance, feel free to reach out. Your feedback is always welcome, and contributions to improve this project are encouraged.

Thank you!

---
