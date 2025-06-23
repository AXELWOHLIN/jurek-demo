#!/usr/bin/env python3
import requests
import re
import csv
import os
from datetime import datetime
import time

def get_jina_content(url, api_key=None):
    """Fetch content using Jina Reader API"""
    jina_url = f"https://r.jina.ai/{url}"
    headers = {}
    
    if api_key:
        headers['Authorization'] = f'Bearer {api_key}'
    
    try:
        response = requests.get(jina_url, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching content: {e}")
        return None

def parse_bravura_jobs(content):
    """Parse Bravura job listings from Jina content"""
    jobs = []
    
    # Pattern to match Bravura job listings
    # Looking for markdown links with job titles and URLs
    job_pattern = r'\[#### (.+?)\]\((https://ledigajobb\.bravura\.se/[^)]+)\)'
    
    matches = re.findall(job_pattern, content)
    
    for title, link in matches:
        # Clean the title
        title = title.strip()
        if '|' in title:
            # Split on | to get just the job title part
            title = title.split('|')[0].strip()
        
        jobs.append({
            'title': title,
            'link': link,
            'date_added': '19/06/25'
        })
    
    # Also try to find additional job patterns
    # Look for other potential job listings
    lines = content.split('\n')
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Look for job titles that might not be in the main pattern
        if line.startswith('[') and 'bravura.se' in line and line not in [job['title'] for job in jobs]:
            # Try to extract title and link from other formats
            alt_pattern = r'\[([^]]+)\]\((https://[^)]+bravura\.se[^)]+)\)'
            alt_matches = re.findall(alt_pattern, line)
            for alt_title, alt_link in alt_matches:
                if len(alt_title) > 5 and 'jobb' in alt_title.lower():
                    jobs.append({
                        'title': alt_title.strip(),
                        'link': alt_link,
                        'date_added': '19/06/25'
                    })
    
    # Remove duplicates
    seen = set()
    unique_jobs = []
    for job in jobs:
        job_key = (job['title'], job['link'])
        if job_key not in seen:
            seen.add(job_key)
            unique_jobs.append(job)
    
    return unique_jobs

def scrape_bravura_jobs():
    """Main function to scrape Bravura jobs"""
    url = "https://www.bravura.se/jobb/"
    
    # Get API key from environment (if available)
    api_key = os.getenv('JINA_API_KEY')
    
    print(f"Scraping Bravura jobs from: {url}")
    content = get_jina_content(url, api_key)
    
    if not content:
        print("Failed to fetch content")
        return
    
    jobs = parse_bravura_jobs(content)
    
    if not jobs:
        print("No jobs found. Let me check the content structure...")
        print("\nFirst 1000 characters of content:")
        print(content[:1000])
        return
    
    # Write to CSV
    csv_filename = 'bravura_jobs.csv'
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'link', 'date_added']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for job in jobs:
            writer.writerow(job)
    
    print(f"Scraped {len(jobs)} jobs and saved to {csv_filename}")
    
    # Display first few jobs
    for i, job in enumerate(jobs[:5]):
        print(f"{i+1}. {job['title']} - {job['link']}")

if __name__ == "__main__":
    scrape_bravura_jobs() 