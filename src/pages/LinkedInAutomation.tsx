
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { runLinkedinAutomation, LinkedinConfig } from '@/services/linkedinService';

const LinkedInAutomation = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<LinkedinConfig>({
    email: '',
    password: '',
    disableAntiLock: false,
    remote: true,
    experienceLevel: { entry: true, mid: true, senior: false },
    jobTypes: { fulltime: true, contract: false, parttime: false, internship: false },
    date: { pastWeek: true },
    positions: [],
    locations: [],
    distance: 25,
    checkboxes: {
      driversLicence: false,
      requireVisa: false,
      legallyAuthorized: true,
      urgentFill: false,
      commute: false,
      backgroundCheck: true,
      degreeCompleted: true,
    },
    universityGpa: 3.5,
    languages: { english: 'Native' },
    industry: { default: 2 },
    technology: { default: 3 },
    personalInfo: {
      'First Name': '',
      'Last Name': '',
      'Mobile Phone Number': '',
      'Linkedin': '',
      'Phone Country Code': '+1'
    },
    eeo: {},
    uploads: {
      resume: '',
    },
  });

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      positions: e.target.value.split(',').map(item => item.trim())
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      locations: e.target.value.split(',').map(item => item.trim())
    }));
  };

  const handleInputChange = (field: keyof LinkedinConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!config.email || !config.password || config.positions.length === 0 || config.locations.length === 0) {
      toast.error('Please fill in all required fields (email, password, positions, locations)');
      return;
    }

    setLoading(true);
    setLogs([]);

    try {
      const result = await runLinkedinAutomation(config);
      
      if (result.success) {
        toast.success('LinkedIn automation started successfully!');
      } else {
        toast.error(`LinkedIn automation failed: ${result.message}`);
      }
      
      if (result.logs) {
        setLogs(result.logs);
      }
    } catch (error) {
      console.error('Error running LinkedIn automation:', error);
      toast.error('An error occurred while running LinkedIn automation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header newJobsCount={0} />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-screen-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">LinkedIn Job Application Automation</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automate your LinkedIn job applications using AI-powered tools
          </p>
        </div>
        
        <Tabs defaultValue="config" className="mb-10">
          <TabsList>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LinkedIn Account</CardTitle>
                  <CardDescription>Enter your LinkedIn credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={config.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={config.password} 
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
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
                      checked={config.remote}
                      onCheckedChange={(checked) => handleInputChange('remote', checked)}
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your profile details for applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={config.personalInfo['First Name']} 
                      onChange={(e) => handlePersonalInfoChange('First Name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={config.personalInfo['Last Name']} 
                      onChange={(e) => handlePersonalInfoChange('Last Name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      value={config.personalInfo['Mobile Phone Number']} 
                      onChange={(e) => handlePersonalInfoChange('Mobile Phone Number', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Run Automation</CardTitle>
                  <CardDescription>Start the LinkedIn application process</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    The automation will log into your LinkedIn account and apply to jobs matching your criteria.
                    This process runs in the background on our secure server.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Running Automation...' : 'Start LinkedIn Automation'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Automation Logs</CardTitle>
                <CardDescription>Real-time progress of your LinkedIn automation</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length > 0 ? (
                  <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-96 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div key={index} className="mb-1">[{new Date().toLocaleTimeString()}] {log}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No logs available. Start the automation to see progress here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="help" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>How to Use LinkedIn Automation</CardTitle>
                <CardDescription>Guide to automating your job applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Getting Started</h3>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Enter your LinkedIn email and password</li>
                    <li>Define job positions you're looking for (separated by commas)</li>
                    <li>Specify locations where you want to work</li>
                    <li>Provide your personal information for applications</li>
                    <li>Click "Start LinkedIn Automation" button</li>
                  </ol>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Important Notes</h3>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Your credentials are securely processed on our backend</li>
                    <li>You may receive LinkedIn security checks if applying to many jobs</li>
                    <li>The automation runs on our secure server and will continue even if you close this page</li>
                    <li>Check the Logs tab to monitor application progress</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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

export default LinkedInAutomation;
