using System.Text.Json;
using Job_worker.Shared.Models;

namespace Job_worker.Shared.Services.Posts
{
    public class RedditService(HttpClient http) : IRedditService
    {
        public async Task<IEnumerable<RedditPostDto>> GetUserPostsAsync(string username, int limit = 10)
        {
            // Reddit JSON endpoint
            var url = $"https://www.reddit.com/user/{username}/submitted.json?limit={limit}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.UserAgent.ParseAdd("JobWorkerBot/1.0");

            var response = await http.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to fetch Reddit feed");

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var posts = doc.RootElement
                .GetProperty("data")
                .GetProperty("children")
                .EnumerateArray()
                .Select(child => new RedditPostDto
                {
                    Id = child.GetProperty("data").GetProperty("id").GetString() ?? string.Empty,
                    Title = child.GetProperty("data").GetProperty("title").GetString() ?? string.Empty,
                    Url = child.GetProperty("data").GetProperty("url").GetString() ?? string.Empty,
                    Permalink = "https://reddit.com" + child.GetProperty("data").GetProperty("permalink").GetString(),
                    Author = child.GetProperty("data").GetProperty("author").GetString() ?? string.Empty,
                    Ups = child.GetProperty("data").GetProperty("ups").GetInt32(),
                    NumComments = child.GetProperty("data").GetProperty("num_comments").GetInt32()
                })
                .ToList();

            return posts;
        }
    }
}