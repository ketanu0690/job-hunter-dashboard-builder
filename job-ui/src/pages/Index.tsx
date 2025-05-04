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
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <OurDevelopment/>
      <HowItWorksSection />
      <TestimonialsSection />
      <FeaturedJobsSection />
      <OpenSourceBanner />
      <ContactSection />

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
