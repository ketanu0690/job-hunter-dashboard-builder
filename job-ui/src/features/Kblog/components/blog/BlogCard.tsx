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
import { BookOpen, ExternalLink } from "lucide-react";
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
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200";

  useEffect(() => {
    const observer = new window.IntersectionObserver(
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
      className={`opacity-0 translate-y-8 transition-all duration-700 delay-${
        index % 5
      }00`}
      style={{ transitionDelay: `${(index % 5) * 100}ms` }}
    >
      <Card className="flex flex-col h-full border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {blog.imageUrl && (
          <div className="w-full h-48 overflow-hidden bg-muted relative">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        <CardHeader className="flex-1 pb-2">
          <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {blog.title}
            </CardTitle>
            <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
              {source}
            </span>
          </div>
          {formattedDate && (
            <p className="text-xs text-muted-foreground mb-1">
              {formattedDate}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <CardDescription className="text-muted-foreground text-sm line-clamp-3">
            {excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 pb-4 gap-2">
          <Button
            onClick={onView}
            className={`bg-primary text-primary-foreground hover:bg-primary/90 w-full relative overflow-hidden group`}
          >
            <span className="relative z-10 flex items-center">
              <BookOpen className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Read Article
            </span>
            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
          </Button>
          {blog.link && (
            <Button
              variant="outline"
              onClick={() => window.open(blog.link, "_blank")}
              className="border-border relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <ExternalLink className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                View
              </span>
              <span className="absolute inset-0 w-0 bg-primary/10 transition-all duration-300 group-hover:w-full"></span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCard;
