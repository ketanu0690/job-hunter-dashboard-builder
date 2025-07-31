import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

interface RunAutomationCardProps {
  loading: boolean;
  onSubmit: () => void;
}

const RunAutomationCard: React.FC<RunAutomationCardProps> = ({
  loading,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Automation</CardTitle>
        <CardDescription>
          Start the LinkedIn application process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          The automation will log into your LinkedIn account and apply to jobs
          matching your criteria. This process runs in the background on our
          secure server.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={loading} className="w-full">
          {loading ? "Running Automation..." : "Start LinkedIn Automation"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RunAutomationCard;
