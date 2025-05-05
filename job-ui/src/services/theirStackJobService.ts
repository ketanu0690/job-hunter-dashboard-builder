import { APIHelper } from '../utils/axios';

// Types for TheirStack API response (adjust as needed based on actual API response)
export interface TheirStackJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
  [key: string]: any; // For any additional fields
}

export interface TheirStackJobResponse {
  jobs: TheirStackJob[];
  total: number;
  page: number;
  limit: number;
}

interface FetchTheirStackJobsParams {
  page?: number;
  limit?: number;
  job_country_code_or?: string[];
  posted_at_max_age_days?: number;
}

export const fetchTheirStackJobs = async (params: FetchTheirStackJobsParams = {}): Promise<TheirStackJobResponse> => {
  const {
    page = 0,
    limit = 25,
    job_country_code_or = ['US'],
    posted_at_max_age_days = 7,
  } = params;

  const apiKey = import.meta.env.VITE_THEIR_STACK_API_KEY;
  if (!apiKey) {
    throw new Error('TheirStack API key is not set in environment variables');
  }

  const data = {
    page,
    limit,
    job_country_code_or,
    posted_at_max_age_days,
  };

  const response = await APIHelper.post<any>('https://api.theirstack.com/v1/jobs/search', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  // Defensive: If jobs is not present, try to infer or fallback
  if (!response || !Array.isArray(response.jobs)) {
    console.warn('Unexpected TheirStack API response:', response);
    // Try to infer jobs from data or fallback to empty array
    if (Array.isArray(response.data)) {
      return { jobs: response.data, total: response.total ?? 0, page: response.page ?? 0, limit: response.limit ?? 25 };
    }
    // Fallback
    return { jobs: [], total: 0, page: 0, limit: 25 };
  }
  return response;
}; 