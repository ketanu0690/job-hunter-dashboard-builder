
import React from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import JobList from '@/components/JobList';
import ZapierSetup from '@/components/ZapierSetup';
import { sampleJobs } from '@/utils/jobData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchCriteria } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [searchCriteria, setSearchCriteria] = useLocalStorage<SearchCriteria>('searchCriteria', {
    companies: [],
    skills: []
  });

  const [zapierWebhook, setZapierWebhook] = useLocalStorage<string>('zapierWebhook', '');

  const newJobsCount = sampleJobs.filter(job => job.isNew).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header newJobsCount={newJobsCount} />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-screen-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Job Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track tech job postings matching your preferred companies and skills
          </p>
        </div>
        
        <SearchForm 
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
        />
        
        <Tabs defaultValue="jobs" className="mb-10">
          <TabsList>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="pt-4">
            <JobList jobs={sampleJobs} searchCriteria={searchCriteria} />
          </TabsContent>
          <TabsContent value="integrations" className="pt-4">
            <div className="max-w-md mx-auto">
              <ZapierSetup 
                webhookUrl={zapierWebhook}
                setWebhookUrl={setZapierWebhook}
              />
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Setting Up Zapier</h3>
                <ol className="list-decimal ml-5 space-y-2 text-sm">
                  <li>Create a new Zap in Zapier</li>
                  <li>Choose "Webhook" as your trigger</li>
                  <li>Select "Catch Hook" and copy the webhook URL</li>
                  <li>Paste the URL in the field above</li>
                  <li>Set up an action in Zapier (email, Slack notification, etc.)</li>
                  <li>Test the connection using the button above</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t bg-white dark:bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 TechJobTracker - Your personal job search aggregator
        </div>
      </footer>
    </div>
  );
};

export default Index;
