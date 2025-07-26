# motor-speed-backend/Server/Dockerfile


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
# Copy solution file and Server/ contents
COPY motor-speed-backend.sln ./
COPY Server/. ./Server/

# Install EF tools and build
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet restore
ENV ASPNETCORE_ENVIRONMENT=Development

WORKDIR /app/Server

RUN dotnet ef migrations add DockerInit --project MotorServer/MotorServer.csproj --startup-project MotorServer || echo "Migrations already exist"

# Apply migrations in build stage so motors.db is created
RUN dotnet ef database update --project MotorServer/MotorServer.csproj --startup-project MotorServer
RUN dotnet publish MotorServer/MotorServer.csproj -c Release -o out -p:DefineConstants=LINUX

# --- Native build stage ---
FROM gcc:latest AS native-build
WORKDIR /src
COPY ../EngineMock/motor_engine.cpp .
COPY ../EngineMock/motor_engine.hpp .
RUN g++ -shared -fPIC -o libmotor_engine.so motor_engine.cpp

# --- Final runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
COPY --from=build /app/MotorServer/motors.db ./motors.db
COPY --from=native-build /src/libmotor_engine.so .
COPY Server/MotorServer/appsettings.json ./appsettings.json
COPY Server/MotorServer/appsettings.Development.json ./appsettings.Development.json

# Run app on port 5001
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001

ENTRYPOINT ["dotnet", "MotorServer.dll"]
