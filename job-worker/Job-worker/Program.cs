using FastEndpoints;
using Job_worker.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add FastEndpoints services (handles your API endpoints)
builder.Services.AddFastEndpoints();

builder.Services.AddApplicationServices(builder.Configuration);

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "KetanOne Worker API",
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
