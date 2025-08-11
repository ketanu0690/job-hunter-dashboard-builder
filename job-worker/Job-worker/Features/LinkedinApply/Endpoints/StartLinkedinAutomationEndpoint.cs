using FastEndpoints;
using Job_worker.Features.LinkedinApply.Automation;
using Job_worker.Shared.Models;

namespace Job_worker.Features.LinkedinApply.Endpoints
{
    public class StartLinkedinAutomationEndpoint : Endpoint<StartJobRequest>
    {
        private readonly LinkedinEasyApplyAutomationService _automationService;
        private readonly ILogger<StartLinkedinAutomationEndpoint> _logger;

        public StartLinkedinAutomationEndpoint(
            LinkedinEasyApplyAutomationService automationService,
            ILogger<StartLinkedinAutomationEndpoint> logger)
        {
            _automationService = automationService;
            _logger = logger;
        }

        public override void Configure()
        {
            Post("/webhook/linkedin/start");
            AllowAnonymous(); // Consider adding authentication later
        }

        public override async Task HandleAsync(StartJobRequest req, CancellationToken ct)
        {
            try
            {
                _logger.LogInformation("Received LinkedIn automation request for: {ConfigPath}", req.ConfigPath);

                await _automationService.StartAutomationAsync(req);

                await Send.OkAsync(new
                {
                    success = true,
                    message = "Automation started successfully."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while starting LinkedIn automation.");

                await Send.OkAsync(new
                {
                    success = false,
                    message = "An error occurred while starting the automation.",
                    errorDetails = ex.Message
                });
            }
        }
    }
}