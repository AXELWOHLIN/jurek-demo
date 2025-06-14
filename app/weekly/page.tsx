"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { JobListing } from "@/lib/types";
import { loadAllJobs, getThisWeeksJobs, getLastWeeksJobs } from "@/lib/data-utils";
import { Loader2, Calendar, TrendingUp } from "lucide-react";

export default function WeeklyListings() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const allJobs = await loadAllJobs();
        setJobs(allJobs);
      } catch (err) {
        setError('Failed to load job listings');
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-muted-foreground">Loading job listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const thisWeeksJobs = getThisWeeksJobs(jobs);
  const lastWeeksJobs = getLastWeeksJobs(jobs);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Weekly Job Listings</h1>
          <p className="text-muted-foreground">
            Job opportunities from the current and previous week
          </p>
        </div>

        <Tabs defaultValue="thisweek" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="thisweek" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              This Week ({thisWeeksJobs.length})
            </TabsTrigger>
            <TabsTrigger value="lastweek" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last Week ({lastWeeksJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="thisweek" className="mt-6">
            {thisWeeksJobs.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs this week</h3>
                    <p className="text-muted-foreground">
                      Check back later or view last week&apos;s listings
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {thisWeeksJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lastweek" className="mt-6">
            {lastWeeksJobs.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs from last week</h3>
                    <p className="text-muted-foreground">
                      No job listings were added last week
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lastWeeksJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 