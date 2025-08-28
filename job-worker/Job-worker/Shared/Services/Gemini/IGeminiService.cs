using System.Runtime.CompilerServices;

namespace Job_worker.Shared.Services.Gemini
{
    public interface IGeminiService
    {
        Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default);

        IAsyncEnumerable<string> GenerateContentStreamAsync(
            string prompt,
            [EnumeratorCancellation] CancellationToken ct = default);
    }
}
