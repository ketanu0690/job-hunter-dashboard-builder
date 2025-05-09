import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="bg-card border border-accent rounded-xl p-8 backdrop-blur-sm shadow-lg"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
      <blockquote className="text-lg italic">"{testimonial.quote}"</blockquote>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Frontend Developer",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "This platform transformed my job search. Within two weeks, I landed interviews with three top tech companies and received my dream offer!",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "DevOps Engineer",
      company: "CloudSystems",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "The mentor connections were invaluable. I received personalized advice that helped me negotiate a 20% higher salary than initially offered.",
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Product Manager",
      company: "InnovateTech",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote:
        "The resume builder and application tracking features streamlined my job search process and helped me stay organized during multiple interviews.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from professionals who found their dream jobs using our
            platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
