"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { JobListing } from "@/lib/types";
import { loadAllJobs, getTodaysJobs, getYesterdaysJobs } from "@/lib/data-utils";
import { Loader2, Calendar, TrendingUp } from "lucide-react";

export default function TodaysListings() {
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
        <Card className="max-w-md mx-auto border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const todaysJobs = getTodaysJobs(jobs);
  const yesterdaysJobs = getYesterdaysJobs(jobs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 dark:from-background dark:via-purple-950/10 dark:to-pink-950/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Today&apos;s Job Listings
              </h1>
              <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-muted-foreground mt-4 text-lg">
              Latest job opportunities from Meritmind, Poolia, and Arbetsförmedlingen
            </p>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger 
                value="today" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4" />
                Today ({todaysJobs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="yesterday" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4" />
                Yesterday ({yesterdaysJobs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-8">
              {todaysJobs.length === 0 ? (
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No jobs added today</h3>
                      <p className="text-muted-foreground">
                        Check back later or view yesterday&apos;s listings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {todaysJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="yesterday" className="mt-8">
              {yesterdaysJobs.length === 0 ? (
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No jobs from yesterday</h3>
                      <p className="text-muted-foreground">
                        No new job listings were added yesterday
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {yesterdaysJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
