using Job_worker.Shared.Models;

namespace Job_worker.Shared.Services.Posts
{
    public interface IRedditService
    {
        Task<IEnumerable<RedditPostDto>> GetUserPostsAsync(string username, int limit = 10);

    }
}
