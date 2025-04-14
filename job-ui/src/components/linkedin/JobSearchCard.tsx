
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface JobSearchCardProps {
  remote: boolean;
  onPositionChange: (positions: string[]) => void;
  onLocationChange: (locations: string[]) => void;
  onRemoteChange: (checked: boolean) => void;
}

const JobSearchCard: React.FC<JobSearchCardProps> = ({
  remote,
  onPositionChange,
  onLocationChange,
  onRemoteChange
}) => {
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange(e.target.value.split(',').map(item => item.trim()));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange(e.target.value.split(',').map(item => item.trim()));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Search Settings</CardTitle>
        <CardDescription>Customize your job search criteria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="positions">Job Positions (comma separated)</Label>
          <Input 
            id="positions" 
            placeholder="Software Engineer, Developer, Product Manager" 
            onChange={handlePositionChange}
          />
        </div>
        <div>
          <Label htmlFor="locations">Locations (comma separated)</Label>
          <Input 
            id="locations" 
            placeholder="New York, Remote, San Francisco" 
            onChange={handleLocationChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remote" 
            checked={remote}
            onCheckedChange={onRemoteChange}
          />
          <label 
            htmlFor="remote" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include remote jobs
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSearchCard;
