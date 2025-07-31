import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shared/ui/tabs";
import { toast } from "sonner";
import AuthForm from "../features/KAuth/components/AuthForm";
import {
  LinkedinConfig,
  runLinkedinAutomation,
} from "../services/linkedinService";
import LinkedInAccountCard from "../components/linkedin/LinkedInAccountCard";
import JobSearchCard from "../components/linkedin/JobSearchCard";
import PersonalInfoCard from "../components/linkedin/PersonalInfoCard";
import AutomationLogs from "../components/linkedin/AutomationLogs";
import RunAutomationCard from "../components/linkedin/RunAutomationCard";
import HelpContent from "../components/linkedin/HelpContent";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

const LinkedInAutomation = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<LinkedinConfig>({
    email: "",
    password: "",
    disableAntiLock: false,
    remote: true,
    experienceLevel: { entry: true, mid: true, senior: false },
    jobTypes: {
      fulltime: true,
      contract: false,
      parttime: false,
      internship: false,
    },
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
    languages: { english: "Native" },
    industry: { default: 2 },
    technology: { default: 3 },
    personalInfo: {
      "First Name": "",
      "Last Name": "",
      "Mobile Phone Number": "",
      Linkedin: "",
      "Phone Country Code": "+1",
    },
    eeo: {},
    uploads: {
      resume: "",
    },
  });

  const handleInputChange = (field: keyof LinkedinConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !config.email ||
      !config.password ||
      config.positions.length === 0 ||
      config.locations.length === 0
    ) {
      toast.error(
        "Please fill in all required fields (email, password, positions, locations)"
      );
      return;
    }

    setLoading(true);
    setLogs([]);

    try {
      const result = await runLinkedinAutomation(config);

      if (result.success) {
        toast.success("LinkedIn automation started successfully!");
      } else {
        toast.error(`LinkedIn automation failed: ${result.message}`);
      }

      if (result.logs) {
        setLogs(result.logs);
      }
    } catch (error) {
      console.error("Error running LinkedIn automation:", error);
      toast.error("An error occurred while running LinkedIn automation");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <AuthProvider>
        <AuthForm />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 container mx-auto px-4 py-6 max-w-screen-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              LinkedIn Job Application Automation
            </h2>
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
                <LinkedInAccountCard
                  email={config.email}
                  password={config.password}
                  onEmailChange={(value) => handleInputChange("email", value)}
                  onPasswordChange={(value) =>
                    handleInputChange("password", value)
                  }
                />

                <JobSearchCard
                  remote={config.remote}
                  onPositionChange={(positions) =>
                    handleInputChange("positions", positions)
                  }
                  onLocationChange={(locations) =>
                    handleInputChange("locations", locations)
                  }
                  onRemoteChange={(checked) =>
                    handleInputChange("remote", checked)
                  }
                />

                <PersonalInfoCard
                  personalInfo={config.personalInfo}
                  onPersonalInfoChange={handlePersonalInfoChange}
                />

                <RunAutomationCard loading={loading} onSubmit={handleSubmit} />
              </div>
            </TabsContent>

            <TabsContent value="logs" className="pt-4">
              <AutomationLogs logs={logs} />
            </TabsContent>

            <TabsContent value="help" className="pt-4">
              <HelpContent />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t bg-background dark:bg-gray-900 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 TechJobTracker - Your personal job search aggregator
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default LinkedInAutomation;
