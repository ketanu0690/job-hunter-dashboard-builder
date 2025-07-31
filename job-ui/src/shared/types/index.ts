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
  id: string;
  contentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'published' | 'draft' | 'scheduled';
  categories?: string[];
  tags?: string[];
  coverImage?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  scheduledFor: string | null;
  viewCount?: number;
  versions?: Blog[];
  versionId?: string;
}
