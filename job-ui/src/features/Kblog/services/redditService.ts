import { CoreApiResponse } from "@/shared/types/APIResponse";
import { APIHelper } from "@/shared/utils/axios";
import { useQuery } from "@tanstack/react-query";

// ---------- Types ----------
export interface RedditPost {
  id: string; //
  title: string; //
  url: string; //
  permalink: string; //
  author: string; //
  ups: number; //
  numComments: number; //
}

// ---------- API Fetchers ----------
const fetchSubredditPosts = async (
  subreddit: string,
  sort: string = "hot",
  limit: number = 10
): Promise<RedditPost[]> => {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch subreddit posts");
  const data = await res.json();

  return data.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    url: child.data.url,
    permalink: `https://reddit.com${child.data.permalink}`,
    author: child.data.author,
    ups: child.data.ups,
    num_comments: child.data.num_comments,
  }));
};

const searchReddit = async (
  query: string,
  limit: number = 10
): Promise<RedditPost[]> => {
  const res = await fetch(
    `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to search Reddit");
  const data = await res.json();

  return data.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    url: child.data.url,
    permalink: `https://reddit.com${child.data.permalink}`,
    author: child.data.author,
    ups: child.data.ups,
    num_comments: child.data.num_comments,
  }));
};

const fetchUserPosts = async (
  username: string,
  limit: number = 10
): Promise<RedditPost[]> => {
  const res = await APIHelper.get<CoreApiResponse<RedditPost[]>>(
    `${"https://localhost:7296"}/api/reddit/${username}`,
    { params: { limit } }
  );
  if (res.statusCode < 200 || !res.data) {
    throw new Error(res.message || "Failed to fetch user posts");
  }

  return res.data;
};

// ---------- TanStack Hooks ----------
export const useSubredditPosts = (
  subreddit: string,
  sort: string = "hot",
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["subredditPosts", subreddit, sort, limit],
    queryFn: () => fetchSubredditPosts(subreddit, sort, limit),
    enabled: !!subreddit, // don’t fetch if no subreddit
  });
};

export const useRedditSearch = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["redditSearch", query, limit],
    queryFn: () => searchReddit(query, limit),
    enabled: !!query, // don’t fetch until query is set
    staleTime: 1000 * 60,
  });
};

export const useRedditUserPosts = (username: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["redditUserPosts", username, limit],
    queryFn: () => fetchUserPosts(username, limit),
    enabled: !!username,
  });
};
