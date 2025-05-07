import React from "react";
import AnimatedSectionHeader from "./AnimatedSectionHeader";
import BlogCard from "./BlogCard";
import { Button } from "../ui/button";

interface BlogSectionProps {
  title: string;
  color: string;
  icon: string;
  blogs: any[];
  loading: boolean;
  error: string | null;
  onView: (blog: any) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({
  title,
  color,
  icon,
  blogs,
  loading,
  error,
  onView,
}) => {
  return (
    <div className="mb-16">
      <AnimatedSectionHeader color={color} icon={icon} title={title} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          {/* <Loader2 className="h-12 w-12 text-primary animate-spin loading-pulse" /> */}
          <span className="mt-4 text-muted-foreground text-lg">
            Loading {title.toLowerCase()}...
          </span>
        </div>
      ) : error ? (
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">{error}</p>
            <Button
              variant="outline"
              className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-muted-foreground text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-lg">No {title.toLowerCase()} found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.guid || blog.id}
              blog={blog}
              source={title.split(" ")[0]}
              onView={() => onView(blog)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSection;
