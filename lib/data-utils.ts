import { JobListing, MeritmindJob, PooliaJob, ArbetsformedlingenJob } from './types';

// Parse CSV data into array of objects
function parseCSV<T extends Record<string, string>>(csvContent: string): T[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data: T[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    if (values.length === headers.length) {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj as T);
    }
  }
  
  return data;
}

// Parse date from DD/MM/YY format
function parseDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  const [day, month, year] = dateString.split('/');
  const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
}

// Normalize Meritmind jobs
export function normalizeMeritmindJobs(csvContent: string): JobListing[] {
  const jobs = parseCSV<Record<string, string>>(csvContent);
  
  return jobs.map((job, index) => ({
    id: `meritmind-${index}`,
    title: job.title || '',
    link: job.link || '',
    dateAdded: parseDate(job.data_added),
    source: 'meritmind' as const,
  }));
}

// Normalize Poolia jobs
export function normalizePooliaJobs(csvContent: string): JobListing[] {
  const jobs = parseCSV<Record<string, string>>(csvContent);
  
  return jobs.map((job, index) => ({
    id: `poolia-${index}`,
    title: job.title || '',
    link: job.job_url || '',
    dateAdded: parseDate(job.data_added),
    publishedDate: parseDate(job.published_date),
    applyByDate: parseDate(job.apply_by_date),
    source: 'poolia' as const,
  }));
}

// Normalize Arbetsförmedlingen jobs
export function normalizeArbetsformedlingenJobs(csvContent: string): JobListing[] {
  const jobs = parseCSV<Record<string, string>>(csvContent);
  
  return jobs.map((job) => ({
    id: `arbetsformedlingen-${job.id}`,
    title: job.occupation || 'Job Opening',
    link: `https://arbetsformedlingen.se/platsbanken/annonser/${job.id}`,
    dateAdded: parseDate(job.data_added),
    source: 'arbetsformedlingen' as const,
    email: job.email,
    city: job.city,
    occupation: job.occupation,
  }));
}

// Load and normalize all job data
export async function loadAllJobs(): Promise<JobListing[]> {
  try {
    const [meritmindResponse, pooliaResponse, arbetsformedlingenResponse] = await Promise.all([
      fetch('/api/jobs/meritmind'),
      fetch('/api/jobs/poolia'),
      fetch('/api/jobs/arbetsformedlingen'),
    ]);
    
    const [meritmindJobs, pooliaJobs, arbetsformedlingenJobs] = await Promise.all([
      meritmindResponse.text().then(normalizeMeritmindJobs),
      pooliaResponse.text().then(normalizePooliaJobs),
      arbetsformedlingenResponse.text().then(normalizeArbetsformedlingenJobs),
    ]);
    
    return [...meritmindJobs, ...pooliaJobs, ...arbetsformedlingenJobs];
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

// Filter jobs by date range
export function filterJobsByDateRange(jobs: JobListing[], from: Date, to: Date): JobListing[] {
  return jobs.filter(job => {
    const jobDate = job.dateAdded;
    return jobDate >= from && jobDate <= to;
  });
}

// Get today's jobs
export function getTodaysJobs(jobs: JobListing[]): JobListing[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return filterJobsByDateRange(jobs, today, tomorrow);
}

// Get yesterday's jobs
export function getYesterdaysJobs(jobs: JobListing[]): JobListing[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return filterJobsByDateRange(jobs, yesterday, today);
}

// Get this week's jobs
export function getThisWeeksJobs(jobs: JobListing[]): JobListing[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return filterJobsByDateRange(jobs, startOfWeek, endOfWeek);
}

// Get last week's jobs
export function getLastWeeksJobs(jobs: JobListing[]): JobListing[] {
  const today = new Date();
  const startOfLastWeek = new Date(today);
  startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
  startOfLastWeek.setHours(0, 0, 0, 0);
  
  const endOfLastWeek = new Date(startOfLastWeek);
  endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);
  
  return filterJobsByDateRange(jobs, startOfLastWeek, endOfLastWeek);
} 