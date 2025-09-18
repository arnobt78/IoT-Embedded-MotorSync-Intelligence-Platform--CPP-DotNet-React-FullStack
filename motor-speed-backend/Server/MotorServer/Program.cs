
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using MotorServer.Data;
using MotorServer.Hubs;
using MotorServer.Services;


// ...existing code...

// --- Top-level code starts here ---
// --- Top-level code starts here ---
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=motors.db"));
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.HandshakeTimeout = TimeSpan.FromSeconds(15);
});
builder.Services.AddScoped<EngineService>();
builder.Services.AddScoped<PredictiveMaintenanceService>();
var allowedOrigins = new[] {
    "http://localhost:5173",
    "https://motor-speed-temperature.netlify.app",
    Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://your-frontend.onrender.com"
};
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyHeader().AllowAnyMethod()
         .AllowCredentials()));
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

// Build app
var app = builder.Build();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// Use CORS before authentication/authorization
app.UseCors();

// Add authentication/authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Add a default endpoint for '/'
app.MapGet("/", () => Results.Content("MotorServer API is running!", "text/plain"));

// Map endpoints
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", time = DateTime.UtcNow }));
app.MapControllers();
app.MapHub<MotorHub>("/motorHub");

app.Run();
