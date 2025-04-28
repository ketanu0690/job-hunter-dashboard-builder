// @ts-nocheck
// Supabase Edge Function: Insert Sample Jobs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function serve(req: Request): Promise<Response> {
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
  // Sample jobs (same as in service file)
  const sampleJobs = [
    {
      id: 'job-1',
      title: 'Frontend Developer',
      company: 'Tech Innovators',
      location: 'Remote',
      description: 'Work on modern web applications using React and TypeScript.',
      url: 'https://techinnovators.com/jobs/frontend',
      date: '2024-06-01',
      salary: '100000',
      skills: ['React', 'TypeScript', 'CSS'],
      source: 'internal',
      is_new: true
    },
    {
      id: 'job-2',
      title: 'Backend Engineer',
      company: 'Cloud Solutions',
      location: 'New York, NY',
      description: 'Develop scalable backend services with Node.js and PostgreSQL.',
      url: 'https://cloudsolutions.com/careers/backend',
      date: '2024-06-02',
      salary: '120000',
      skills: ['Node.js', 'PostgreSQL', 'API'],
      source: 'internal',
      is_new: true
    },
    {
      id: 'job-3',
      title: 'Full Stack Developer',
      company: 'WebWorks',
      location: 'San Francisco, CA',
      description: 'Join our team to build end-to-end web solutions.',
      url: 'https://webworks.com/jobs/fullstack',
      date: '2024-06-03',
      salary: '130000',
      skills: ['React', 'Node.js', 'GraphQL'],
      source: 'external',
      is_new: true
    },
    {
      id: 'job-4',
      title: 'DevOps Engineer',
      company: 'InfraOps',
      location: 'Austin, TX',
      description: 'Automate and manage cloud infrastructure.',
      url: 'https://infraops.com/careers/devops',
      date: '2024-06-04',
      salary: '125000',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      source: 'internal',
      is_new: true
    },
    {
      id: 'job-5',
      title: 'Data Scientist',
      company: 'Data Insights',
      location: 'Boston, MA',
      description: 'Analyze data and build predictive models.',
      url: 'https://datainsights.com/jobs/data-scientist',
      date: '2024-06-05',
      salary: '140000',
      skills: ['Python', 'Machine Learning', 'SQL'],
      source: 'external',
      is_new: true
    }
  ];

  const { error } = await supabase.from('jobs').insert(sampleJobs);
  if (error) {
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true, message: 'Sample jobs inserted.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 