using System.Threading.Channels;
using Job_worker.Shared.Models;

namespace Job_worker.Features.LinkedinApply.Automation
{
    public class LinkedinJobWorker : BackgroundService
    {
        private readonly Channel<AutomationJob> _channel;
        private readonly IServiceProvider _serviceProvider;

        public LinkedinJobWorker(Channel<AutomationJob> channel, IServiceProvider serviceProvider)
        {
            _channel = channel;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await foreach (var job in _channel.Reader.ReadAllAsync(stoppingToken))
            {
                using var scope = _serviceProvider.CreateScope();
                var automationService = scope.ServiceProvider.GetRequiredService<LinkedinEasyApplyAutomationService>();
                await automationService.StartAutomationAsync(job.Request);
            }
        }
    }

}
