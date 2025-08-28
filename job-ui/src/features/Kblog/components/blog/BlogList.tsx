import React, { useState } from "react";
import { Card, CardContent } from "../../../../shared/ui/card";
import { Eye, Pencil, Clock, Tag, Calendar, Trash2 } from "lucide-react";
import { Button } from "../../../../shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../shared/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Blog } from "../../../../shared/types/index";
import { useToast } from "../../../../hooks/use-toast";

import { useBlogStore } from "../../../../hooks/useBlogStore";

interface BlogListProps {
  status: "published" | "draft" | "scheduled" | "all";
  onEditBlog: (blog: Blog) => void;
}

const BlogList: React.FC<BlogListProps> = ({ status, onEditBlog }) => {
  const { toast } = useToast();
  const { blogs, handleDeleteBlog } = useBlogStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    if (status === "all") return true;
    return blog.status === status;
  });

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      handleDeleteBlog(blogToDelete.id);
      toast({
        title: "Blog deleted",
        description: "The blog post has been permanently deleted.",
      });
      setDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (blogStatus: string) => {
    switch (blogStatus) {
      case "published":
        return (
          <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
            Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
            Draft
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
            Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {filteredBlogs.length === 0 ? (
        <Card className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No blog posts found.</p>
          <p className="mt-2 text-sm">
            Create your first blog post to get started.
          </p>
        </Card>
      ) : (
        filteredBlogs.map((blog) => (
          <Card
            key={blog.id}
            className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 group h-80"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {blog.coverImage && (
                  <div className="w-full md:w-1/4 h-48 md:h-auto">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(blog.status)}
                        {blog.publishedAt && (
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {blog.excerpt || blog.content.substring(0, 150)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditBlog(blog)}
                        className="hover:bg-primary/10"
                      >
                        <Pencil size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(blog)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Tag className="h-3 w-3 mr-1" />
                      {blog.categories?.length
                        ? blog.categories.join(", ")
                        : "No categories"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated{" "}
                      {formatDistanceToNow(new Date(blog.updatedAt), {
                        addSuffix: true,
                      })}
                    </div>
                    {blog.viewCount !== undefined && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        {blog.viewCount} views
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this blog post?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogList;
