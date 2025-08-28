import { useSubredditPosts } from "../../services/redditService";


export default function RedditFeed() {
  const { data: posts, isLoading, error } = useSubredditPosts("reactjs", "hot", 5);

  if (isLoading) return <p>Loading subreddit...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <ul className="space-y-3">
      {posts?.map((p) => (
        <li key={p.id}>
          <a href={p.permalink} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
            {p.title}
          </a>
          <div className="text-sm text-gray-500">by {p.author} • {p.ups} upvotes</div>
        </li>
      ))}
    </ul>
  );
}
