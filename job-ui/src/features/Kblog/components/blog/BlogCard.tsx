import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../../../shared/ui/card";
import { Button } from "../../../../shared/ui/button";
import { ExternalLink } from "lucide-react";
import { stripHtml, formatDate } from "../../../../shared/utils/blog";

interface BlogCardProps {
  blog: any;
  source: string;
  onView: () => void;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, source, onView, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const excerpt =
    blog.excerpt || stripHtml(blog.description)?.slice(0, 150) + "...";
  const date = blog.pubDate || blog.created_at;
  const formattedDate = date ? formatDate(date) : "";

  const badgeColor =
    source === "Medium"
      ? "bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
      : "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`opacity-0 translate-y-6 transition-all duration-700`}
      style={{ transitionDelay: `${(index % 5) * 100}ms` }}
    >
      <Card className="flex flex-col h-full rounded-3xl border border-muted bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {blog.imageUrl && (
          <div className="w-full h-52 overflow-hidden relative">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}

        <CardHeader className="flex-1 p-5 pb-3">
          <div className="mb-1 flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${badgeColor}`}
            >
              {source}
            </span>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold">
            {blog.title}
          </CardTitle>
          {formattedDate && (
            <p className="text-sm  mt-1 font-medium">{formattedDate}</p>
          )}
        </CardHeader>

        <CardContent className="p-5 pt-1">
          <CardDescription className="text-sm  line-clamp-3">
            {excerpt}
          </CardDescription>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
          <Button
            onClick={onView}
            variant="ghost"
            className="text-sm text-primary hover:underline px-2"
          >
            Read Article
          </Button>

          {blog.link && (
            <Button
              variant="outline"
              onClick={() => window.open(blog.link, "_blank")}
              className="text-sm border-muted hover:border-primary hover:text-primary transition"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCard;
