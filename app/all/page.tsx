"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobListing } from "@/lib/types";
import { loadAllJobs } from "@/lib/data-utils";
import { Loader2, Search, Filter, ExternalLink, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

const sourceColors = {
  meritmind: "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300",
  poolia: "bg-gradient-to-r from-green-100 to-purple-100 text-green-800 dark:from-green-900 dark:to-purple-900 dark:text-green-300",
  arbetsformedlingen: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300",
};

const sourceLabels = {
  meritmind: "Meritmind",
  poolia: "Poolia",
  arbetsformedlingen: "Arbetsförmedlingen",
};

export default function AllListings() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'source'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(job => selectedSources.includes(job.source));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.dateAdded.getTime() - b.dateAdded.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'source':
          comparison = a.source.localeCompare(b.source);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [jobs, searchTerm, selectedSources, sortBy, sortOrder]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
    setCurrentPage(1);
  };

  const handleSort = (column: 'date' | 'title' | 'source') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 dark:from-background dark:via-purple-950/10 dark:to-pink-950/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                All Job Listings
              </h1>
              <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-muted-foreground mt-4 text-lg">
              Complete searchable database of all job listings ({jobs.length} total)
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-card dark:to-purple-950/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Filter className="h-5 w-5 text-purple-600" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 h-4 w-4" />
                <Input
                  placeholder="Search job titles, roles, or cities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Source filters */}
              <div>
                <p className="text-sm font-medium mb-2 text-purple-700 dark:text-purple-300">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sourceLabels).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant={selectedSources.includes(key) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedSources.includes(key) 
                          ? sourceColors[key as keyof typeof sourceColors] + " shadow-md" 
                          : 'hover:bg-purple-50 dark:hover:bg-purple-950/20'
                      }`}
                      onClick={() => toggleSource(key)}
                    >
                      {label}
                    </Badge>
                  ))}
                  {selectedSources.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSources([]);
                        setCurrentPage(1);
                      }}
                      className="h-6 px-2 text-xs hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {filteredAndSortedJobs.length} Results
                {searchTerm && ` for "${searchTerm}"`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAndSortedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20">
                        <TableHead 
                          className="cursor-pointer hover:text-purple-600 transition-colors font-semibold"
                          onClick={() => handleSort('title')}
                        >
                          Job Title {sortBy === 'title' && (
                            <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-purple-600 transition-colors font-semibold"
                          onClick={() => handleSort('source')}
                        >
                          Source {sortBy === 'source' && (
                            <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-purple-600 transition-colors font-semibold"
                          onClick={() => handleSort('date')}
                        >
                          Date Added {sortBy === 'date' && (
                            <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </TableHead>
                        <TableHead className="font-semibold">Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedJobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-colors">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold text-foreground hover:text-purple-600 transition-colors">{job.title}</div>
                              {job.occupation && job.occupation !== job.title && (
                                <div className="text-sm text-muted-foreground bg-purple-50/50 dark:bg-purple-950/20 px-2 py-1 rounded mt-1 inline-block">
                                  {job.occupation}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={sourceColors[job.source]} variant="secondary">
                              {sourceLabels[job.source]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {job.city && (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 text-purple-600" />
                                {job.city}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-purple-600" />
                              {format(job.dateAdded, "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm px-3 py-1 rounded transition-all duration-200 hover:scale-105"
                            >
                              View
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedJobs.length)} of {filteredAndSortedJobs.length} results
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="border-purple-200 hover:bg-purple-50 hover:border-purple-400"
                        >
                          Previous
                        </Button>
                        <span className="text-sm font-medium">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="border-purple-200 hover:bg-purple-50 hover:border-purple-400"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 