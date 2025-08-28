using System.Text.Json;
using FastEndpoints;
using Job_worker.Shared.Services.Gemini;

namespace Job_worker.Features.IdeaAnalysis.Endpoints;

public class GetNichesByStreamTopicEndpoint(IGeminiService geminiService)
    : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("/idea-analysis/niches/stream");
        Roles("authenticated");
        Options(x => x.RequireCors(p => p.AllowAnyOrigin()));
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        try
        {
            var topic = Query<string>("topic");

            if (string.IsNullOrWhiteSpace(topic))
            {
                ThrowError("Topic is required.");
                return;
            }

            var prompt = $@"
                You are an expert niche strategist.

                Task:
                Given the topic '{topic}', generate niche ideas and stream them as SSE events.

                Format for each event:
                id: <incrementing number>
                event: niche-data
                data: {{
                    ""id"": string,
                    ""name"": string,
                    ""subNiches"": [string]
                }}

                Rules:
                - Stream one complete data per event.
                - Always follow SSE format strictly.
                - No Markdown, no commentary, no extra text.
            ";

            HttpContext?.Response?.Headers?.Add("Content-Type", "text/event-stream");
            HttpContext?.Response?.Headers?.Add("Cache-Control", "no-cache");
            HttpContext?.Response?.Headers?.Add("Connection", "keep-alive");

            Console.WriteLine("[Endpoint] Switching to Gemini streaming...");

            long id = 0;

            await foreach (var chunk in geminiService.GenerateContentStreamAsync(prompt, ct))
            {
                if (string.IsNullOrWhiteSpace(chunk)) continue;

                // Split multiple events in one chunk
                var events = chunk.Split("\n\n", StringSplitOptions.RemoveEmptyEntries);

                foreach (var evt in events)
                {
                    id++;

                    // Extract JSON from the data: line
                    var lines = evt.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                    var dataLine = lines.FirstOrDefault(l => l.StartsWith("data:"));
                    if (dataLine == null) continue;

                    var jsonPart = dataLine.Substring("data:".Length).Trim();

                    try
                    {
                        // Deserialize into strongly-typed object
                        var nicheData = JsonSerializer.Deserialize<SeeNicheData>(jsonPart, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (nicheData != null)
                        {
                            // Send formatted SSE payload
                            var ssePayload = $"id: {id}\nevent: niche-data\ndata: {JsonSerializer.Serialize(nicheData)}\n\n";
                            await HttpContext.Response.WriteAsync(ssePayload, ct);
                            await HttpContext.Response.Body.FlushAsync(ct);
                        }
                    }
                    catch (JsonException ex)
                    {
                        // Log and skip invalid JSON
                        Console.WriteLine($"[SSE] Skipped invalid JSON in chunk {id}: {ex.Message}");
                    }
                }
            }

            Console.WriteLine("[GeminiStream] ✅ Completed Gemini streaming.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GeminiService] ❌ Error: {ex}");
            throw;
        }
    }

    // Strongly-typed DTO for SSE data
    public class SeeNicheData
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public List<string> SubNiches { get; set; } = new();
    }
}
