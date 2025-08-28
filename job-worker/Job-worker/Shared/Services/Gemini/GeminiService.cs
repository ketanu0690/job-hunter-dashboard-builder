using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using GenerativeAI;


namespace Job_worker.Shared.Services.Gemini
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _modelId = "gemini-1.5-pro";
        private readonly GoogleAi _googleAI;
        private readonly GenerativeModel _model;

        public GeminiService(IConfiguration config, HttpClient httpClient)
        {
            _apiKey = config["Gemini:ApiKey"]
                ?? throw new InvalidOperationException("Gemini API key not configured.");
            _httpClient = httpClient;
            _googleAI = new GoogleAi(_apiKey);
            _model = _googleAI.CreateGenerativeModel(_modelId);
        }

        /// <summary>
        /// Try streaming Gemini response, fallback to non-streaming if needed.
        /// Uses in-memory cache for repeated prompts.
        /// </summary>
        public async Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default)
        {

            // ⏳ Fallback to normal non-streaming call
            var response = await TryNonStreamingAsync(prompt, ct);
            return response;
        }
        private async Task<string> TryNonStreamingAsync(string prompt, CancellationToken ct)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_modelId}:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        role = "user",
                        parts = new[] { new { text = prompt } }

                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            using var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            using var response = await _httpClient.SendAsync(request, ct);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(responseJson);
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return text ?? string.Empty;
        }


        /// <summary>
        /// Generate content using Gemini with streaming (yields partial text chunks).
        /// </summary>

        public async IAsyncEnumerable<string> GenerateContentStreamAsync(
            string prompt,
            [EnumeratorCancellation] CancellationToken ct = default)
        {
            Console.WriteLine($"[GeminiService] Model: {_model}");
            Console.WriteLine($"[GeminiService] API Key prefix: {_apiKey?.Substring(0, 6)}...");
            Console.WriteLine($"[GeminiService] Prompt: {prompt}");

            var responseStream = _model.StreamContentAsync(prompt, ct);

            await foreach (var resp in responseStream.WithCancellation(ct))
            {
                var text = resp.Text();
                if (!string.IsNullOrEmpty(text))
                {
                    yield return text;
                }
            }

            Console.WriteLine("[Gemini] ✅ Streaming finished");
        }

    }
}
