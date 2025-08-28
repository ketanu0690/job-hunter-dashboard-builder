namespace Job_worker.Shared.Models
{
    public class RedditPostDto
    {
        public string Id { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Url { get; set; } = default!;
        public string Permalink { get; set; } = default!;
        public string Author { get; set; } = default!;
        public int Ups { get; set; }
        public int NumComments { get; set; }
    }
}
