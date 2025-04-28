-- This script initializes the required Supabase roles and permissions
-- Run this against your Supabase PostgreSQL database to set up roles

-- Create roles
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;

-- Create schemas if they don't exist (some might already exist)
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- Set up public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Grant select access to anon and authenticated roles
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

-- Grant additional permissions for authenticated users
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Apply permissions to existing objects
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Set up Row Level Security (RLS)
-- Create tables with RLS enabled from now on
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;

-- Common functions for RLS policies
CREATE OR REPLACE FUNCTION public.auth_uid() RETURNS uuid 
LANGUAGE sql STABLE
AS $$ 
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$;

CREATE OR REPLACE FUNCTION public.auth_role() RETURNS text 
LANGUAGE sql STABLE
AS $$ 
  select nullif(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
$$;

-- Create the 'auth.users' table if it does not exist
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password TEXT,
  email_verified BOOLEAN DEFAULT false
);

-- Create the 'auth.identities' table if it does not exist
CREATE TABLE IF NOT EXISTS auth.identities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  provider VARCHAR(255),
  provider_user_id VARCHAR(255)
);

-- Create jobs table with schema provided by user
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  date TEXT NOT NULL,
  salary TEXT,
  skills TEXT[],
  source TEXT NOT NULL,
  is_new BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for jobs table
CREATE POLICY "Allow anonymous read access" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert own jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth_uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update their own jobs" ON public.jobs
  FOR UPDATE USING (auth_uid() IS NOT NULL);

-- Set up search_criteria table with RLS  
CREATE TABLE IF NOT EXISTS public.search_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companies TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  skills TEXT[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on search_criteria table
ALTER TABLE public.search_criteria ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for search_criteria table
CREATE POLICY "Allow users to read their own search criteria" ON public.search_criteria
  FOR SELECT USING (auth_uid() = user_id);

CREATE POLICY "Allow users to insert their own search criteria" ON public.search_criteria
  FOR INSERT WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Allow users to update their own search criteria" ON public.search_criteria
  FOR UPDATE USING (auth_uid() = user_id);

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs table
CREATE POLICY "Allow anonymous read access to blogs" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth_uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update their own blogs" ON public.blogs
  FOR UPDATE USING (auth_uid()::text = author);

-- Final success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Supabase roles and permissions have been set up successfully.';
END $$;

-- End of script
