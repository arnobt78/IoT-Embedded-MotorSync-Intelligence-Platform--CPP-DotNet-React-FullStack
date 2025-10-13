# ========================================================================
# CONSOLIDATED MOTOR SERVER DOCKERFILE
# Real Industrial Motor Physics Engine Backend
# Supports both localhost and production (Render)
# ========================================================================

# Use the official .NET 8.0 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 8.0 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install build tools for C++ compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy project file and restore dependencies
COPY ["motor-speed-backend/Server/MotorServer/MotorServer.csproj", "MotorServer/"]
RUN dotnet restore "MotorServer/MotorServer.csproj"

# Copy all source code
COPY motor-speed-backend/Server/ .
COPY motor-speed-backend/EngineMock/ ./EngineMock/
WORKDIR "/src/MotorServer"

# Compile C++ library for Linux (production)
WORKDIR "/src/EngineMock"
RUN g++ -shared -fPIC -o motor_engine.so motor_engine.cpp -std=c++17

# Build the application
WORKDIR "/src/MotorServer"
RUN dotnet build "MotorServer.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MotorServer.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy published application
COPY --from=publish /app/publish .

# Copy native C++ library (Linux version for production)
COPY --from=build /src/EngineMock/motor_engine.so .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "MotorServer.dll"]
