import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {

  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../shared/ui/card";

const services = [
  {
    title: "Job Matching",
    description: "AI-powered job suggestions that match your skills and goals.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Resume Builder",
    description: "Craft standout resumes with expert-designed templates.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 0a2 2 0 012-2h2a2 2 0 012 2M9 12h.01M9 16h.01m3-4h3m-3 4h3"
        />
      </svg>
    ),
  },
  {
    title: "Interview Prep",
    description: "Get ready with mock interviews and expert coaching.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2z"
        />
      </svg>
    ),
  },
  {
    title: "Career Analytics",
    description: "Visualize and track your career progress over time.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
  {
    title: "AI Analytics",
    description: "Leverage machine learning to unlock career insights.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 11V5a1 1 0 012 0v6m-1 2a2 2 0 110 4 2 2 0 010-4zm0 6v2m8-2a2 2 0 100 4 2 2 0 000-4zm0-2v2m-4-10h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h4"
        />
      </svg>
    ),
  },
  {
    title: "Career Guidance",
    description: "Get expert advice to shape your career direction.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0H5m7 0h7"
        />
      </svg>
    ),
  },
  {
    title: "Certifications",
    description: "Earn recognized credentials to boost your resume.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12l4.553-2.276A2 2 0 0020 7.894V6a2 2 0 00-2-2H6a2 2 0 00-2 2v1.894a2 2 0 00.447 1.83L9 12m6 0v8l-3-1.5L9 20v-8"
        />
      </svg>
    ),
  },
  {
    title: "In-Office Collaboration",
    description: "Collaborate on-site with mentors and teams.",
    icon: (
      <svg
        className="h-8 w-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h18M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7M6 11h12"
        />
      </svg>
    ),
  },
  {
    title: "One-to-One Online Meetings",
    description: "Connect privately with experts for personalized support.",
    icon: (
      <div className="relative">
        <svg
          className="h-8 w-8 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A2 2 0 0020 5.894V5a2 2 0 00-2-2H6a2 2 0 00-2 2v.894a2 2 0 00.447 1.83L9 10m6 0v8l-3-1.5L9 18v-8"
          />
        </svg>
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">
          New
        </span>
      </div>
    ),
  },
];

const ServiceCard = ({
  title,
  description,
  icon,
  isActive,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
  isActive: boolean;
}) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`min-w-[280px] max-w-[300px] flex-shrink-0 mx-2 rounded-xl h-full ${
        isActive
          ? "border-2 border-orange-500 shadow-lg"
          : "border border-gray-200"
      } bg-white`}
    >
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="h-1 bg-gradient-to-r from-indigo-500 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </CardContent>
    </motion.div>
  );
};

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (dir: "prev" | "next") => {
    const cardWidth = 300;
    const container = scrollRef.current;
    if (!container) return;
    let newIndex = dir === "next" ? activeIndex + 1 : activeIndex - 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > services.length - 1) newIndex = services.length - 1;
    container.scrollTo({
      left: cardWidth * newIndex,
      behavior: "smooth",
    });
    setActiveIndex(newIndex);
  };

  return (
    <section className="py-20 bg-gray-50 text-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Discover how our mentors help you grow with personalized tools.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollToCard("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md p-2 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={() => scrollToCard("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md p-2 rounded-full"
          >
            ▶
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar py-4 px-2 scroll-smooth"
            style={{ overflow: "hidden" }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                isActive={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
