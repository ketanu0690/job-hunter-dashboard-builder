import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import JobList from '@/components/JobList';
import ZapierSetup from '@/components/ZapierSetup';
import JobTableAdmin from '@/components/JobTableAdmin';
import ExcelImport from '@/components/ExcelImport';
import { sampleJobs } from '@/utils/jobData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchCriteria, Job } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchJobs, importSampleJobs } from '@/services/jobService';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [searchCriteria, setSearchCriteria] = useLocalStorage<SearchCriteria>('searchCriteria', {
    companies: [],
    skills: []
  });

  const [zapierWebhook, setZapierWebhook] = useLocalStorage<string>('zapierWebhook', '');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await fetchJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
  }, []);

  const handleImportSampleJobs = async () => {
    setImporting(true);
    try {
      await importSampleJobs(sampleJobs);
      const updatedJobs = await fetchJobs();
      setJobs(updatedJobs);
      toast({
        title: "Success",
        description: "Sample jobs have been imported successfully!",
      });
    } catch (error) {
      console.error('Error importing sample jobs:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleRefreshJobs = async () => {
    setLoading(true);
    try {
      const updatedJobs = await fetchJobs();
      setJobs(updatedJobs);
      toast({
        title: "Jobs Refreshed",
        description: `${updatedJobs.length} jobs loaded from the database.`,
      });
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const newJobsCount = jobs.filter(job => job.isNew).length;

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
            <TabsTrigger value="dev">Dev Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="pt-4">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={handleRefreshJobs}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Jobs'
                )}
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading jobs...</span>
              </div>
            ) : (
              <JobList jobs={jobs} searchCriteria={searchCriteria} />
            )}
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
          <TabsContent value="dev" className="pt-4">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ExcelImport />
                </div>
                
                <div className="max-w-md mx-auto">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">Developer Tools</h3>
                    <p className="text-sm mb-4">
                      These tools are for development and testing purposes only.
                    </p>
                    <Button 
                      onClick={handleImportSampleJobs} 
                      disabled={importing}
                      className="w-full"
                    >
                      {importing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        'Import Sample Jobs'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Database Inspection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and verify jobs stored in the database
                  </p>
                </div>
                <div className="p-4">
                  <JobTableAdmin />
                </div>
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
