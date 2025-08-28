using FastEndpoints;
using Job_worker.Shared.ApiResponses;
using Job_worker.Shared.Models;
using Job_worker.Shared.Services.Posts;

namespace Job_worker.Features.Kblog.Endpoints
{
    public class GetMediumPostsByUserIdEndpoint(
        IMediumService mediumService,
        ILogger<GetMediumPostsByUserIdEndpoint> logger)
        : Endpoint<GetMediumPostsByUserIdRequest, ICoreApiResponse>
    {
        public override void Configure()
        {
            Get("/api/medium/{UserId}");
            AllowAnonymous();
        }

        public override async Task<ICoreApiResponse> ExecuteAsync(GetMediumPostsByUserIdRequest req, CancellationToken ct)
        {
            try
            {
                logger.LogInformation("Fetching Medium posts for user {UserId}", req.UserId);

                var posts = await mediumService.GetPostsByUserIdAsync(req.UserId);

                return CoreApiResponse<IEnumerable<MediumPostDto>>.Ok(
                    SuccessStatusCode.Ok,
                    posts,
                    "Successfully fetched Medium user posts"
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching Medium posts for user {UserId}", req.UserId);

                return CoreApiResponse.Reject(
                    ClientErrorStatusCode.InternalServerError,
                    "An error occurred while fetching Medium user posts"
                );
            }
        }
    }

    public class GetMediumPostsByUserIdRequest
    {
        public string UserId { get; set; } = default!;
    }
}