import React from "react";
import AnimatedSectionHeader from "./AnimatedSectionHeader";
import BlogCard from "./BlogCard";
import { Button } from "../../../../shared/ui/button";

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
    <section className="mb-24">
      <AnimatedSectionHeader color={color} icon={icon} title={title} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-muted-foreground text-lg font-medium">
            Loading {title.toLowerCase()}...
          </div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl py-12 px-6 text-center">
          <p className="text-base sm:text-lg font-semibold">{error}</p>
          <Button
            variant="outline"
            className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-muted-foreground text-center py-16 bg-muted/30 rounded-2xl">
          <p className="text-base sm:text-lg">
            No {title.toLowerCase()} found.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6">
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
    </section>
  );
};

export default BlogSection;
