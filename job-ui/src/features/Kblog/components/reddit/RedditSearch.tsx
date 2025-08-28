import { useRedditSearch } from "../../services/redditService";

export default function RedditSearch({ query }: { query: string }) {
  const { data: results, isLoading } = useRedditSearch(query);

  if (isLoading) return <p>Searching Reddit...</p>;

  return (
    <div>
      {results?.map((post) => (
        <div key={post.id} className="mb-3">
          <a
            href={post.permalink}
            target="_blank"
            className="text-blue-600 font-medium hover:underline"
          >
            {post.title}
          </a>
          <div className="text-xs text-gray-500">r/{post.author}</div>
        </div>
      ))}
    </div>
  );
}
