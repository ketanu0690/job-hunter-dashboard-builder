import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../shared/ui/dialog";
import Footer from "../features/KMentor/components/homePage/Footer";
import FloatingActionButton from "../components/dashboard/FloatingActionButton";
import ContactSection from "../features/KMentor/components/homePage/ContactSection";
import FeaturedJobsSection from "../features/KMentor/components/homePage/FeaturedJobsSection";
import FeaturesSection from "../features/KMentor/components/homePage/FeaturesSection";
import HeroSection from "../features/KMentor/components/homePage/HeroSection";
import HowItWorksSection from "../features/KMentor/components/homePage/HowItWorksSection";
import OpenSourceBanner from "../features/KMentor/components/homePage/OpenSourceBanner";
import ServicesSection from "../features/KMentor/components/homePage/ServicesSection";
import TestimonialsSection from "../features/KMentor/components/homePage/TestimonialsSection";
import OurDevelopment from "../features/KMentor/components/homePage/Ourdevelopment";
import { Job } from "@/shared/types";

const KMentor = () => {
  const [allJobsModalOpen, setAllJobsModalOpen] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  const handleViewAllJobs = (jobs: Job[]) => {
    setAllJobs(jobs);
    setAllJobsModalOpen(true);
  };

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      {/* <FeaturedJobsSection onViewAllJobs={handleViewAllJobs} /> */}
      <OurDevelopment />
      <OpenSourceBanner />
      <ContactSection />
      <Footer />
      <FloatingActionButton />

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
                    className="text-link underline text-sm"
                  >
                    View Job
                  </a>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KMentor;
