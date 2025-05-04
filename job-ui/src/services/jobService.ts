import { supabase } from '../integrations/supabase/client';
import type { Job, SearchCriteria } from '../types';
import type { SupabaseJob } from '../types/supabase';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../components/forms/AuthForm';
import { APIHelper } from "../utils/axios";

// Helper function to get the JWT token
const getAuthToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    throw new Error('Session not found or error fetching session');
  }
  
  return data.session.access_token;
};

// Function to login the user (you can customize it as per your needs)
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Login failed: ' + error.message);
    }

    // Successfully logged in, get the token
    const token = await getAuthToken();
    console.log('User logged in with token:', token);
    return true;
  } catch (error) {
    console.error('Error logging in:', error);
    toast({
      title: 'Login failed',
      description: (error as Error).message,
      variant: 'destructive',
    });
    return false;
  }
};

// Convert Supabase job format to our application Job format
const mapSupabaseJobToJob = (job: SupabaseJob): Job => {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.url,
    date: job.date,
    salary: job.salary || undefined,
    skills: job.skills,
    source: job.source,
    isNew: job.is_new || false
  };
};

// Fetch jobs from Supabase
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return (data || []).map(mapSupabaseJobToJob);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast({
      title: 'Error fetching jobs',
      description: (error as Error).message,
      variant: 'destructive',
    });
    return [];
  }
};

// Import sample jobs to Supabase
export const importSampleJobs = async (sampleJobs: Job[], token: string): Promise<void> => {
  try {
    const supabaseJobs = sampleJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      date: job.date,
      salary: job.salary,
      skills: job.skills,
      source: job.source,
      is_new: job.isNew || true,
    }));

    const result = await APIHelper.post<any, any>('https://bjubucmfgpcvcuqibofk.supabase.co/functions/v1/import-jobs', { jobs: supabaseJobs }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error || 'Failed to import jobs');
    }

    const resultData = await result.json();

    toast({
      title: 'Sample jobs imported',
      description: resultData.message || `${supabaseJobs.length} jobs have been added to the database`,
    });
  } catch (error) {
    console.error('Error importing sample jobs:', error);
    toast({
      title: 'Error importing jobs',
      description: (error as Error).message,
      variant: 'destructive',
    });
    throw error;
  }
};

// Import jobs from Excel file
export const importJobsFromExcel = async (jobs: Job[], token: string): Promise<void> => {
  try {
    const supabaseJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      date: job.date,
      salary: job.salary,
      skills: job.skills,
      source: job.source,
      is_new: job.isNew || true,
    }));

    const result = await APIHelper.post<any, any>('https://bjubucmfgpcvcuqibofk.supabase.co/functions/v1/import-jobs', { jobs: supabaseJobs }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error || 'Failed to import jobs');
    }

    const resultData = await result.json();

    toast({
      title: 'Jobs imported from Excel',
      description: resultData.message || `${supabaseJobs.length} jobs have been added to the database`,
    });
  } catch (error) {
    console.error('Error importing jobs from Excel:', error);
    toast({
      title: 'Error importing jobs',
      description: (error as Error).message,
      variant: 'destructive',
    });
    throw error;
  }
};

// Save search criteria to Supabase
export const saveSearchCriteria = async (criteria: SearchCriteria): Promise<void> => {
  try {
    if (!criteria.companies && !criteria.skills) {
      throw new Error('No criteria to save');
    }

    const { error } = await supabase
      .from('search_criteria')
      .upsert({
        companies: criteria.companies,
        skills: criteria.skills,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    toast({
      title: 'Search criteria saved',
      description: 'Your search preferences have been saved',
    });
  } catch (error) {
    console.error('Error saving search criteria:', error);
    toast({
      title: 'Error saving search criteria',
      description: (error as Error).message,
      variant: 'destructive',
    });
  }
};

// Get job stats (count)
export const getJobStats = async (): Promise<{ count: number }> => {
  try {
    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return { count: count ?? 0 };
  } catch (error) {
    console.error('Error getting job stats:', error);
    toast({
      title: 'Error getting job stats',
      description: (error as Error).message,
      variant: 'destructive',
    });
    return { count: 0 };
  }
};
