import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Job } from "../components/types";
import Footer from "../../src/components/homePage/Footer";
import FloatingActionButton from "../../src/components/dashboard/FloatingActionButton";
import AnimatedHeader from "../../src/components/homePage/AnimatedHeader";
import ContactSection from "../../src/components/homePage/ContactSection";
import FeaturedJobsSection from "../../src/components/homePage/FeaturedJobsSection";
import FeaturesSection from "../../src/components/homePage/FeaturesSection";
import HeroSection from "../../src/components/homePage/HeroSection";
import HowItWorksSection from "../../src/components/homePage/HowItWorksSection";
import OpenSourceBanner from "../../src/components/homePage/OpenSourceBanner";
import ServicesSection from "../../src/components/homePage/ServicesSection";
import TestimonialsSection from "../../src/components/homePage/TestimonialsSection";
import OurDevelopment from "../../src/components/homePage/Ourdevelopment";

const Index = () => {
  const [allJobsModalOpen, setAllJobsModalOpen] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  const handleViewAllJobs = (jobs: Job[]) => {
    setAllJobs(jobs);
    setAllJobsModalOpen(true);
  };

  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <OurDevelopment />
      <HowItWorksSection />
      <TestimonialsSection />
      <FeaturedJobsSection onViewAllJobs={handleViewAllJobs} />
      <OpenSourceBanner />
      <ContactSection />

      <Dialog open={allJobsModalOpen} onOpenChange={setAllJobsModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>All Jobs</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            {allJobs.length === 0 ? (
              <div>No jobs found.</div>
            ) : (
              allJobs.map((job) => (
                <div key={job.id} className="border-b pb-2">
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.company} &mdash; {job.location}
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    View Job
                  </a>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
