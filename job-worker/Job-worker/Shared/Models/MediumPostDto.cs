namespace Job_worker.Shared.Models
{
    public class MediumPostDto
    {
        public string Title { get; set; } = default!;
        public string Link { get; set; } = default!;
        public string PubDate { get; set; } = default!;
        public string? Thumbnail { get; set; }
        public string? Enclosure { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ContentImage { get; set; } // First image from content
    }

}
