import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  index: number;
  total: number;
  inView: boolean;
  prevInView: boolean;
  isLeft: boolean;
}

const VERTICAL_GAP = 140; // increased vertical distance between steps
const CONTAINER_WIDTH = 700; // px
const LEFT_X = 0.2 * CONTAINER_WIDTH;
const RIGHT_X = 0.8 * CONTAINER_WIDTH;
const STEP_RADIUS = 24;

const Step = ({
  number,
  title,
  description,
  index,
  total,
  inView,
  prevInView,
  isLeft,
}: StepProps) => {
  return (
    <div
    // className={`flex items-start gap-4 ${
    //   isLeft ? "flex-row" : "flex-row-reverse"
    // }`}
    >
      {/* Step Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary text-white font-bold text-lg shadow-lg shrink-0 z-10"
      >
        {number}
      </motion.div>

      {/* Step Content */}
      <div
        className={`mt-1 max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] ${
          isLeft ? "text-left" : "text-right"
        }`}
      >
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description:
        "Sign up and build your professional profile with your resume, skills, and job preferences.",
    },
    {
      number: 2,
      title: "Discover Opportunities",
      description:
        "Browse curated job listings matching your skills and experience, or receive recommendations.",
    },
    {
      number: 3,
      title: "Apply With Ease",
      description:
        "Submit applications with one click and track your application status in real-time.",
    },
    {
      number: 4,
      title: "Prepare & Interview",
      description:
        "Get interview prep resources and schedule follow-ups directly through the platform.",
    },
  ];

  // Track inView for each step
  const [stepsInView, setStepsInView] = React.useState(
    Array(steps.length).fill(false)
  );
  const stepRefs = React.useRef(
    steps.map(() => React.createRef<HTMLDivElement>())
  );

  React.useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref.current) return null;
      return new window.IntersectionObserver(
        ([entry]) => {
          setStepsInView((prev) => {
            const updated = [...prev];
            updated[i] = entry.isIntersecting;
            return updated;
          });
        },
        { threshold: 0.5 }
      );
    });
    stepRefs.current.forEach((ref, i) => {
      if (ref.current && observers[i]) observers[i]!.observe(ref.current);
    });
    return () => {
      observers.forEach((observer, i) => {
        if (observer && stepRefs.current[i].current)
          observer.unobserve(stepRefs.current[i].current!);
      });
    };
  }, []);

  // Define edges as objects: from and to step indices
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];

  return (
    <section
      ref={sectionRef}
      className="mb-24 md:mb-32 lg:mb-40 hidden sm:block"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your job search experience and find
            your ideal position
          </p>
        </motion.div>

        <div
          className="relative mx-auto flex flex-col items-center max-w-[700px] w-full"
          style={{
            minHeight: (steps.length - 1) * VERTICAL_GAP + STEP_RADIUS * 2 + 40,
            width: CONTAINER_WIDTH,
          }}
        >
          {/* SVG for workflow edges */}
          <svg
            className="absolute left-0 top-0 z-0"
            width={CONTAINER_WIDTH}
            height={(steps.length - 1) * VERTICAL_GAP + STEP_RADIUS * 2}
            style={{ pointerEvents: "none", width: CONTAINER_WIDTH }}
          >
            {edges.map((edge, i) => {
              // Use consistent X positions for left/right steps
              const fromIsLeft = edge.from % 2 === 0;
              const toIsLeft = edge.to % 2 === 0;
              const fromY = edge.from * VERTICAL_GAP + STEP_RADIUS;
              const toY = edge.to * VERTICAL_GAP + STEP_RADIUS;
              const fromX = fromIsLeft ? LEFT_X : RIGHT_X;
              const toX = toIsLeft ? LEFT_X : RIGHT_X;
              // Add a small margin so the arrowhead sits just outside the circle
              const arrowMargin = 4;
              const fromXAdj = fromIsLeft
                ? fromX + arrowMargin
                : fromX - arrowMargin;
              const toXAdj = toIsLeft ? toX + arrowMargin : toX - arrowMargin;
              const d = `M ${fromXAdj} ${fromY} C ${fromXAdj} ${
                (fromY + toY) / 2
              }, ${toXAdj} ${(fromY + toY) / 2}, ${toXAdj} ${toY}`;
              return (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="url(#timeline-gradient)"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: stepsInView[edge.to] ? 1 : 0 }}
                  transition={{ duration: 0.7, delay: 0.2 * (i + 1) }}
                  style={{ pathLength: stepsInView[edge.to] ? 1 : 0 }}
                />
              );
            })}
            <defs>
              <linearGradient
                id="timeline-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="hsl(var(--accent))" />
              </marker>
            </defs>
          </svg>
          {/* Steps */}
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                ref={stepRefs.current[index]}
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  top: index * VERTICAL_GAP + STEP_RADIUS,
                  left: isLeft ? LEFT_X - STEP_RADIUS : RIGHT_X - STEP_RADIUS,
                }}
              >
                <Step
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  index={index}
                  total={steps.length}
                  inView={stepsInView[index]}
                  prevInView={index === 0 ? true : stepsInView[index - 1]}
                  isLeft={isLeft}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
