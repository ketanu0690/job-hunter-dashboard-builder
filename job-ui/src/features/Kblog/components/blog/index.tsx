import { useState, useEffect, useRef } from "react";
import BlogSection from "./BlogSection";
import BlogModal from "./BlogModal";
import ParallaxHeader from "./ParallaxHeader";
import ScrollToTopButton from "./ScrollToTopButton";
import { useAuth } from "@/providers/AuthProvider";
import { useMediumPosts } from "../../services/mediumServices";
import { useSupabaseBlogs } from "../../../../services/blogService";
import { useSubredditPosts } from "../../services/redditService";
import type { Blog } from "../../../../shared/types";

// Medium feed types
export interface MediumFeedItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail?: string;
  description?: string;
  content: string;
  categories: string[];
  enclosure: string;
  imageUrl?: string;
}

interface OpenModalState {
  source: "Medium" | "Supabase" | "Reddit";
  blog: Blog | MediumFeedItem | any;
}

export default function BlogShowcase() {
  const { isAuthenticated } = useAuth();
  const [openModal, setOpenModal] = useState<OpenModalState | null>(null);

  const mediumSectionRef = useRef<HTMLDivElement>(null);
  const supaSectionRef = useRef<HTMLDivElement>(null);
  const redditSectionRef = useRef<HTMLDivElement>(null);

  // Inject custom CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      .loading-pulse { animation: pulse 2s infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const username = "ketanupadhyay40";

  // Hooks to fetch data
  const {
    data: mediumArticles,
    error: mediumError,
    isLoading: loadingMedium,
  } = useMediumPosts(username);
  const {
    data: supabaseBlogs,
    error: supabaseError,
    isLoading: loadingSupabase,
  } = useSupabaseBlogs();

  const {
    data: redditPosts,
    error: redditError,
    isLoading: loadingReddit,
  } = useSubredditPosts("programming");

  // Transform Medium articles to include valid image URLs
  const mediumBlogs =
    mediumArticles?.map((item) => {
      const fromThumbnail = item?.thumbnail?.trim();
      const fromEnclosure = item?.enclosure?.trim();
      const fromContent = item?.content.match(
        /<img[^>]+src=["']([^"'>]+)["']/
      )?.[1];

      const isValidImage = (url?: string) =>
        !!url &&
        url.startsWith("http") &&
        /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

      return {
        ...item,
        imageUrl: isValidImage(fromThumbnail)
          ? fromThumbnail
          : isValidImage(fromEnclosure)
            ? fromEnclosure
            : isValidImage(fromContent)
              ? fromContent
              : "/assests/Hero_section_bg_1.jpg",
      };
    }) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <ParallaxHeader
        title="Featured Blog Articles"
        isBlogAdmin={!!isAuthenticated}
      />

      <div ref={redditSectionRef}>
        <BlogSection
          title="Reddit Articles"
          color="bg-red-600 text-white hover:bg-opacity-90 hover:shadow-lg transition duration-300 ease-in-out"
          icon="S"
          blogs={redditPosts ?? []}
          loading={loadingReddit}
          error={""}
          onView={(blog) => setOpenModal({ source: "Reddit", blog })}
        />
      </div>

      <div ref={mediumSectionRef}>
        <BlogSection
          title="Medium Articles"
          color="bg-red-600 text-white hover:bg-opacity-90 hover:shadow-lg transition duration-300 ease-in-out"
          icon="M"
          blogs={mediumBlogs}
          loading={loadingMedium}
          error={""}
          onView={(blog) => setOpenModal({ source: "Medium", blog })}
        />
      </div>

      <div ref={supaSectionRef}>
        <BlogSection
          title="Supabase Articles"
          color="bg-emerald-500 text-white"
          icon="S"
          blogs={supabaseBlogs ?? []}
          loading={loadingSupabase}
          error={""}
          onView={(blog) => setOpenModal({ source: "Supabase", blog })}
        />
      </div>

      <ScrollToTopButton />

      <BlogModal
        open={!!openModal}
        onClose={() => setOpenModal(null)}
        blog={openModal?.blog}
        source={openModal?.source ?? ""}
      />
    </div>
  );
}
