import React from "react";
import DashboardLayout from "../shared/layouts/DashboardLayout";
import BlogList from "../features/Kblog/components/blog/BlogList";
import BlogEditor from "../features/Kblog/components/blog/BlogEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../shared/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Button } from "../shared/ui/button";
import { useBlogStore } from "../hooks/useBlogStore";

const BlogManagement: React.FC = () => {
  const {
    blogs,
    loading,
    newBlog,
    editingBlog,
    isCreatingNew,
    activeTab,
    setActiveTab,
    handleEditBlog,
    handleCreateNew,
    handleBack,
  } = useBlogStore();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!editingBlog && !isCreatingNew ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Blog Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage your blog content
                </p>
              </div>
              <Button
                onClick={handleCreateNew}
                className="futuristic-button flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create New Post
              </Button>
            </div>

            <Tabs
              defaultValue="published"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8">
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="all">All Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="published" className="animate-fade-in">
                <BlogList status="published" onEditBlog={handleEditBlog} />
              </TabsContent>

              <TabsContent value="drafts" className="animate-fade-in">
                <BlogList status="draft" onEditBlog={handleEditBlog} />
              </TabsContent>

              <TabsContent value="scheduled" className="animate-fade-in">
                <BlogList status="scheduled" onEditBlog={handleEditBlog} />
              </TabsContent>

              <TabsContent value="all" className="animate-fade-in">
                <BlogList status="all" onEditBlog={handleEditBlog} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <BlogEditor
            blog={editingBlog!}
            isNew={isCreatingNew}
            onBack={handleBack}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogManagement;
