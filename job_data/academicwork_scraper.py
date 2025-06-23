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

def parse_academicwork_jobs(content):
    """Parse Academic Work job listings from Jina content"""
    jobs = []
    
    # Pattern to match Academic Work job listings
    # Looking for various job link patterns
    job_patterns = [
        r'\[([^\]]+)\]\((https://www\.academicwork\.se/jobb/[^)]+)\)',  # Standard job links
        r'\[([^\]]+)\]\((https://www\.academicwork\.se/lediga-jobb/[^)]+)\)',  # Alternative job links
        r'#### ([^|]+?)(?:\|[^|]*)?$',  # Job titles as headings
    ]
    
    for pattern in job_patterns:
        matches = re.findall(pattern, content, re.MULTILINE)
        for match in matches:
            if isinstance(match, tuple):
                title, link = match
            else:
                title = match
                link = "https://www.academicwork.se/lediga-jobb"
            
            # Clean the title
            title = title.strip()
            if title and len(title) > 3:
                # Filter out navigation and non-job content
                skip_keywords = ['cookie', 'consent', 'om oss', 'kontakt', 'för företag', 'jobbsökande', 'sök', 'filter']
                if not any(skip.lower() in title.lower() for skip in skip_keywords):
                    jobs.append({
                        'title': title,
                        'link': link,
                        'date_added': '19/06/25'
                    })
    
    # If no jobs found with patterns, try to extract from content
    if not jobs:
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            # Look for potential job titles in content
            if len(line) > 10 and len(line) < 200:
                # Look for job-related keywords
                if any(keyword in line.lower() for keyword in ['utvecklare', 'konsult', 'analyst', 'manager', 'chef', 'ingenjör', 'designer', 'säljare', 'ekonom', 'koordinator']):
                    jobs.append({
                        'title': line,
                        'link': 'https://www.academicwork.se/lediga-jobb',
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
    
    return unique_jobs[:50]  # Limit to first 50 jobs

def scrape_academicwork_jobs():
    """Main function to scrape Academic Work jobs"""
    url = "https://www.academicwork.se/lediga-jobb?l=whosonfirst%3Alocality%3A101752307"
    
    # Get API key from environment (if available)
    api_key = os.getenv('JINA_API_KEY')
    
    print(f"Scraping Academic Work jobs from: {url}")
    content = get_jina_content(url, api_key)
    
    if not content:
        print("Failed to fetch content")
        return
    
    jobs = parse_academicwork_jobs(content)
    
    if not jobs:
        print("No jobs found. Let me check the content structure...")
        print("\nFirst 1000 characters of content:")
        print(content[:1000])
        return
    
    # Write to CSV
    csv_filename = 'academicwork_jobs.csv'
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
    scrape_academicwork_jobs() 