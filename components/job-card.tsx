import { JobListing } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, MapPin, Mail } from "lucide-react";
import { format } from "date-fns";

interface JobCardProps {
  job: JobListing;
}

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

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-purple-500/30 bg-gradient-to-br from-white to-purple-50/30 dark:from-card dark:to-purple-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors">
            {job.title}
          </CardTitle>
          <Badge className={sourceColors[job.source]} variant="secondary">
            {sourceLabels[job.source]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span>Added {format(job.dateAdded, "MMM d, yyyy")}</span>
          </div>
          
          {job.city && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span>{job.city}</span>
            </div>
          )}
        </div>

        {job.occupation && job.occupation !== job.title && (
          <div className="text-sm text-muted-foreground bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-md">
            <strong className="text-purple-700 dark:text-purple-300">Role:</strong> {job.occupation}
          </div>
        )}

        {job.email && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-purple-600" />
            <span className="truncate">{job.email}</span>
          </div>
        )}

        <div className="space-y-1 text-sm">
          {job.publishedDate && (
            <div className="text-muted-foreground">
              <strong className="text-purple-700 dark:text-purple-300">Published:</strong> {format(job.publishedDate, "MMM d, yyyy")}
            </div>
          )}

          {job.applyByDate && (
            <div className="text-muted-foreground">
              <strong className="text-purple-700 dark:text-purple-300">Apply by:</strong> {format(job.applyByDate, "MMM d, yyyy")}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-purple-100 dark:border-purple-800">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            View Job Listing
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
} 