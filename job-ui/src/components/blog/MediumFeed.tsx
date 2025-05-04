// src/components/MediumFeed.tsx

import { APIHelper } from "../../utils/axios";
import React, { useEffect, useState } from "react";

interface MediumFeedProps {
  username?: string; // Medium handle without @
}

export interface MediumFeedItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
  enclosure: {
    link: string;
    type: string;
    length: number;
  };
}

export interface MediumFeed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

export interface MediumFeedResponse {
  status: "ok" | "error";
  feed: MediumFeed;
  items: MediumFeedItem[];
}

const MediumFeed: React.FC<MediumFeedProps> = ({
  username = "ketanupadhyay40",
}) => {
  const [posts, setPosts] = useState<(MediumFeedItem & { imageUrl: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});

  const extractImageFromContent = (html: string): string | null => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchMediumPosts = async () => {
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
      const errorMap: Record<string, string> = {};

      try {
        const data = await APIHelper.get<MediumFeedResponse>(rssUrl);

        const articles = data.items
          .filter((item) => item.categories.length > 0)
          .map((item) => {
            let imageUrl =
              item.thumbnail?.trim() ||
              item.enclosure?.link?.trim() ||
              extractImageFromContent(item.content);

            if (!imageUrl) {
              errorMap[item.guid] =
                "No image found in thumbnail, enclosure, or content.";
              imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
            }

            return {
              ...item,
              imageUrl,
            };
          });

        setImageErrors(errorMap);
        setPosts(articles);
      } catch (err) {
        console.error("Failed to fetch Medium posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediumPosts();
  }, [username]);

  if (loading) return <p className="p-4">Loading Medium posts...</p>;

  return (
    <div className="p-4">
      {Object.keys(imageErrors).length > 0 && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400">
          <strong>Image Extraction Errors:</strong>
          <ul className="list-disc list-inside">
            {Object.entries(imageErrors).map(([guid, error]) => (
              <li key={guid}>
                <code>{guid}</code>: {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.guid}
            className="bg-white dark:bg-card shadow-md rounded-lg p-4 border border-border flex flex-col"
          >
            <div className="w-full h-48 mb-4 bg-muted rounded overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(post.pubDate).toLocaleDateString()}
            </p>
            <p
              className="text-sm text-foreground mb-4"
              dangerouslySetInnerHTML={{
                __html: post.description.slice(0, 120) + "...",
              }}
            />
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline mt-auto"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediumFeed;
