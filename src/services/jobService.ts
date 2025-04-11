
import { supabase } from '@/integrations/supabase/client';
import type { Job, SearchCriteria } from '@/types';
import type { SupabaseJob } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// Convert Supabase job format to our application Job format
export const mapSupabaseJobToJob = (job: SupabaseJob): Job => {
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
export const importSampleJobs = async (sampleJobs: Job[]): Promise<void> => {
  try {
    // Convert our Job format to Supabase format
    const supabaseJobs = sampleJobs.map(job => ({
      id: job.id, // Use UUIDs from sample data
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      date: job.date,
      salary: job.salary,
      skills: job.skills,
      source: job.source,
      is_new: job.isNew || true
    }));
    
    const { error } = await supabase
      .from('jobs')
      .upsert(supabaseJobs, { onConflict: 'id' });
    
    if (error) {
      throw error;
    }
    
    toast({
      title: 'Sample jobs imported',
      description: `${sampleJobs.length} jobs have been added to the database`,
    });
  } catch (error) {
    console.error('Error importing sample jobs:', error);
    toast({
      title: 'Error importing jobs',
      description: (error as Error).message,
      variant: 'destructive',
    });
    throw error; // Re-throw to be caught in the component
  }
};

// Save search criteria to Supabase
export const saveSearchCriteria = async (criteria: SearchCriteria): Promise<void> => {
  try {
    const { error } = await supabase
      .from('search_criteria')
      .upsert({
        companies: criteria.companies,
        skills: criteria.skills,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      throw error;
    }
    
    toast({
      title: 'Search criteria saved',
      description: 'Your search preferences have been saved'
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

// Fetch search criteria from Supabase
export const fetchSearchCriteria = async (): Promise<SearchCriteria | null> => {
  try {
    const { data, error } = await supabase
      .from('search_criteria')
      .select('*')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No search criteria found
        return null;
      }
      throw error;
    }
    
    return {
      companies: data.companies,
      skills: data.skills
    };
  } catch (error) {
    console.error('Error fetching search criteria:', error);
    toast({
      title: 'Error fetching search criteria',
      description: (error as Error).message,
      variant: 'destructive',
    });
    return null;
  }
};
