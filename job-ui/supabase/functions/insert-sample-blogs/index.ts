// @ts-nocheck
// Supabase Edge Function: Insert Sample Blogs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// This function needs to be exported for our server.ts to use it
export const serve = async (req: Request) => {
  // Create Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ 
        error: "Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  // Sample blogs (same as in service file)
  const sampleBlogs = [
    {
      author: 'user-1',
      content: {
        blog_Id: 1,
        blog_name: 'Getting Started with Supabase',
        created_at: '2024-06-01',
        blog_content: '<p>This is a guide to help you get started with Supabase in your projects.</p>'
      }
    },
    {
      author: 'user-2',
      content: {
        blog_Id: 2,
        blog_name: 'React + Supabase Tips',
        created_at: '2024-06-02',
        blog_content: '<p>Best practices for integrating Supabase with React applications.</p>'
      }
    },
    {
      author: 'user-3',
      content: {
        blog_Id: 3,
        blog_name: 'Deploying with Docker',
        created_at: '2024-06-03',
        blog_content: '<p>Learn how to containerize and deploy your apps using Docker.</p>'
      }
    },
    {
      author: 'user-4',
      content: {
        blog_Id: 4,
        blog_name: 'CI/CD Pipelines',
        created_at: '2024-06-04',
        blog_content: '<p>Automate your deployments with modern CI/CD tools and workflows.</p>'
      }
    },
    {
      author: 'user-5',
      content: {
        blog_Id: 5,
        blog_name: 'Advanced TypeScript',
        created_at: '2024-06-05',
        blog_content: '<p>Deep dive into TypeScript features for large-scale applications.</p>'
      }
    }
  ];

  const { error } = await supabase.from('blogs').insert(sampleBlogs);
  if (error) {
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true, message: 'Sample blogs inserted.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}; 