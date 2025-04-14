using System.Threading.Channels;
using FastEndpoints;
using Job_worker.Features.LinkedinApply.Automation;
using Job_worker.Models;

var builder = WebApplication.CreateBuilder(args);

// Add FastEndpoints services (this handles endpoints for your API)
builder.Services.AddFastEndpoints();

// Register job channel before building the app
var jobChannel = Channel.CreateUnbounded<AutomationJob>();
builder.Services.AddSingleton(jobChannel);

// Register background worker and services
builder.Services.AddHostedService<LinkedinJobWorker>();
builder.Services.AddScoped<LinkedinEasyApplyAutomationService>();

// Add Authorization services
builder.Services.AddAuthorization();  // <-- Add this line

// Add Swagger for FastEndpoints
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Job Worker API", Version = "v1" });
});

var app = builder.Build();

// Enable Swagger UI for FastEndpoints
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Job Worker API v1");
});

// Map FastEndpoints (maps your FastEndpoints to the app)
app.MapFastEndpoints();

// Middlewares
app.UseHttpsRedirection();
app.UseAuthorization();  // <-- Authorization middleware should be used after AddAuthorization()

app.Run();