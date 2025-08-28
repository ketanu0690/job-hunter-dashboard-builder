import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../shared/ui/dialog";
import { Button } from "../../../../shared/ui/button";
import { ExternalLink, X, Bookmark } from "lucide-react";
import BlogPreview from "./BlogPreview";
import { formatDate } from "../../../../shared/utils/blog";
import { summarizeContent } from "../../services/geminiService";
import { saveBookmark } from "../../utils/bookmark";

const HtmlContent = ({ content }: { content: string }) => (
  <div className=" animate-in fade-in duration-500 delay-100">
    <div
      className="prose prose-lg max-w-none dark:prose-invert text-left   prose-a:text-primary hover:prose-a:text-primary/80"
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
  const [summary, setSummary] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (!blog) return;

    async function fetchSummary() {
      setIsLoadingSummary(true);
      try {
        const content = blog.content || blog.description || "";
        const aiSummary = await summarizeContent(content);
        setSummary(aiSummary || "Summary not available.");
      } catch (error) {
        setSummary("Failed to generate summary.");
      } finally {
        setIsLoadingSummary(false);
      }
    }

    fetchSummary();
  }, [blog]);

  if (!blog) return null;

  const isMedium = source === "Medium";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-w-[20vw] p-0 rounded-xl overflow-scroll  shadow-2xl border border-border dark:border-neutral-700 bg-white dark:bg-background-dark max-h-[90vh] text-black dark:text-white">
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 z-20 backdrop-blur-sm border-b border-border dark:border-neutral-700 bg-white dark:bg-background-dark/95 flex-shrink-0 text-black dark:text-white">
            <div className="flex justify-between items-start p-6">
              <div className="flex-1 pr-4">
                <DialogHeader className="p-0 space-y-3">
                  <DialogTitle className="text-2xl font-bold leading-tight pr-8 text-black dark:text-white">
                    {blog.title}
                  </DialogTitle>

                  {/* Summary Section */}
                  <div className="bg-muted/30 dark:bg-muted-dark/30 rounded-lg p-4 border border-border dark:border-neutral-700 text-black dark:text-white">
                    {isLoadingSummary ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full dark:border-primary-dark dark:border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                          Generating summary...
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-black dark:text-white/80">
                        {summary}
                      </p>
                    )}
                  </div>

                  <DialogDescription className="flex items-center gap-2 text-sm text-black dark:text-white">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isMedium
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {source}
                    </span>
                    {blog.pubDate && (
                      <>
                        <span className="text-muted-foreground dark:text-muted-foreground-dark">
                          •
                        </span>
                        <span className="text-muted-foreground dark:text-muted-foreground-dark">
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
                className="rounded-full hover:bg-muted/70 dark:hover:bg-muted-dark/70 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-black dark:text-white" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto flex-1 ">
            <div className="space-y-6">
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
                        loading="lazy"
                      />
                    </div>
                  )}
                  <HtmlContent
                    content={blog.content || blog.description || ""}
                  />
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          {blog.link && (
            <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t border-border dark:border-neutral-700 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm flex-shrink-0 text-black dark:text-white">
              <div className="flex items-center gap-3 w-full">
                <Button
                  onClick={() => window.open(blog.link, "_blank")}
                  className={`${
                    isMedium
                      ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                      : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  } text-white relative overflow-hidden group transition-all duration-300`}
                >
                  <span className="relative z-10 flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
                    Read on {source}
                  </span>
                  <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => saveBookmark(blog)}
                  className="border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-950 transition-colors duration-200"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Article
                </Button>
              </div>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;
