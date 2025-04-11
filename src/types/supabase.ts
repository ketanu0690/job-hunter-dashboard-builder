
import { Database } from '@/integrations/supabase/types';

// Define a type for Supabase jobs table
export type SupabaseJob = Database['public']['Tables']['jobs']['Row'];

// Define a type for Supabase search criteria table
export type SupabaseSearchCriteria = Database['public']['Tables']['search_criteria']['Row'];

// Extend our existing Job type to make sure it's compatible with Supabase
export type JobWithSupabase = Database['public']['Tables']['jobs']['Insert'];
