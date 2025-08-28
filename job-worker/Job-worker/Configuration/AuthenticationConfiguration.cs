using FastEndpoints.Security;

namespace Job_worker.Configuration
{
    public static class AuthenticationConfiguration
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSecret = configuration["Supabase:JwtSecret"];

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

            services.AddAuthenticationJwtBearer(options =>
            {
                options.SigningKey = jwtSecret; // 🔑 Required for validation
            });

            return services;
        }
    }
}
