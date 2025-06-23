#!/usr/bin/env python3
import requests
import re
import csv
import os

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

def parse_wise_jobs(content):
    """Parse Wise job listings from Jina content"""
    jobs = []
    
    # Pattern to match Wise job listings
    job_patterns = [
        r'\[([^\]]+)\]\((https://www\.wise\.se/[^)]+)\)',  # Job links
        r'#### ([^|]+?)(?:\|[^|]*)?$',  # Job titles as headings
    ]
    
    for pattern in job_patterns:
        matches = re.findall(pattern, content, re.MULTILINE)
        for match in matches:
            if isinstance(match, tuple):
                title, link = match
            else:
                title = match
                link = "https://www.wise.se/lediga-jobb/"
            
            title = title.strip()
            if title and len(title) > 3:
                skip_keywords = ['cookie', 'consent', 'samtycke', 'information', 'om', 'logotyp', 'visa detaljer']
                if not any(skip.lower() in title.lower() for skip in skip_keywords):
                    jobs.append({
                        'title': title,
                        'link': link,
                        'date_added': '19/06/25'
                    })
    
    if not jobs:
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if len(line) > 10 and len(line) < 200:
                if any(keyword in line.lower() for keyword in ['hr', 'lön', 'ekonomi', 'chef', 'marknad', 'administration', 'konsult', 'controller']):
                    jobs.append({
                        'title': line,
                        'link': 'https://www.wise.se/lediga-jobb/',
                        'date_added': '19/06/25'
                    })
    
    seen = set()
    unique_jobs = []
    for job in jobs:
        job_key = job['title'].lower()
        if job_key not in seen:
            seen.add(job_key)
            unique_jobs.append(job)
    
    return unique_jobs[:30]

def scrape_wise_jobs():
    """Main function to scrape Wise jobs"""
    url = "https://www.wise.se/lediga-jobb/?region[]=Stockholm"
    
    api_key = os.getenv('JINA_API_KEY')
    
    print(f"Scraping Wise jobs from: {url}")
    content = get_jina_content(url, api_key)
    
    if not content:
        print("Failed to fetch content")
        return
    
    jobs = parse_wise_jobs(content)
    
    if not jobs:
        print("No jobs found. Let me check the content structure...")
        print("\nFirst 1000 characters of content:")
        print(content[:1000])
        return
    
    csv_filename = 'wise_jobs.csv'
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'link', 'date_added']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for job in jobs:
            writer.writerow(job)
    
    print(f"Scraped {len(jobs)} jobs and saved to {csv_filename}")
    
    for i, job in enumerate(jobs[:5]):
        print(f"{i+1}. {job['title']} - {job['link']}")

if __name__ == "__main__":
    scrape_wise_jobs() 