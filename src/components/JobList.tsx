
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import JobCard from './JobCard';
import { Job, SearchCriteria } from '@/types';

interface JobListProps {
  jobs: Job[];
  searchCriteria: SearchCriteria;
}

const JobList: React.FC<JobListProps> = ({ jobs, searchCriteria }) => {
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    // Filter by companies if any are selected
    const matchesCompany = searchCriteria.companies.length === 0 || 
      searchCriteria.companies.some(company => 
        job.company.toLowerCase().includes(company.toLowerCase())
      );
    
    // Filter by skills if any are selected
    const matchesSkills = searchCriteria.skills.length === 0 || 
      searchCriteria.skills.some(skill => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    
    // Filter by search term
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCompany && matchesSkills && matchesSearch;
  });
  
  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest First)</SelectItem>
              <SelectItem value="company">Company Name</SelectItem>
              <SelectItem value="title">Job Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No jobs match your criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm('')}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
