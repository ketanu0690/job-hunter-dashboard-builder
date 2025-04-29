import { supabase } from '../integrations/supabase/client';
import type { Blog } from '../types';


// Create a new blog
export const createBlog = async (blog: Partial<Blog>): Promise<Blog | null> => {

  const { data, error } = await supabase
    .from('blogs')
    .insert([
        blog,
    ])
    .select()
    .single();
  if (error) {
    console.error('Error creating blog:', error);
    return null;
  }
    return data as Blog;

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
    return data as Blog[];
};

// Update a blog
export const updateBlog = async (blog: Blog): Promise<Blog | null> => {
    if (!blog.id) {
        console.error('Error updating blog: ID is missing');
        return null;
    }
    const id = blog.id;
    const content = {
        title: blog.title,
        content: blog.content
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
    return data as Blog;
};

// Delete a blog
export const deleteBlog = async (id: string): Promise<boolean> => {
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

