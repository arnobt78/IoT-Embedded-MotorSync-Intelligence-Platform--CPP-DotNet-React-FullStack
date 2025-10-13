// ========================================================================
// CONSOLIDATED MOTOR SERVER PROGRAM
// Real Industrial Motor Physics Engine Backend
// Supports both localhost and production (Render)
// ========================================================================

using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MotorServer.Data;
using MotorServer.Services;
using MotorServer.Hubs;
using Npgsql;

// --- Top-level code starts here ---
var builder = WebApplication.CreateBuilder(args);

// ========================================================================
// SERVICES CONFIGURATION
// ========================================================================

Console.WriteLine("🚀 Starting database configuration...");

// Add Entity Framework with SQLite or PostgreSQL
// Check if PostgreSQL connection string is provided (for production with NeonDB)
var postgresConnection = Environment.GetEnvironmentVariable("DATABASE_URL");
Console.WriteLine($"🔍 Raw DATABASE_URL from environment: {(string.IsNullOrEmpty(postgresConnection) ? "NULL/EMPTY" : "FOUND")}");

// Debug: Let's also check ALL environment variables
Console.WriteLine("🔍 All environment variables containing 'DATABASE':");
foreach (var envVar in Environment.GetEnvironmentVariables().Keys.Cast<string>().Where(k => k.ToUpper().Contains("DATABASE")))
{
    var value = Environment.GetEnvironmentVariable(envVar);
    Console.WriteLine($"  {envVar} = {(string.IsNullOrEmpty(value) ? "NULL" : $"{value.Substring(0, Math.Min(20, value.Length))}...")}");
}
Console.WriteLine($"🔍 DATABASE_URL environment variable: {(string.IsNullOrEmpty(postgresConnection) ? "NOT SET" : "SET")}");
if (!string.IsNullOrEmpty(postgresConnection))
{
    Console.WriteLine($"🔍 Connection string length: {postgresConnection.Length} characters");
    Console.WriteLine($"🔍 Connection string preview: {postgresConnection.Substring(0, Math.Min(50, postgresConnection.Length))}...");
    Console.WriteLine($"🔍 Connection string ends with: ...{postgresConnection.Substring(Math.Max(0, postgresConnection.Length - 20))}");
    
    // Fix: Ensure the connection string is properly formatted
    // Sometimes environment variables get truncated, malformed, or case-changed
    var cleanConnectionString = postgresConnection.Trim();
    
    // Fix case sensitivity issues in password (some systems lowercase env vars)
    if (cleanConnectionString.Contains("npg_kq8giictef2d"))
    {
        cleanConnectionString = cleanConnectionString.Replace("npg_kq8giictef2d", "npg_Kq8giIcTEf2D");
        Console.WriteLine($"🔧 Fixed connection string - corrected password case");
    }
    
    // Additional check for any lowercase password variations
    var passwordPattern = @"npg_[a-z0-9]+";
    var match = System.Text.RegularExpressions.Regex.Match(cleanConnectionString, passwordPattern);
    if (match.Success && match.Value != "npg_Kq8giIcTEf2D")
    {
        cleanConnectionString = cleanConnectionString.Replace(match.Value, "npg_Kq8giIcTEf2D");
        Console.WriteLine($"🔧 Fixed connection string - corrected password from {match.Value} to npg_Kq8giIcTEf2D");
    }
    
    // Ensure proper SSL and channel binding parameters
    if (!cleanConnectionString.Contains("channel_binding"))
    {
        if (cleanConnectionString.EndsWith("?sslmode=require"))
        {
            cleanConnectionString += "&channel_binding=require";
            Console.WriteLine($"🔧 Fixed connection string - added channel_binding=require");
        }
        else if (cleanConnectionString.Contains("?sslmode=require"))
        {
            cleanConnectionString += "&channel_binding=require";
            Console.WriteLine($"🔧 Fixed connection string - added channel_binding=require");
        }
    }
    
    if (!cleanConnectionString.EndsWith("=require"))
    {
        // If it's missing the =require part, add it
        if (cleanConnectionString.EndsWith("?sslmode"))
        {
            cleanConnectionString += "=require";
            Console.WriteLine($"🔧 Fixed connection string - added missing =require");
        }
        else if (!cleanConnectionString.Contains("sslmode"))
        {
            // If sslmode is completely missing, add it
            cleanConnectionString += "?sslmode=require&channel_binding=require";
            Console.WriteLine($"🔧 Fixed connection string - added sslmode=require&channel_binding=require");
        }
    }
    
    Console.WriteLine($"🔍 Final connection string ends with: ...{cleanConnectionString.Substring(Math.Max(0, cleanConnectionString.Length - 20))}");
    
    // Use PostgreSQL (NeonDB or other provider)
    Console.WriteLine("🐘 Using PostgreSQL database");
    
    // Final verification before passing to EF Core
    Console.WriteLine($"🔍 Final connection string being passed to EF Core:");
    Console.WriteLine($"  Length: {cleanConnectionString.Length}");
    Console.WriteLine($"  Ends with: ...{cleanConnectionString.Substring(Math.Max(0, cleanConnectionString.Length - 30))}");
    
    // Skip NpgsqlConnectionStringBuilder - it's corrupting our connection string!
    Console.WriteLine("🔧 Using direct connection string (bypassing NpgsqlConnectionStringBuilder)");
    
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseNpgsql(cleanConnectionString));
}
else
{
    // Use SQLite with persistent disk path if available (Render), otherwise use local path
    var dbPath = Environment.GetEnvironmentVariable("DB_PATH") ?? "motors.db";
    var connectionString = $"Data Source={dbPath}";
    Console.WriteLine($"📁 Using SQLite database: {dbPath}");
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlite(connectionString));
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
Console.WriteLine("🗄️  Database: SQLite (motors.db)");
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

