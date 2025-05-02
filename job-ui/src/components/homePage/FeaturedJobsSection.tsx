import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Job } from "../../types";

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

const FeaturedJobsSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [carouselRef, carouselInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const featuredJobs: Job[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechVision",
      location: "Remote",
      description:
        "Lead the frontend team in building modern web applications.",
      url: "https://techvision.com/jobs/1",
      date: "2024-06-01",
      salary: "$120K - $150K",
      skills: ["React", "TypeScript", "UI/UX", "Next.js"],
      source: "TechVision Careers",
      isNew: true,
    },
    {
      id: "2",
      title: "Backend Engineer",
      company: "DataStream",
      location: "New York, NY",
      description: "Work on scalable backend systems and APIs.",
      url: "https://datastream.com/jobs/2",
      date: "2024-05-28",
      salary: "$130K - $160K",
      skills: ["Node.js", "Python", "AWS", "Microservices"],
      source: "DataStream Careers",
    },
    {
      id: "3",
      title: "Product Designer",
      company: "CreativeEdge",
      location: "San Francisco, CA",
      description: "Design intuitive products and user experiences.",
      url: "https://creativeedge.com/jobs/3",
      date: "2024-05-25",
      skills: ["Figma", "UI Design", "User Research"],
      source: "CreativeEdge Careers",
    },
    {
      id: "4",
      title: "DevOps Specialist",
      company: "CloudWorks",
      location: "Remote",
      description: "Automate and optimize cloud infrastructure.",
      url: "https://cloudworks.com/jobs/4",
      date: "2024-05-20",
      salary: "$110K - $140K",
      skills: ["Kubernetes", "Docker", "CI/CD", "Infrastructure"],
      source: "CloudWorks Careers",
    },
    {
      id: "5",
      title: "Mobile Developer",
      company: "AppNest",
      location: "Austin, TX",
      description: "Develop cross-platform mobile applications.",
      url: "https://appnest.com/jobs/5",
      date: "2024-05-18",
      salary: "$100K - $130K",
      skills: ["Swift", "Kotlin", "React Native", "Flutter"],
      source: "AppNest Careers",
    },
  ];

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
            {featuredJobs.map((job, index) => (
              <div key={job.id} className="w-80 sm:w-auto">
                <JobCard job={job} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex justify-center mt-12">
          <Button className="px-8">
            View All Jobs <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
