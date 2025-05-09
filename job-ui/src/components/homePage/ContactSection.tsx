import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { toast } from "../ui/sonner";

const ContactSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const formControls = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Your name",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your.email@example.com",
      required: true,
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      placeholder: "How can we help?",
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about the platform? Want to join our team? We'd love
            to hear from you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-1"
            >
              <div className="bg-card border border-accent rounded-xl p-8 h-full">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-accent/20 p-2">
                      <Mail size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">contact@jobplatform.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-accent/20 p-2">
                      <Phone size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-2"
            >
              <div className="bg-card border border-accent rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {formControls.map((control, index) => (
                      <div
                        key={control.name}
                        className={
                          control.name === "subject" ? "sm:col-span-2" : ""
                        }
                      >
                        <Label htmlFor={control.name}>{control.label}</Label>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={
                            sectionInView
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 10 }
                          }
                          transition={{
                            duration: 0.6,
                            delay: 0.6 + index * 0.1,
                          }}
                        >
                          <Input
                            id={control.name}
                            name={control.name}
                            type={control.type}
                            placeholder={control.placeholder}
                            value={
                              formState[control.name as keyof typeof formState]
                            }
                            onChange={handleChange}
                            required={control.required}
                            className="mt-2"
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        sectionInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        value={formState.message}
                        onChange={handleChange}
                        required
                        className="mt-2 min-h-32"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      sectionInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground yellow-border yellow-hover yellow-focus yellow-glow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
