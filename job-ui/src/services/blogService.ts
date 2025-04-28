import { supabase } from '../integrations/supabase/client';
import type { Blog, BlogContent } from '../types';
import type { Database } from '../integrations/supabase/types';

// Helper to get current date in xx/xx/xxxx format
const getCurrentDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-GB');
};

// Create a new blog
export const createBlog = async (author: string, content: Omit<BlogContent, 'created_at'> & { created_at?: string }): Promise<Blog | null> => {
  const blogContent: BlogContent = {
    ...content,
    created_at: content.created_at || getCurrentDate(),
  };
  const { data, error } = await supabase
    .from('blogs')
    .insert([
      {
        author,
        content: blogContent as any,
      },
    ])
    .select()
    .single();
  if (error) {
    console.error('Error creating blog:', error);
    return null;
  }
  return {
    id: data.id,
    author: data.author,
    content: data.content as unknown as BlogContent,
  };
};

// Get all blogs
export const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    author: row.author,
    content: row.content as unknown as BlogContent,
  }));
};

// Get a single blog by ID
export const getBlogById = async (id: number): Promise<Blog | null> => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
  return {
    id: data.id,
    author: data.author,
    content: data.content as unknown as BlogContent,
  };
};

// Update a blog
export const updateBlog = async (id: number, content: Partial<BlogContent>): Promise<Blog | null> => {
  if (content.created_at === undefined) {
    content.created_at = getCurrentDate();
  }
  const { data, error } = await supabase
    .from('blogs')
    .update({ content: content as any })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating blog:', error);
    return null;
  }
  return {
    id: data.id,
    author: data.author,
    content: data.content as unknown as BlogContent,
  };
};

// Delete a blog
export const deleteBlog = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
  return true;
};

