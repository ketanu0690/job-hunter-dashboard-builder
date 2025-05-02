import {
  Award,
  Send,
  Briefcase,
  Users,
  Newspaper,
  LinkedinIcon,
  BookOpen,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricsCard from "../components/dashboard/MetricsCard";
import ChartCard from "../components/dashboard/ChartCard";
import AutomationCard from "../components/dashboard/AutomationCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";

// Sample data for charts
const applicationData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 25 },
  { name: "Fri", value: 32 },
  { name: "Sat", value: 14 },
  { name: "Sun", value: 7 },
];

const connectionData = [
  { name: "Week 1", value: 25 },
  { name: "Week 2", value: 40 },
  { name: "Week 3", value: 30 },
  { name: "Week 4", value: 58 },
  { name: "Week 5", value: 65 },
  { name: "Week 6", value: 72 },
];

const jobRecommendations = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description: "React, TypeScript, UI/UX",
    score: 94,
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    description: "Node.js, React, MongoDB",
    score: 87,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    description: "Figma, Adobe XD, Prototyping",
    score: 82,
  },
];

const skillRecommendations = [
  {
    id: "1",
    title: "GraphQL",
    description: "Growing demand in job listings +24%",
  },
  {
    id: "2",
    title: "System Design",
    description: "Required in 68% of senior roles",
  },
  {
    id: "3",
    title: "AWS Cloud",
    description: "Mentioned in 72% of job descriptions",
  },
];
const AdminDashboard = () => {
  // Get current date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <DashboardLayout>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-primary mb-1">
                Welcome back, Alex
              </h1>
              <p className="text-accent dark:text-accent">{today}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <div className="px-3 py-1 bg-accent/80 rounded-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                <span className="text-xs text-accent-foreground">
                  Job Seeker Mode
                </span>
              </div>
              <div className="w-px h-6 bg-primary/20 mx-2"></div>
              <div className="flex items-center bg-gradient-to-r from-secondary/80 to-accent/80 px-3 py-1 rounded-full">
                <Award size={14} className="text-primary mr-2" />
                <span className="text-xs text-primary">Level 3 Networker</span>
              </div>
            </div>
          </div>

          {/* Analytics Overview Section with gradient */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
            <MetricsCard
              title="Jobs Applied"
              value={143}
              icon={Briefcase}
              change={{ value: 12, isPositive: true }}
              variant="default"
            />
            <MetricsCard
              title="Connections"
              value={287}
              icon={Users}
              change={{ value: 8, isPositive: true }}
              variant="success"
            />
            <MetricsCard
              title="Messages Sent"
              value={64}
              icon={Send}
              change={{ value: 5, isPositive: false }}
              variant="warning"
            />
            <MetricsCard
              title="Published Blogs"
              value={7}
              icon={Newspaper}
              change={{ value: 2, isPositive: true }}
              variant="info"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6 bg-secondary/20 border border-secondary/30 rounded-xl p-4">
              {/* Application Progress Chart */}
              <ChartCard
                title="Application Activity"
                subtext="Daily job application statistics"
                data={applicationData}
                dataKey="value"
              />

              {/* Automation Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutomationCard
                  title="LinkedIn Easy Apply"
                  description="Automate your job applications with one-click apply to matched positions."
                  icon={LinkedinIcon}
                  stats={{ label: "Jobs Applied", value: "43 this week" }}
                  variant="linkedin"
                />
                <AutomationCard
                  title="Naukri Quick Apply"
                  description="Streamline your job search with automated applications on Naukri."
                  icon={Briefcase}
                  stats={{ label: "Success Rate", value: "87%" }}
                  variant="naukri"
                />
                <AutomationCard
                  title="Smart Connections"
                  description="AI-powered connection requests with personalized messages."
                  icon={Users}
                  stats={{ label: "Acceptance Rate", value: "76%" }}
                  variant="linkedin"
                />
                <AutomationCard
                  title="AI Blog Assistant"
                  description="Create professional blog content with AI writing assistance."
                  icon={BookOpen}
                  stats={{ label: "Blogs Published", value: "7" }}
                  variant="content"
                />
              </div>

              {/* Network Growth Chart */}
              <ChartCard
                title="Network Growth"
                subtext="Weekly connection statistics"
                data={connectionData}
                dataKey="value"
              />
            </div>

            {/* Right Column - Recommendations */}
            <div className="space-y-6 bg-accent/20 border border-accent/30 rounded-xl p-4">
              {/* Job Matches */}
              <RecommendationCard
                title="AI Job Matches"
                type="job"
                items={jobRecommendations}
              />

              {/* Skill Enhancement */}
              <RecommendationCard
                title="Skill Enhancement"
                type="skill"
                items={skillRecommendations}
              />

              {/* Gamification Badge */}
              <div className="p-5 relative overflow-hidden rounded-xl bg-background/70 dark:bg-gray-800/70 backdrop-blur shadow-md">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-green-400 opacity-20 blur-xl"></div>
                <div className="relative z-10">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Award size={16} className="text-purple-400 mr-2" />
                    Networking Achievements
                  </h3>
                  <div className="my-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center relative">
                      <div className="absolute inset-0 border-2 border-purple-400 rounded-full animate-pulse opacity-75"></div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                        Lv 3
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-300">
                        Next Level
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        75/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-green-400 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-2">
                      25 more connections to reach Level 4
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AdminDashboard;
