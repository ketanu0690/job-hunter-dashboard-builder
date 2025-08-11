namespace Job_worker.Shared.Services.Gemini
{
    public interface IGeminiService
    {
        Task<string> GenerateContentWithSdkAsync(string prompt, CancellationToken ct);
    }
}
