
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const HelpContent: React.FC = () => {
  return (
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
  );
};

export default HelpContent;
