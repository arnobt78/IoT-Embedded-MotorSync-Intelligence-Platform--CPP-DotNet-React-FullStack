// ========================================================================
// CONSOLIDATED MOTOR SERVER PROGRAM
// Real Industrial Motor Physics Engine Backend
// Supports both localhost and production (Render)
// ========================================================================

using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using MotorServer.Data;
using MotorServer.Services;
using MotorServer.Hubs;

// --- Top-level code starts here ---
var builder = WebApplication.CreateBuilder(args);

// ========================================================================
// SERVICES CONFIGURATION
// ========================================================================

// Add Entity Framework with SQLite
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=motors.db"));

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
Console.WriteLine("📊 C++ Engine: motor_engine.dylib");
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

