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

def parse_sjr_jobs(content):
    """Parse SJR job listings from Jina content"""
    jobs = []
    
    # Pattern to match job titles and links
    # Look for patterns that might indicate job listings
    job_patterns = [
        r'(.*?)\s*-\s*(?:SJR|sjr\.se)',  # Job title followed by SJR
        r'\[(.*?)\]\((https?://[^\)]+)\)',  # Markdown links
        r'(?:Jobb|Job|Position|Tjänst|Konsult):\s*(.*?)(?:\n|$)',  # Job indicators
    ]
    
    # Try to find job listings in the content
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Look for potential job titles
        for pattern in job_patterns:
            matches = re.findall(pattern, line, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    title, link = match
                else:
                    title = match
                    link = "https://sjr.se"  # Default link
                
                if title and len(title.strip()) > 3:
                    jobs.append({
                        'title': title.strip(),
                        'link': link,
                        'date_added': '19/06/25'
                    })
    
    # If no jobs found with patterns, try to extract from headings
    if not jobs:
        heading_pattern = r'^#+\s+(.*?)$'
        for line in lines:
            match = re.match(heading_pattern, line)
            if match:
                title = match.group(1).strip()
                if len(title) > 5 and not any(skip in title.lower() for skip in ['cookie', 'consent', 'about', 'details']):
                    jobs.append({
                        'title': title,
                        'link': 'https://sjr.se',
                        'date_added': '19/06/25'
                    })
    
    return jobs

def scrape_sjr_jobs():
    """Main function to scrape SJR jobs"""
    url = "https://sjr.se/lediga-jobb-samling/?filter=gi_city%3Dstockholm"
    
    # Get API key from environment (if available)
    api_key = os.getenv('JINA_API_KEY')
    
    print(f"Scraping SJR jobs from: {url}")
    content = get_jina_content(url, api_key)
    
    if not content:
        print("Failed to fetch content")
        return
    
    jobs = parse_sjr_jobs(content)
    
    if not jobs:
        print("No jobs found. Let me check the content structure...")
        print("\nFirst 1000 characters of content:")
        print(content[:1000])
        print("\n" + "="*50)
        
        # Try to extract any potential job-related content
        lines = content.split('\n')
        potential_jobs = []
        for line in lines:
            line = line.strip()
            if line and len(line) > 10 and len(line) < 200:
                # Look for lines that might be job titles
                if any(keyword in line.lower() for keyword in ['utvecklare', 'konsult', 'analyst', 'manager', 'chef', 'ingenjör', 'designer', 'säljare']):
                    potential_jobs.append({
                        'title': line,
                        'link': 'https://sjr.se',
                        'date_added': '19/06/25'
                    })
        
        if potential_jobs:
            jobs = potential_jobs[:10]  # Limit to first 10
    
    # Write to CSV
    csv_filename = 'sjr_jobs.csv'
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
    scrape_sjr_jobs() 