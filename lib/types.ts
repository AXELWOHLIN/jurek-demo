export interface JobListing {
  id: string;
  title: string;
  link: string;
  dateAdded: Date;
  source: 'meritmind' | 'poolia' | 'arbetsformedlingen';
  publishedDate?: Date;
  applyByDate?: Date;
  email?: string;
  city?: string;
  occupation?: string;
}

export interface MeritmindJob {
  title: string;
  link: string;
  data_added: string;
}

export interface PooliaJob {
  title: string;
  published_date: string;
  apply_by_date: string;
  job_url: string;
  data_added: string;
}

export interface ArbetsformedlingenJob {
  id: string;
  email: string;
  city: string;
  occupation: string;
  data_added: string;
}

export interface FilterOptions {
  sources: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchTerm?: string;
}

export interface EmailConfiguration {
  emails: string[];
  frequency: 'daily' | 'weekly';
  sources: string[];
} 