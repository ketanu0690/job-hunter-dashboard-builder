
import React from 'react';
import { ExternalLink, MapPin, Building, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="job-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          {job.isNew && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">New</Badge>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Building className="h-4 w-4 mr-2" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Posted: {formatDate(job.date)}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Skills:</div>
          <div className="flex flex-wrap gap-1">
            {job.skills.map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Source: {job.source}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Button variant="outline" className="w-full" asChild>
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            View Job <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
