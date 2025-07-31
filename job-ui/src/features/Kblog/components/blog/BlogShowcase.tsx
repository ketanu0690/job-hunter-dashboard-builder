import { useState, useEffect, useRef } from "react";
import BlogSection from "./BlogSection";
import BlogModal from "./BlogModal";
import ParallaxHeader from "./ParallaxHeader";
import ScrollToTopButton from "./ScrollToTopButton";
import { APIHelper } from "../../../../shared/utils/axios";
import { getBlogs } from "../../../../services/blogService";
import type { Blog } from "../../../../shared/types";
import deafultBlogImage from "../../../../../public/assests/Hero_section_bg_1.jpg";
import { useAuth } from "@/providers/AuthProvider";
// Types for Medium
interface MediumFeedItem {
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
  imageUrl?: string;
}

interface MediumFeedResponse {
  status: "ok" | "error";
  items: MediumFeedItem[];
}

export default function BlogShowcase() {
  const { session } = useAuth();
  const [openModal, setOpenModal] = useState<null | {
    source: string;
    blog: any;
  }>(null);
  const [mediumBlogs, setMediumBlogs] = useState<MediumFeedItem[]>([]);
  const [supabaseBlogs, setSupabaseBlogs] = useState<Blog[]>([]);
  const [loadingMedium, setLoadingMedium] = useState(true);
  const [loadingSupabase, setLoadingSupabase] = useState(true);
  const [mediumError, setMediumError] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const mediumSectionRef = useRef<HTMLDivElement>(null);
  const supaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add custom CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      .loading-pulse { animation: pulse 2s infinite; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchMedium = async () => {
      setLoadingMedium(true);
      setMediumError(null);
      try {
        const username = "ketanupadhyay40";
        const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
        const data: MediumFeedResponse = await APIHelper.get(rssUrl);
        const articles = data.items.map((item) => {
          const fromThumbnail = item.thumbnail?.trim();
          const fromEnclosure = item.enclosure?.link?.trim();
          const fromContent = item.content.match(
            /<img[^>]+src=["']([^"'>]+)["']/
          )?.[1];

          // Validate image URL function
          const isValidImage = (url: string | undefined | null): boolean => {
            return (
              !!url &&
              url.startsWith("http") &&
              /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
            );
          };

          const imageUrl = isValidImage(fromThumbnail)
            ? fromThumbnail
            : isValidImage(fromEnclosure)
              ? fromEnclosure
              : isValidImage(fromContent)
                ? fromContent
                : "/assests/Hero_section_bg_1.jpg"; // fallback from public folder

          return {
            ...item,
            imageUrl,
          };
        });
        setMediumBlogs(articles);
      } catch (err) {
        setMediumError("Failed to fetch Medium blogs.");
      } finally {
        setLoadingMedium(false);
      }
    };
    const fetchSupabase = async () => {
      setLoadingSupabase(true);
      setSupabaseError(null);
      try {
        const blogs = await getBlogs();
        setSupabaseBlogs(blogs);
      } catch (err) {
        setSupabaseError("Failed to fetch Supabase blogs.");
      } finally {
        setLoadingSupabase(false);
      }
    };
    fetchMedium();
    fetchSupabase();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16 ">
      <ParallaxHeader
        title="Featured Blog Articles"
        isBlogAdmin={session ? true : false}
      />
      <div ref={mediumSectionRef}>
        <BlogSection
          title="Medium Articles"
          color="bg-indigo-500 text-white"
          icon="M"
          blogs={mediumBlogs}
          loading={loadingMedium}
          error={mediumError}
          onView={(blog) => setOpenModal({ source: "Medium", blog })}
        />
      </div>
      <div ref={supaSectionRef}>
        <BlogSection
          title="Supabase Articles"
          color="bg-emerald-500 text-white"
          icon="S"
          blogs={supabaseBlogs}
          loading={loadingSupabase}
          error={supabaseError}
          onView={(blog) => setOpenModal({ source: "Supabase", blog })}
        />
      </div>
      <ScrollToTopButton />
      <BlogModal
        open={!!openModal}
        onClose={() => setOpenModal(null)}
        blog={openModal?.blog}
        source={openModal?.source || ""}
      />
    </div>
  );
}
