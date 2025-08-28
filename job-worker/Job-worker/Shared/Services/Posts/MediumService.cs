using System.Text.Json;
using Job_worker.Shared.Models;
namespace Job_worker.Shared.Services.Posts
{


    public class MediumService(HttpClient http) : IMediumService
    {
        public async Task<IEnumerable<MediumPostDto>> GetPostsByUserIdAsync(string username)
        {
            var rssUrl = $"https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@{username}";
            var response = await http.GetAsync(rssUrl);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to fetch Medium feed");

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var items = doc.RootElement.GetProperty("items")
                .EnumerateArray()
                .Select(item =>
                {
                    var thumbnail = item.TryGetProperty("thumbnail", out var thumbProp)
                        ? thumbProp.GetString()
                        : null;

                    var enclosure = item.TryGetProperty("enclosure", out var encProp) &&
                                    encProp.TryGetProperty("link", out var encLink)
                        ? encLink.GetString()
                        : null;

                    // Extract first image from content HTML if available
                    var content = item.GetProperty("content").GetString() ?? string.Empty;
                    var contentImage = System.Text.RegularExpressions.Regex
                        .Match(content, "<img[^>]+src=[\"']([^\"'>]+)[\"']")
                        .Groups[1].Value;

                    return new MediumPostDto
                    {
                        Title = item.GetProperty("title").GetString() ?? string.Empty,
                        Link = item.GetProperty("link").GetString() ?? string.Empty,
                        PubDate = item.GetProperty("pubDate").GetString() ?? string.Empty,
                        Thumbnail = thumbnail,
                        Enclosure = enclosure,
                        Content = content,
                        ContentImage = !string.IsNullOrEmpty(contentImage) ? contentImage : null

                    };
                });

            return items;
        }
    }

}
