
// Follow this setup guide to integrate the Supabase client in Edge Functions:
// https://supabase.com/docs/guides/functions/connect-to-supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  date: string;
  salary?: string;
  skills: string[];
  source: string;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the function
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Parse the JSON body
    const { jobs } = await req.json() as { jobs: JobData[] }
    
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid job data' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Format jobs for Supabase
    const formattedJobs = jobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      date: job.date,
      salary: job.salary || null,
      skills: job.skills,
      source: job.source,
      is_new: true
    }))

    // Insert jobs into the database
    const { data, error } = await supabase
      .from('jobs')
      .upsert(formattedJobs, { 
        onConflict: 'url', // Assuming URL is unique per job
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Error inserting jobs:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${jobs.length} jobs`,
        jobsImported: jobs.length 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
