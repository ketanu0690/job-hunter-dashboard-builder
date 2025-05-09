import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, Mail, Users } from "lucide-react";

const FeatureItem = ({
  icon,
  title,
  description,
  index,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  index: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed from true to false to allow re-triggering
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-24"
    >
      <div className="bg-card p-4 rounded-xl shadow border border-accent">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground max-w-lg">{description}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false, // Changed from true to false
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Briefcase size={32} className="text-primary" />,
      title: "Apply for jobs with one click",
      description:
        "Streamline your job application process with our intuitive platform. Apply to multiple positions with a single click and track your applications in real-time.",
    },
    {
      icon: <Mail size={32} className="text-primary" />,
      title: "Automate resume delivery",
      description:
        "Set up custom profiles and let our system deliver your tailored resume to the right recruiters. Receive notifications when your resume is viewed.",
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: "Connect with industry mentors",
      description:
        "Get valuable insights and guidance from industry professionals. Schedule 1:1 mentoring sessions and accelerate your career growth with expert advice.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-card"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive toolset helps you manage your job search
            effectively and land your dream role faster.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
