import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'job_data', 'arbetsformedlingen_jobs.csv');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading Arbetsförmedlingen jobs file:', error);
    return new Response('Error loading jobs data', {
      status: 500,
    });
  }
} 