import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared/layouts/DashboardLayout";
import BlogList from "../features/Kblog/components/blog/BlogList";
import BlogEditor from "../features/Kblog/components/blog/BlogEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../shared/ui/tabs";
import { PlusCircle, ExternalLink } from "lucide-react";
import { Button } from "../shared/ui/button";
import { useBlogStore } from "../hooks/useBlogStore";
import IntegrationMenu from "@/components/dashboard/IntegrationMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useMediumPosts } from "@/features/Kblog/services/mediumServices";
import { useRedditUserPosts } from "@/features/Kblog/services/redditService";

const BlogManagement: React.FC = () => {
  const {
    editingBlog,
    isCreatingNew,
    activeTab,
    setActiveTab,
    handleEditBlog,
    handleCreateNew,
    handleBack,
  } = useBlogStore();

  const { user } = useAuth();

  const mediumUsername = user?.metaData?.medium_username;
  const redditUsername = user?.metaData?.reddit_username;

  // Medium hook
  const { data: mediumPosts = [], isLoading: loadingMedium } =
    useMediumPosts(mediumUsername);

  // Reddit hook
  const { data: redditPosts = [], isLoading: loadingReddit } =
    useRedditUserPosts(redditUsername, 10);

  const handleIntegrated = (username: string) => {
    if (username == "") {
      return;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!editingBlog && !isCreatingNew ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Blog Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage your blog content
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCreateNew}
                  className="futuristic-button flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  Create New Post
                </Button>
                <IntegrationMenu onIntegrated={handleIntegrated} />
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="published"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8 flex flex-wrap">
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="reddit">Reddit</TabsTrigger>
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

              {/* 🔥 Medium Blogs */}
              <TabsContent value="medium" className="animate-fade-in">
                {loadingMedium ? (
                  <p>Loading Medium posts...</p>
                ) : mediumPosts.length > 0 ? (
                  <ul className="space-y-4">
                    {mediumPosts.map((post, idx) => (
                      <li
                        key={idx}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{post.title}</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.pubDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No Medium posts found. Connect your Medium in Integrations.
                  </p>
                )}
              </TabsContent>

              {/* 🔥 Reddit Integration */}
              {/* Reddit */}
              <TabsContent value="reddit">
                {loadingReddit ? (
                  <p>Loading Reddit posts...</p>
                ) : redditPosts.length > 0 ? (
                  <ul className="space-y-4">
                    {redditPosts.map((post) => (
                      <li
                        key={post.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold hover:underline"
                        >
                          {post.title}
                        </a>
                        <div className="text-sm text-gray-500">
                          by {post.author} • {post.ups} upvotes •{" "}
                          {post.numComments} comments
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No Reddit posts found. Connect your Reddit account in
                    Integrations. Note: Only posts from your user profile are
                    shown.
                  </p>
                )}
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
