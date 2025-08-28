using System.Threading.Channels;
using Job_worker.Features.LinkedinApply.Automation;
using Job_worker.Shared.Models;
using Job_worker.Shared.Services.Gemini;
using Job_worker.Shared.Services.Posts;

namespace Job_worker.Configuration
{
    public static class ApplicationConfiguration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // ✅ Authentication + Authorization
            services.AddJwtAuthentication(configuration);
            services.AddAuthorization();

            // ✅ CORS
            services.AddApplicationCors();

            // ✅ Background job channel
            var jobChannel = Channel.CreateUnbounded<AutomationJob>();
            services.AddSingleton(jobChannel);

            // ✅ Workers
            services.AddHostedService<LinkedinJobWorker>();

            // ✅ Domain services
            services.AddScoped<LinkedinEasyApplyAutomationService>();

            // ✅ External API clients
            services.AddHttpClient<IGeminiService, GeminiService>();
            services.AddHttpClient<IMediumService, MediumService>();
            services.AddHttpClient<IRedditService, RedditService>();

            return services;
        }

        public static IServiceCollection AddApplicationCors(this IServiceCollection services)
        {
            services.AddCors(options =>
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
                        .AllowAnyMethod()
                        .WithHeaders("Content-Type", "Authorization")
                        .AllowCredentials()

                        // ⚠ DEV ONLY - allows *any* origin
                        .SetIsOriginAllowed(_ => true);
                });
            });

            return services;
        }
    }
}
