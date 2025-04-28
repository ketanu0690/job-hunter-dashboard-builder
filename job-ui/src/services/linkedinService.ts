import axios from "axios";

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

export async function runLinkedinAutomation(
  config: LinkedinConfig
): Promise<LinkedinResponse> {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await axios.post(
      `${baseUrl}/linkedin-automation`,
      config,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // optional: only if you send cookies/session data
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as LinkedinResponse;
    }

    return {
      success: false,
      message: `Error running LinkedIn automation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
