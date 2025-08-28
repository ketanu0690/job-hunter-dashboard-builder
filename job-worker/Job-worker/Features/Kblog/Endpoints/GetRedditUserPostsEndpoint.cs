using FastEndpoints;
using Job_worker.Shared.ApiResponses;
using Job_worker.Shared.Models;
using Job_worker.Shared.Services.Posts;

namespace Job_worker.Features.Kblog.Endpoints
{
    public class GetRedditUserPostsEndpoint(IRedditService redditService, ILogger<GetRedditUserPostsEndpoint> logger)
        : Endpoint<GetRedditUserPostsRequest, ICoreApiResponse>
    {
        public override void Configure()
        {
            Get("/api/reddit/{Username}");
            AllowAnonymous();
        }

        public override async Task<ICoreApiResponse> ExecuteAsync(GetRedditUserPostsRequest req, CancellationToken ct)
        {
            try
            {
                logger.LogInformation("Fetching Reddit posts for user {Username}", req.Username);

                var posts = await redditService.GetUserPostsAsync(req.Username, req.Limit);

                return CoreApiResponse<IEnumerable<RedditPostDto>>.Ok(
                    SuccessStatusCode.Ok,
                    posts,
                    "Successfully fetched Reddit user posts"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching Reddit posts for user {Username}", req.Username);

                return CoreApiResponse.Reject(
                    ClientErrorStatusCode.InternalServerError,
                    "An error occurred while fetching Reddit user posts"
                );
            }
        }
    }

    public class GetRedditUserPostsRequest
    {
        public string Username { get; set; } = default!;
        public int Limit { get; set; } = 10;
    }
}