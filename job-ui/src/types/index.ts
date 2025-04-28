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

export interface BlogContent {
  blog_Id: number;
  blog_name: string;
  created_at: string; // e.g., "xx/xx/xxxx"
  blog_content: string; // JSX content inside a string, e.g., "<p>Blog Data</p>"
}

export interface Blog {
  id: number;
  author: string; // user ID
  content: BlogContent;
}

export type { Blog, BlogContent };
