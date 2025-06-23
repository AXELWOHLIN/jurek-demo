#!/usr/bin/env python3
"""
Master script to run all job scrapers and show summary results
"""
import subprocess
import os
import pandas as pd
from datetime import datetime

def run_scraper(scraper_name):
    """Run a scraper and return results"""
    try:
        print(f"\n{'='*50}")
        print(f"Running {scraper_name}...")
        print(f"{'='*50}")
        
        result = subprocess.run([
            'python', f'{scraper_name}_scraper.py'
        ], capture_output=True, text=True, cwd='.')
        
        print(result.stdout)
        if result.stderr:
            print(f"Errors: {result.stderr}")
        
        # Check if CSV was created and count jobs
        csv_file = f'{scraper_name}_jobs.csv'
        if os.path.exists(csv_file):
            df = pd.read_csv(csv_file)
            return len(df), True
        else:
            return 0, False
            
    except Exception as e:
        print(f"Error running {scraper_name}: {e}")
        return 0, False

def main():
    """Run all scrapers and show summary"""
    print("JOB SCRAPER MASTER RUNNER")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    scrapers = [
        'bravura',      # Best performer
        'academicwork', 
        'juridikjobb',
        'amendo',
        'wise',
        'jerrie',
        'randstad',
        'adecco',
        'sjr'
    ]
    
    results = {}
    total_jobs = 0
    
    for scraper in scrapers:
        job_count, success = run_scraper(scraper)
        results[scraper] = {
            'jobs': job_count,
            'success': success,
            'csv_file': f'{scraper}_jobs.csv'
        }
        total_jobs += job_count
    
    # Print summary
    print(f"\n{'='*60}")
    print("SCRAPING SUMMARY")
    print(f"{'='*60}")
    
    # Sort by job count
    sorted_results = sorted(results.items(), key=lambda x: x[1]['jobs'], reverse=True)
    
    print(f"{'Scraper':<15} {'Jobs Found':<12} {'Status':<10} {'Quality'}")
    print("-" * 60)
    
    for scraper, data in sorted_results:
        status = "✅ Success" if data['success'] else "❌ Failed"
        
        # Assess quality based on job count and known performance
        if scraper == 'bravura' and data['jobs'] > 50:
            quality = "🟢 Excellent"
        elif data['jobs'] > 15:
            quality = "🟡 Good"
        elif data['jobs'] > 5:
            quality = "🟠 Moderate"
        else:
            quality = "🔴 Poor"
        
        print(f"{scraper:<15} {data['jobs']:<12} {status:<10} {quality}")
    
    print("-" * 60)
    print(f"TOTAL JOBS FOUND: {total_jobs}")
    
    # Show best performers
    print(f"\n{'='*60}")
    print("RECOMMENDED SCRAPERS")
    print(f"{'='*60}")
    
    best_scrapers = [(k, v) for k, v in sorted_results if v['jobs'] > 15]
    
    if best_scrapers:
        for scraper, data in best_scrapers:
            print(f"✅ {scraper.upper()}: {data['jobs']} jobs → {data['csv_file']}")
    else:
        print("No scrapers performed exceptionally well.")
        print("Consider improving parsing logic or trying different URLs.")
    
    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main() 