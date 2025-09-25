# motor-speed-backend/Server/Dockerfile

# --- Native build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS native-build
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY ../EngineMock/motor_engine.cpp .
COPY ../EngineMock/motor_engine.hpp .
COPY ../EngineMock/enhanced_motor_engine.cpp .
COPY ../EngineMock/enhanced_motor_engine.hpp .
RUN g++ -shared -fPIC -o libmotor_engine.so motor_engine.cpp
RUN g++ -shared -fPIC -o enhanced_motor_engine.so enhanced_motor_engine.cpp

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
# Copy solution file and Server/ contents
COPY motor-speed-backend.sln ./
COPY Server/. ./Server/

# Copy the built .so files from native-build stage
COPY --from=native-build /src/libmotor_engine.so ./EngineMock/
COPY --from=native-build /src/enhanced_motor_engine.so ./EngineMock/

# Install EF tools and build
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet restore
ENV ASPNETCORE_ENVIRONMENT=Development

WORKDIR /app/Server

# Skip creating new migrations during build - just apply existing ones

# Build the project to surface errors
RUN dotnet build MotorServer/MotorServer.csproj -c Release
# Apply migrations in build stage so motors.db is created
RUN dotnet ef database update --project MotorServer/MotorServer.csproj --startup-project MotorServer
RUN dotnet publish MotorServer/MotorServer.csproj -c Release -o out -p:DefineConstants=LINUX

# --- Final runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install runtime dependencies for the C++ libraries
RUN apt-get update && apt-get install -y libc6 build-essential && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/Server/out .
COPY --from=build /app/Server/MotorServer/motors.db ./motors.db
COPY --from=native-build /src/libmotor_engine.so .
COPY --from=native-build /src/enhanced_motor_engine.so .
COPY Server/MotorServer/appsettings.json ./appsettings.json
COPY Server/MotorServer/appsettings.Development.json ./appsettings.Development.json

# Run app on port 5001
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001

ENTRYPOINT ["dotnet", "MotorServer.dll"]
