using System.Runtime.CompilerServices;
using Mscc.GenerativeAI;

namespace Job_worker.Shared.Services.Gemini
{
    public class GeminiService : IGeminiService
    {
        private readonly GoogleAI _googleAI;
        private readonly string _apiKey;
        private readonly GenerativeModel _model;

        public GeminiService(IConfiguration config)
        {
            _apiKey = config["Gemini:ApiKey"]
                ?? throw new InvalidOperationException("Gemini API key not configured.");
            _googleAI = new GoogleAI(_apiKey);
            _model = _googleAI.GenerativeModel(Model.Gemini15Pro);
        }

        /// <summary>
        /// Generate content using the Google GenerativeAI SDK with streaming.
        /// Yields partial chunks as they arrive.
        /// </summary>
        public async IAsyncEnumerable<string> GenerateContentStreamAsync(
            string prompt,
            [EnumeratorCancellation] CancellationToken ct)
        {
            await foreach (var chunk in _model.GenerateContentStreamAsync(prompt, cancellationToken: ct))
            {
                var text = chunk.Text();
                if (!string.IsNullOrEmpty(text))
                {
                    yield return text; // Send partial piece to caller
                }
            }
        }

        /// <summary>
        /// Generate the full content in one go, not streamed.
        /// Useful when streaming is not needed or supported.
        /// </summary>
        public async Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default)
        {
            var response = await _model.GenerateContentAsync(prompt, cancellationToken: ct);
            var fullText = response.Text();

            if (string.IsNullOrEmpty(fullText))
            {
                throw new InvalidOperationException("Received empty response from Gemini model.");
            }

            return fullText;
        }
    }
}
