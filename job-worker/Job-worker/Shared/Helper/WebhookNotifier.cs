namespace Job_worker.Shared.Helper
{
    public static class WebhookNotifier
    {
        public static async Task NotifyAsync(string url, object data)
        {
            try
            {
                using var httpClient = new HttpClient();
                await httpClient.PostAsJsonAsync(url, data);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send webhook callback: {ex.Message}");
            }
        }
    }

}
