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

def parse_juridikjobb_jobs(content):
    """Parse Juridikjobb job listings from Jina content"""
    jobs = []
    
    # Pattern to match Juridikjobb job listings
    job_patterns = [
        r'\[([^\]]+jurist[^\]]*)\]\((https://juridikjobb\.se/[^)]+)\)',  # Jobs with "jurist" in title
        r'\[([^\]]+advokat[^\]]*)\]\((https://juridikjobb\.se/[^)]+)\)',  # Jobs with "advokat" in title
        r'\[([^\]]+legal[^\]]*)\]\((https://juridikjobb\.se/[^)]+)\)',   # Jobs with "legal" in title
        r'\[([^\]]+paralegal[^\]]*)\]\((https://juridikjobb\.se/[^)]+)\)', # Jobs with "paralegal" in title
        r'\[(Jurist|Affärsjurist|Bolagsjurist|Legal Counsel|Advokat|Paralegal|Head of Legal)[^\]]*\]\((https://juridikjobb\.se/[^)]+)\)',  # Specific legal roles
    ]
    
    for pattern in job_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                title, link = match
            else:
                title = match
                link = "https://juridikjobb.se/sv/jobb"
            
            # Clean the title
            title = title.strip()
            if title and len(title) > 3:
                jobs.append({
                    'title': title,
                    'link': link,
                    'date_added': '19/06/25'
                })
    
    # If no specific job matches found, look for general legal content
    if not jobs:
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            # Look for legal job keywords
            if len(line) > 10 and len(line) < 150:
                if any(keyword in line.lower() for keyword in ['jurist', 'advokat', 'legal', 'paralegal', 'juridisk', 'rättslig']):
                    # Avoid navigation items
                    if not any(skip in line.lower() for skip in ['sök jobb', 'mitt konto', 'för arbetsgivare', 'karriärtips']):
                        jobs.append({
                            'title': line,
                            'link': 'https://juridikjobb.se/sv/jobb',
                            'date_added': '19/06/25'
                        })
    
    # Remove duplicates
    seen = set()
    unique_jobs = []
    for job in jobs:
        job_key = job['title'].lower()
        if job_key not in seen:
            seen.add(job_key)
            unique_jobs.append(job)
    
    return unique_jobs[:20]  # Limit to first 20

def scrape_juridikjobb_jobs():
    """Main function to scrape Juridikjobb jobs"""
    url = "https://juridikjobb.se/sv/jobb"
    
    # Get API key from environment (if available)
    api_key = os.getenv('JINA_API_KEY')
    
    print(f"Scraping Juridikjobb jobs from: {url}")
    content = get_jina_content(url, api_key)
    
    if not content:
        print("Failed to fetch content")
        return
    
    jobs = parse_juridikjobb_jobs(content)
    
    if not jobs:
        print("No jobs found. Let me check the content structure...")
        print("\nFirst 1000 characters of content:")
        print(content[:1000])
        return
    
    # Write to CSV
    csv_filename = 'juridikjobb_jobs.csv'
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
    scrape_juridikjobb_jobs() 