
import React from "react";
import { Tag, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Blog } from "../../types";


interface BlogPreviewProps {
  blog: Blog | null;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          {blog.coverImage && (
            <div className="w-full h-64 md:h-96">
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "Unpublished"}
              </div>
              
              {blog.categories?.length > 0 && (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {blog.categories.join(", ")}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{blog.title}</h1>
            
            {blog.excerpt && (
              <div className="text-xl text-muted-foreground mb-8 italic">
                {blog.excerpt}
              </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              {/* In a real app, you would parse markdown or HTML here */}
              {blog.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-muted">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPreview;
