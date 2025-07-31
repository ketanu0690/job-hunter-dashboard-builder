import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../shared/ui/dialog";
import { Button } from "../../../../shared/ui/button";
import { ExternalLink, X } from "lucide-react";
import BlogPreview from "./BlogPreview";
import { formatDate } from "../../../../shared/utils/blog";

const HtmlContent = ({ content }: { content: string }) => (
  <div className="text-foreground animate-in fade-in duration-500 delay-100">
    <div
      className="prose prose-lg max-w-none dark:prose-invert text-left"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);

interface BlogModalProps {
  open: boolean;
  onClose: () => void;
  blog: any;
  source: string;
}

const BlogModal: React.FC<BlogModalProps> = ({
  open,
  onClose,
  blog,
  source,
}) => {
  if (!blog) return null;

  const isMedium = source === "Medium";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full p-0 rounded-xl overflow-hidden shadow-2xl">
        <div className="relative bg-card text-card-foreground">
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between items-start p-6 bg-background/95 border-b">
            <div>
              <DialogHeader className="p-0">
                <DialogTitle className="text-2xl font-bold leading-tight text-foreground">
                  {blog.title}
                </DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-2 text-sm">
                  <span
                    className={
                      isMedium
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {source}
                  </span>
                  {blog.pubDate && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatDate(blog.pubDate)}
                      </span>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
            {source === "Supabase" ? (
              <BlogPreview blog={blog} />
            ) : (
              <>
                {blog.imageUrl && (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full max-h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <HtmlContent content={blog.content || blog.description || ""} />
              </>
            )}
          </div>

          {/* Footer */}
          {blog.link && (
            <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-background/95 backdrop-blur-sm">
              <Button
                onClick={() => window.open(blog.link, "_blank")}
                className={`${isMedium ? "bg-indigo-600 dark:bg-indigo-700" : "bg-emerald-600 dark:bg-emerald-700"} 
                  text-primary-foreground relative overflow-hidden group hover:brightness-110 transition-all`}
              >
                <span className="relative z-10 flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
                  Read on {source}
                </span>
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;
