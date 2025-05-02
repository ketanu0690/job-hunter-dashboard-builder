import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Blog } from "../../types/index";
import { useToast } from "../../hooks/use-toast";
import BlogPreview from "./BlogPreview";
import { Card, CardContent } from "../ui/card";
import { useBlogStore } from "../../hooks/useBlogStore";

const AUTOSAVE_DELAY = 30000; // 30 seconds

interface BlogEditorProps {
  blog: Blog | null;
  isNew: boolean;
  onBack: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blog, isNew, onBack }) => {
  const { handleCreateBlog, handleUpdateBlog } = useBlogStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [previewData, setPreviewData] = useState<Blog | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    blog?.coverImage || null
  );
  const [isAutosaved, setIsAutosaved] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { isDirty, errors },
  } = useForm<Blog>({
    defaultValues: isNew
      ? {
          id: Date.now().toString(),
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          metaDescription: "",
          status: "draft",
          categories: [],
          tags: [],
          coverImage: "",
          authorId: "user-1", // This would be replaced with actual user ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: null,
          scheduledFor: null,
          viewCount: 0,
        }
      : {
          ...blog,
          categories: blog?.categories || [],
          tags: blog?.tags || [],
        },
  });

  const formValues = watch();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        setValue(
          "slug",
          value.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    if (isDirty && !isNew) {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(() => {
        handleAutosave();
      }, AUTOSAVE_DELAY);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [formValues, isDirty]);

  const handleAutosave = () => {
    if (isDirty && !isNew) {
      handleUpdateBlog(formValues);
      setIsAutosaved(true);

      setTimeout(() => {
        setIsAutosaved(false);
      }, 3000);
    }
  };

  const onSubmit = async (data: Blog) => {
    const content = editorRef.current
      ? editorRef.current.getContent()
      : data.content;

    const updatedBlog = {
      ...data,
      content,
      id: data.id,
      updatedAt: new Date().toISOString(),
    };
    if (isNew) {
      await handleCreateBlog(updatedBlog);
      toast({
        title: "Blog created",
        description: "Your blog post has been created successfully.",
      });
    } else {
      await handleUpdateBlog(updatedBlog);
      toast({
        title: "Blog updated",
        description: "Your blog post has been updated successfully.",
      });
    }
    onBack();
  };

  const handlePreview = () => {
    const content = editorRef.current
      ? editorRef.current.getContent()
      : formValues.content;
    setPreviewData({
      ...formValues,
      content,
    });
    setActiveTab("preview");
  };

  const handlePublish = () => {
    setValue("status", "published");
    setValue("publishedAt", new Date().toISOString());
    handleSubmit(onSubmit)();
  };

  const handleSaveAsDraft = () => {
    setValue("status", "draft");
    handleSubmit(onSubmit)();
  };

  const handleSchedule = (date: string) => {
    setValue("status", "scheduled");
    setValue("scheduledFor", date);
    handleSubmit(onSubmit)();
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImagePreview(result);
        setValue("coverImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="hover:bg-background/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>

        <div className="flex items-center space-x-2">
          {isAutosaved && (
            <span className="text-sm text-muted-foreground animate-fade-in">
              Autosaved
            </span>
          )}
          <Button variant="outline" onClick={handleSaveAsDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Schedule Publication</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Label htmlFor="scheduleDate">Publication Date</Label>
                <Input
                  id="scheduleDate"
                  type="datetime-local"
                  className="mt-2"
                  onChange={(e) => handleSchedule(e.target.value)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button
            onClick={handlePublish}
            className="bg-gradient-to-r from-green-500 to-purple-500 hover:opacity-90"
          >
            Publish Now
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter blog title"
                        {...register("title", {
                          required: "Title is required",
                        })}
                        className="text-xl"
                      />
                      {errors.title && (
                        <p className="text-destructive text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Controller
                        name="content"
                        control={control}
                        rules={{ required: "Content is required" }}
                        render={({ field }) => (
                          <div className="border border-input rounded-md">
                            {/* <Editor
                              apiKey="9sc8wlwilkdq6l82gwpuqpbc8lytlbhc4ogdl4k9cbkn9kvs" // You can get a free API key from TinyMCE
                              onInit={(evt, editor) =>
                                (editorRef.current = editor)
                              }
                              initialValue={field.value}
                              init={{
                                height: 400,
                                menubar: true,
                                plugins: [
                                  "advlist",
                                  "autolink",
                                  "lists",
                                  "link",
                                  "image",
                                  "charmap",
                                  "preview",
                                  "anchor",
                                  "searchreplace",
                                  "visualblocks",
                                  "code",
                                  "fullscreen",
                                  "insertdatetime",
                                  "media",
                                  "table",
                                  "code",
                                  "help",
                                  "wordcount",
                                  "codesample",
                                ],
                                toolbar:
                                  "undo redo | blocks | " +
                                  "bold italic forecolor | alignleft aligncenter " +
                                  "alignright alignjustify | bullist numlist outdent indent | " +
                                  "removeformat | link image | codesample | help",
                                content_style:
                                  "body { font-family:Inter,Arial,sans-serif; font-size:16px ;  direction: rtl;}",
                                skin: theme === "dark" ? "oxide-dark" : "oxide",
                                content_css:
                                  theme === "dark" ? "dark" : "default",
                                directionality: "rtl",
                              }}
                              onEditorChange={handleEditorChange}
                            /> */}
                            <Textarea
                              id="content"
                              placeholder="Enter blog content"
                              {...register("content", {
                                required: "Content is required",
                              })}
                            />
                          </div>
                        )}
                      />
                      {errors.content && (
                        <p className="text-destructive text-sm">
                          {errors.content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id="coverImage"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                        <Label
                          htmlFor="coverImage"
                          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-6 transition-colors hover:border-muted-foreground/50"
                        >
                          {coverImagePreview ? (
                            <img
                              src={coverImagePreview}
                              alt="Cover preview"
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          ) : (
                            <>
                              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload cover image
                              </span>
                            </>
                          )}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief summary of your post..."
                        {...register("excerpt")}
                        className="h-20 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categories">
                        Categories (comma separated)
                      </Label>
                      <Controller
                        name="categories"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="categories"
                            placeholder="Business, Technology, Design"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value
                                  ? value.split(",").map((item) => item.trim())
                                  : []
                              );
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="tags"
                            placeholder="job-search, career, interviews"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value
                                  ? value.split(",").map((item) => item.trim())
                                  : []
                              );
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="animate-fade-in">
          <BlogPreview blog={previewData} />
        </TabsContent>

        <TabsContent value="seo" className="animate-fade-in">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="your-blog-post-slug"
                    {...register("slug", { required: "Slug is required" })}
                  />
                  {errors.slug && (
                    <p className="text-destructive text-sm">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="SEO-friendly title (max 60 characters)"
                    {...register("metaTitle")}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch("metaTitle")?.length || 0}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Brief description for search engines"
                    {...register("metaDescription")}
                    className="h-24 resize-none"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch("metaDescription")?.length || 0}/160 characters
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Search Engine Preview</h3>
                  <div className="space-y-1">
                    <p className="text-green-500 text-lg font-medium truncate">
                      {watch("metaTitle") ||
                        watch("title") ||
                        "Blog Post Title"}
                    </p>
                    <p className="text-green-500 text-sm">
                      yourdomain.com/blog/{watch("slug") || "blog-post-slug"}
                    </p>
                    <p className="text-sm line-clamp-2 text-gray-400">
                      {watch("metaDescription") ||
                        "Default meta description for your blog post. Make sure to add a custom meta description for better SEO results."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogEditor;
