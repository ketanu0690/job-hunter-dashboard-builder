// src/services/blogService.ts
import { supabase } from "../integrations/supabase/client";
import type { Blog } from "../shared/types";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../shared/types/database.types";

// shorthand types for our table “blogs”
type BlogsRow = Tables<"blogs">;
type BlogsInsert = TablesInsert<"blogs">;
type BlogsUpdate = TablesUpdate<"blogs">;

// flatten a row → your domain Blog
function dbRowToBlog(row: BlogsRow): Blog {
  const { id, author, content } = row;
  return {
    id,
    authorId: author,
    contentId: (content as any).id,
    slug: (content as any).slug,
    tags: (content as any).tags,
    title: (content as any).title,
    status: (content as any).status,
    content: (content as any).content,
    excerpt: (content as any).excerpt,
    createdAt: (content as any).createdAt,
    updatedAt: (content as any).updatedAt,
    viewCount: (content as any).viewCount,
    categories: (content as any).categories,
    coverImage: (content as any).coverImage,
    publishedAt: (content as any).publishedAt as string | null,
    scheduledFor: (content as any).scheduledFor as string | null,
    metaDescription: (content as any).metaDescription as string | null,
  };
}

// Create
export const createBlog = async (blog: Partial<Blog>): Promise<Blog | null> => {
  const { authorId, ...content } = blog;
  const insertPayload: BlogsInsert = {
    author: authorId!,
    content: content as any, // cast to satisfy Json shape
  };

  const { data, error } = await supabase
    .from("blogs")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("Error creating blog:", error);
    return null;
  }
  return dbRowToBlog(data);
};

// Read all
export const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase
    .from<"blogs", BlogsRow>("blogs")
    .select("*");

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
  return data!.map(dbRowToBlog);
};

// Update
export const updateBlog = async (blog: Blog): Promise<Blog | null> => {
  const { authorId, id, ...content } = blog;
  const updatePayload: Partial<BlogsUpdate> = {
    author: authorId,
    content: content as any,
  };

  console.log("updatePayload", updatePayload);
  const { data, error } = await supabase
    .from("blogs")
    .update(updatePayload)
    .eq("id", id)
    .select();
  console.log("Update data:", data);
  console.log("Update error:", error);
  if (error) {
    console.error("Error updating blog:", error);
    return null;
  }
  if (!data) {
    console.warn(`No blog found with id=${id}`);
    return null;
  }
  return dbRowToBlog(data[0]);
};

// Delete
export const deleteBlog = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    console.error("Error deleting blog:", error);
    return false;
  }
  return true;
};
