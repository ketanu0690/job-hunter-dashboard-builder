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
import { ExternalLink, Clock, Calendar, MessageCircle } from "lucide-react";
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

  // Default images for different sources
  const getDefaultImage = (source: string) => {
    switch (source) {
      case "Reddit":
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23FF4500'%3E%3Crect width='400' height='300' fill='%23FF4500'/%3E%3Cg fill='white' transform='translate(200,150)'%3E%3Ccircle r='60' fill='white'/%3E%3Ccircle r='40' fill='%23FF4500'/%3E%3Ccircle cx='-15' cy='-10' r='8' fill='white'/%3E%3Ccircle cx='15' cy='-10' r='8' fill='white'/%3E%3Ccircle cx='-15' cy='-10' r='3' fill='%23000'/%3E%3Ccircle cx='15' cy='-10' r='3' fill='%23000'/%3E%3Cpath d='M-15,10 Q0,20 15,10' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/g%3E%3C/svg%3E";
      case "Medium":
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23000'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Cg fill='white' transform='translate(200,150)'%3E%3Ctext x='0' y='0' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='48' font-weight='bold'%3EM%3C/text%3E%3C/g%3E%3C/svg%3E";
      default:
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cg fill='%236b7280' transform='translate(200,150)'%3E%3Cpath d='M-40,-30 L40,-30 L40,30 L-40,30 Z M-30,-20 L30,-20 M-30,-10 L20,-10 M-30,0 L30,0 M-30,10 L25,10 M-30,20 L15,20' stroke='%236b7280' stroke-width='2' fill='none'/%3E%3C/g%3E%3C/svg%3E";
    }
  };

  const getSourceStyle = (source: string) => {
    switch (source) {
      case "Medium":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/25";
      case "Reddit":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25";
      default:
        return "bg-gradient-to-r from-gray-800 to-black text-white shadow-gray-800/25";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Reddit":
        return (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        );
      case "Medium":
        return (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleRedirectClick = () => {
    if (source === "Reddit" && blog.permalink) {
      window.open(blog.permalink, "_blank");
    } else {
      onView();
    }
  };

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
      <Card className="group relative flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-500 ease-out">
        {/* Image Container with Overlay */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={blog.imageUrl || getDefaultImage(source)}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Source Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm ${getSourceStyle(source)}`}
            >
              {getSourceIcon(source)}
              {source}
            </div>
          </div>

          {/* Date Badge */}
          {formattedDate && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg">
                <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formattedDate}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 p-6">
          <CardHeader className="p-0 space-y-3">
            {/* Title */}
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
              {blog.title}
            </CardTitle>

            {/* Date for cards without images */}
            {!blog.imageUrl && formattedDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
                <span
                  className={`ml-auto flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getSourceStyle(source).replace("shadow-red-500/25", "").replace("shadow-orange-500/25", "").replace("shadow-gray-800/25", "")}`}
                >
                  {getSourceIcon(source)}
                  {source}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 mt-4">
            <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {excerpt}
            </CardDescription>
          </CardContent>
        </div>
        {/* Footer */}
        <CardFooter className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <Button
            onClick={handleRedirectClick}
            variant="ghost"
            className={`${
              source === "Reddit"
                ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                : "text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
            } transition-all duration-300 font-medium`}
          >
            {source === "Reddit" ? (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                View Discussion
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Read Article
              </>
            )}
          </Button>

          {blog.link && source !== "Reddit" && (
            <Button
              variant="outline"
              onClick={() => window.open(blog.link, "_blank")}
              className="border-2 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 hover:border-orange-600 dark:hover:border-orange-500 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          )}
        </CardFooter>
        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Card>
    </div>
  );
};

export default BlogCard;
