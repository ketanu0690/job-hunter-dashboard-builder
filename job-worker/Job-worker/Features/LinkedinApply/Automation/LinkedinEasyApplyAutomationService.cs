using Job_worker.Features.LinkedinApply.Config;
using Job_worker.Models;
using Job_worker.Shared.Helper;

namespace Job_worker.Features.LinkedinApply.Automation
{
    public class LinkedinEasyApplyAutomationService
    {
        private readonly ILogger<LinkedinEasyApplyAutomationService> _logger;

        public LinkedinEasyApplyAutomationService(ILogger<LinkedinEasyApplyAutomationService> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task StartAutomationAsync(StartJobRequest request)
        {
            await WebhookNotifier.NotifyAsync(request.CallbackUrl, new { status = "started" });

            try
            {
                var config = ConfigLoader.LoadConfig(request.ConfigPath);
                if (config == null)
                {
                    const string errorMessage = "Config file could not be loaded properly.";
                    _logger.LogError(errorMessage);
                    throw new InvalidOperationException(errorMessage);
                }

                // Use 'using' to ensure browser is disposed
                using var browser = SeleniumHelper.InitBrowser(config.HeadlessMode);

                var bot = new LinkedinEasyApply(config, browser);

                bot.Login();
                bot.SecurityCheck();
                bot.StartApplying();

                await WebhookNotifier.NotifyAsync(request.CallbackUrl, new { status = "completed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during the automation process.");

                await WebhookNotifier.NotifyAsync(request.CallbackUrl, new
                {
                    status = "failed",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}
