// ========================================================================
// CONSOLIDATED MOTOR SERVER PROGRAM
// Real Industrial Motor Physics Engine Backend
// Supports both localhost and production (Render)
// ========================================================================

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using MotorServer.Data;
using MotorServer.Services;
using MotorServer.Hubs;
using MotorServer; // For SeedDatabase
using Npgsql;
using DotNetEnv;

// --- Top-level code starts here ---

// Check if seed command is requested
if (args.Length > 0 && args[0].Equals("seed", StringComparison.OrdinalIgnoreCase))
{
    await SeedDatabase.RunSeedAsync(args);
    return;
}

// Load .env file if it exists (for local development)
var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath))
{
    Console.WriteLine($"📄 Loading environment variables from: {envPath}");
    Env.Load(envPath);
    Console.WriteLine("✅ .env file loaded successfully");
}
else
{
    Console.WriteLine($"⚠️  No .env file found at: {envPath}");
    Console.WriteLine("💡 Using environment variables from system/hosting platform");
}

var builder = WebApplication.CreateBuilder(args);

// ========================================================================
// SERVICES CONFIGURATION
// ========================================================================

Console.WriteLine("🚀 Starting database configuration...");

// Add Entity Framework with PostgreSQL ONLY
// Check if PostgreSQL connection string is provided
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
Console.WriteLine($"🔍 DATABASE_URL from environment: {(string.IsNullOrEmpty(databaseUrl) ? "NOT SET" : "FOUND")}");

if (string.IsNullOrEmpty(databaseUrl))
{
    Console.WriteLine("❌ ERROR: DATABASE_URL environment variable is required!");
    Console.WriteLine("💡 Please set DATABASE_URL in your .env file or environment variables");
    throw new InvalidOperationException("DATABASE_URL environment variable is required");
}

// Parse PostgreSQL connection string manually to avoid NpgsqlConnectionStringBuilder corruption
// Format: postgresql://username:password@host:port/database?params
Console.WriteLine($"🔍 Parsing connection string (length: {databaseUrl.Length})");

try
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    var username = userInfo[0];
    var password = userInfo.Length > 1 ? userInfo[1] : "";
    var host = uri.Host;
    var port = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');
    
    // Parse query parameters
    var queryParams = new Dictionary<string, string>();
    if (!string.IsNullOrEmpty(uri.Query))
    {
        var query = uri.Query.TrimStart('?');
        foreach (var param in query.Split('&'))
        {
            var parts = param.Split('=');
            if (parts.Length == 2)
            {
                queryParams[parts[0]] = parts[1];
            }
        }
    }
    
    // Build Npgsql connection string using proper parameter format
    // Check if SSL is required from connection string parameters
    var requireSsl = queryParams.ContainsKey("sslmode") && 
                     (queryParams["sslmode"].Equals("require", StringComparison.OrdinalIgnoreCase) ||
                      queryParams["sslmode"].Equals("prefer", StringComparison.OrdinalIgnoreCase));
    
    var npgsqlBuilder = new NpgsqlConnectionStringBuilder
    {
        Host = host,
        Port = port,
        Username = username,
        Password = password,
        Database = database,
        SslMode = requireSsl ? SslMode.Require : SslMode.Disable,
        Pooling = true,
        MinPoolSize = 1,
        MaxPoolSize = 20,
        ConnectionLifetime = 300,
        Timeout = 30,
        CommandTimeout = 30
    };
    
    var connectionString = npgsqlBuilder.ConnectionString;
    
    Console.WriteLine($"✅ Successfully parsed connection string:");
    Console.WriteLine($"   Host: {host}:{port}");
    Console.WriteLine($"   Database: {database}");
    Console.WriteLine($"   Username: {username}");
    Console.WriteLine($"   SSL Mode: {(requireSsl ? "Require" : "Disable")}");
    
    Console.WriteLine("🐘 Configuring PostgreSQL database with Entity Framework");
    
    builder.Services.AddDbContext<AppDbContext>(opt =>
    {
        opt.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorCodesToAdd: null);
            npgsqlOptions.CommandTimeout(30);
        });
        opt.EnableSensitiveDataLogging(false);
        opt.EnableDetailedErrors(true);
    });
    
    Console.WriteLine("✅ Database context configured successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Failed to parse DATABASE_URL: {ex.Message}");
    Console.WriteLine($"📋 Connection string format should be: postgresql://username:password@host:port/database?sslmode=require");
    throw;
}

// Add SignalR with optimized settings for production
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.HandshakeTimeout = TimeSpan.FromSeconds(15);
});

// Add consolidated Engine Service
builder.Services.AddScoped<EngineService>();

// Configure CORS for both localhost and production
var allowedOrigins = new[] {
    "http://localhost:5173",
    "https://motor-speed-temperature.netlify.app",
    "https://motor-speed-temperature.netlify.app/",
    "https://embedded-motor-engine-speed-temperature.onrender.com",
    Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://your-frontend.onrender.com"
};

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyHeader().AllowAnyMethod()
         .AllowCredentials()));

// Add controllers with JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new MotorServer.DateTimeUtcConverter());
    });

// Add OpenAPI/Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// ========================================================================
// APPLICATION BUILDING
// ========================================================================

var app = builder.Build();

// ========================================================================
// MIDDLEWARE CONFIGURATION
// ========================================================================

// Enable Swagger UI for both development and production
app.UseSwagger();
app.UseSwaggerUI();

// Use CORS before authentication/authorization
app.UseCors();

// Add CORS debugging
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request from origin: {context.Request.Headers.Origin}");
    Console.WriteLine($"Request method: {context.Request.Method}");
    Console.WriteLine($"Request path: {context.Request.Path}");
    await next();
});

// Add authentication/authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// ========================================================================
// ROUTING CONFIGURATION
// ========================================================================

// Add a default endpoint for '/'
app.MapGet("/", () => Results.Content("MotorServer API is running!", "text/plain"));

// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", time = DateTime.UtcNow }));

// Map controllers
app.MapControllers();

// Map SignalR hub for real-time motor data
app.MapHub<MotorHub>("/motorHub");

// ========================================================================
// DATABASE INITIALIZATION
// ========================================================================

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();
        Console.WriteLine("✅ Database initialized successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database initialization failed: {ex.Message}");
    }
}

// ========================================================================
// STARTUP INFORMATION
// ========================================================================

Console.WriteLine("🚀 Real Industrial Motor Physics Engine Backend Starting...");
var engineLibrary = OperatingSystem.IsWindows() ? "motor_engine.dll" 
    : OperatingSystem.IsMacOS() ? "motor_engine.dylib" 
    : "motor_engine.so";
Console.WriteLine($"📊 C++ Engine: {engineLibrary}");
Console.WriteLine("🗄️  Database: PostgreSQL (NeonDB)");
Console.WriteLine("🔄 SignalR: Real-time motor data updates");
Console.WriteLine("🌐 CORS: Enabled for localhost and production");
Console.WriteLine("📡 API Endpoints: /api/motor/*");
Console.WriteLine("🔌 SignalR Hub: /motorHub");
Console.WriteLine($"🌍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔗 Allowed Origins: {string.Join(", ", allowedOrigins)}");

// ========================================================================
// APPLICATION RUN
// ========================================================================

app.Run();

