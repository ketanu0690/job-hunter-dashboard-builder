using System.Threading.Channels;
using FastEndpoints;
using FastEndpoints.Security;
using Job_worker.Features.LinkedinApply.Automation;
using Job_worker.Shared.Models;
using Job_worker.Shared.Services.Gemini;

var builder = WebApplication.CreateBuilder(args);

// Add FastEndpoints services (handles your API endpoints)
builder.Services.AddFastEndpoints();

// Register job channel before building the app
var jobChannel = Channel.CreateUnbounded<AutomationJob>();
builder.Services.AddSingleton(jobChannel);

// Register background worker and services
builder.Services.AddHostedService<LinkedinJobWorker>();
builder.Services.AddScoped<LinkedinEasyApplyAutomationService>();
builder.Services.AddSingleton<IGeminiService, GeminiService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:8080",
                "https://your-frontend-domain.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add Authentication & Authorization (using Supabase JWT)
builder.Services.AddAuthenticationJwtBearer(options =>
{
    var jwtSecret = builder.Configuration["Supabase:JwtSecret"];

    if (string.IsNullOrWhiteSpace(jwtSecret))
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("⚠ Supabase:JwtSecret is MISSING from configuration!");
        Console.ResetColor();
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"✅ Supabase JWT Secret loaded: {jwtSecret.Substring(0, 6)}... (hidden)");
        Console.ResetColor();
    }

    options.SigningKey = jwtSecret;

});

builder.Services.AddAuthorization();

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Job Worker API",
        Version = "v1"
    });
});

var app = builder.Build();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Job Worker API v1");
});

app.UseHttpsRedirection();

// 🔹 CORS must come before endpoints
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapFastEndpoints();

app.Run();
