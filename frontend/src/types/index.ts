
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  date: string;
  salary?: string;
  skills: string[];
  source: string;
  isNew?: boolean;
}

export interface SearchCriteria {
  companies: string[];
  skills: string[];
}
