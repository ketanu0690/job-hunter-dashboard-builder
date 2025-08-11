namespace Job_worker.Features.IdeaAnalysis.Models.Dtos
{
    public class Niches
    {
        public record NodeMetadata(
        string Description,
        List<string> Tags,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        bool IsNew,
        bool IsDeleted
    );

        public record EdgeMetadata(
            DateTime CreatedAt,
            DateTime UpdatedAt,
            bool IsNew,
            bool IsDeleted
        );

        public record Node(
            string Id,
            string Label,
            string Type, // "idea" | "niche" | "subniche" | "micro"
            NodeMetadata Metadata,
            int SnapshotVersion,
            string? ParentId
        );

        public record Edge(
            string Id,
            string Source,
            string Target,
            EdgeMetadata Metadata,
            int SnapshotVersion
        );

        public record NicheData(
            List<Node> Nodes,
            List<Edge> Edges
        );
    }
}
