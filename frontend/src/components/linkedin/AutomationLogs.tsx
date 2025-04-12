
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AutomationLogsProps {
  logs: string[];
}

const AutomationLogs: React.FC<AutomationLogsProps> = ({ logs }) => {
  return (
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
  );
};

export default AutomationLogs;
