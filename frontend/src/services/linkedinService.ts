import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://3000-idx-job-hunter-dashboard-buildergit-1744396589226.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev';

// Configure axios defaults
axios.defaults.withCredentials = false;

export interface LinkedinConfig {
  platform?: string;
  email: string;
  password: string;
  disableAntiLock: boolean;
  remote: boolean;
  experienceLevel: Record<string, boolean>;
  jobTypes: Record<string, boolean>;
  date: Record<string, boolean>;
  positions: string[];
  locations: string[];
  distance: number;
  companyBlacklist?: string[];
  titleBlacklist?: string[];
  checkboxes: {
    driversLicence: boolean;
    requireVisa: boolean;
    legallyAuthorized: boolean;
    urgentFill: boolean;
    commute: boolean;
    backgroundCheck: boolean;
    degreeCompleted: boolean;
    [key: string]: boolean;
  };
  universityGpa: number;
  languages: Record<string, string>;
  industry: Record<string, number>;
  technology: Record<string, number>;
  personalInfo: Record<string, string>;
  eeo: Record<string, string>;
  uploads: {
    resume: string;
    coverLetter?: string;
  };
}

export interface LinkedinResponse {
  success: boolean;
  message: string;
  logs?: string[];
  error?: string;
}

export async function runLinkedinAutomation(config: LinkedinConfig): Promise<LinkedinResponse> {
  try {
    const response = await axios.post(`${API_URL}/api/linkedin/apply`, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return the error response from the server
      return error.response.data as LinkedinResponse;
    }

    // Handle network or other errors
    return {
      success: false,
      message: `Error running LinkedIn automation: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}