using System.Text.Json;
using System.Text.RegularExpressions;
using FastEndpoints;
using Job_worker.Shared.Services.Gemini;
using static Job_worker.Features.IdeaAnalysis.Models.Dtos.Niches;

namespace Job_worker.Features.IdeaAnalysis.Endpoints
{
    public class GetNichesByTopicEndpoint : Endpoint<GetNichesByTopicRequest, NicheData>
    {
        private readonly IGeminiService _geminiService;

        public GetNichesByTopicEndpoint(IGeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        public override void Configure()
        {
            Post("/idea-analysis/niches");
            Roles("authenticated");
            Summary(s =>
            {
                s.Summary = "Get niche suggestions for a given topic using Gemini AI.";
                s.Description = "Calls Gemini AI to analyze a topic and return structured niche data.";
            });
        }

        public override async Task HandleAsync(GetNichesByTopicRequest req, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(req.Topic))
            {
                ThrowError("Topic is required.");
                return;
            }

            var prompt = $@"Task:Given topic '{req.Topic}', identify niche→subniche→micro levels and output ONLY valid JSON for:record NodeMetadata(string Description,List<string> Tags,DateTime CreatedAt,DateTime UpdatedAt,bool IsNew,bool IsDeleted);record EdgeMetadata(DateTime CreatedAt,DateTime UpdatedAt,bool IsNew,bool IsDeleted);record Node(string Id,string Label,string Type,NodeMetadata Metadata,int SnapshotVersion,string? ParentId);record Edge(string Id,string Source,string Target,EdgeMetadata Metadata,int SnapshotVersion);record NicheData(List<Node> Nodes,List<Edge> Edges);Persona:Expert niche strategist;Rules:Be specific, relevant, ordered by importance, use ISO 8601 UTC dates, no extra text.";

            var geminiRaw = await _geminiService.GenerateContentWithSdkAsync(prompt, ct);

            var extractedData = ExtractJsonFromGemini<NicheData>(geminiRaw);


            await Send.OkAsync(extractedData, cancellation: ct);
        }

        private static T ExtractJsonFromGemini<T>(string textContent)
        {
            if (string.IsNullOrWhiteSpace(textContent))
                throw new InvalidOperationException("Gemini returned empty text content.");

            // Remove markdown code fences if present
            textContent = Regex.Replace(textContent, "```(?:json)?|```", string.Empty).Trim();

            // Try to parse as JSON
            try
            {
                return JsonSerializer.Deserialize<T>(textContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? throw new InvalidOperationException("Failed to parse JSON into target type.");
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException("Invalid JSON returned by Gemini.", ex);
            }
        }

    }

    public class GetNichesByTopicRequest
    {
        public string Topic { get; set; } = string.Empty;
    }
}
