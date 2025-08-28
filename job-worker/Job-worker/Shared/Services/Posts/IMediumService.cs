using Job_worker.Shared.Models;

namespace Job_worker.Shared.Services.Posts
{
    public interface IMediumService
    {
        Task<IEnumerable<MediumPostDto>> GetPostsByUserIdAsync(string username);
    }
}
