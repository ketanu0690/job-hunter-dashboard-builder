import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Job } from "../../types";
import { useEffect, useState } from "react";
import {
  fetchTheirStackJobs,
  TheirStackJob,
} from "../../services/theirStackJobService";

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
      className="bg-futuristic-card border border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col h-full shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-futuristic-darker rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-futuristic-accent rounded-md flex items-center justify-center text-white font-bold">
            {job.company.charAt(0)}
          </div>
        </div>
        {job.isNew && (
          <span className="text-xs bg-accent text-white px-2 py-1 rounded-full ml-2">
            New
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
      <p className="text-muted-foreground mb-2">{job.company}</p>
      <p className="text-sm mb-4">{job.location}</p>
      <p className="text-xs text-gray-400 mb-2">Posted: {job.date}</p>
      {job.salary && (
        <p className="text-neon-green text-sm mb-4">{job.salary}</p>
      )}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="bg-futuristic-darker text-xs px-2 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="group w-full justify-between"
          asChild
        >
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            View Job
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

const FeaturedJobsSection = ({
  onViewAllJobs,
}: {
  onViewAllJobs?: (jobs: Job[]) => void;
}) => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [carouselRef, carouselInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTheirStackJobs();
        // Defensive: fallback to empty array if jobs is missing or not an array
        const jobsArray = Array.isArray(response.jobs) ? response.jobs : [];
        // Map TheirStackJob to Job type
        const mappedJobs: Job[] = jobsArray.map((job: TheirStackJob) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location || "",
          description: job.description || "",
          url: job.url || "#",
          date: job.posted_at || "",
          salary: job.salary || "",
          skills: job.skills || [],
          source: job.source || "TheirStack",
          isNew: true,
        }));
        setJobs(mappedJobs);
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-futuristic-dark to-futuristic-darker"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Jobs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our hand-picked opportunities from top companies
          </p>
        </motion.div>

        <div ref={carouselRef} className="overflow-x-auto pb-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={
              carouselInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
            }
            transition={{ duration: 0.8 }}
            className="flex gap-6 min-w-max sm:min-w-0 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {loading ? (
              <div className="text-center w-full">Loading featured jobs...</div>
            ) : error ? (
              <div className="text-center w-full text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center w-full">No featured jobs found.</div>
            ) : (
              jobs.slice(0, 8).map((job, index) => (
                <div key={job.id} className="w-80 sm:w-auto">
                  <JobCard job={job} index={index} />
                </div>
              ))
            )}
          </motion.div>
        </div>

        <div className="flex justify-center mt-12">
          <Button
            className="px-8"
            onClick={() => onViewAllJobs && onViewAllJobs(jobs)}
          >
            View All Jobs <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
