import FloatingActionButton from "../components/dashboard/FloatingActionButton";
import ContactSection from "../features/KMentor/components/homePage/ContactSection";
import FeaturesSection from "../features/KMentor/components/homePage/FeaturesSection";
import HeroSection from "../features/KMentor/components/homePage/HeroSection";
import HowItWorksSection from "../features/KMentor/components/homePage/HowItWorksSection";
import OpenSourceBanner from "../features/KMentor/components/homePage/OpenSourceBanner";
import ServicesSection from "../features/KMentor/components/homePage/ServicesSection";
import TestimonialsSection from "../features/KMentor/components/homePage/TestimonialsSection";
import OurDevelopment from "../features/KMentor/components/homePage/Ourdevelopment";

const KMentor = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <OurDevelopment />
      <OpenSourceBanner />
      <ContactSection />
      <FloatingActionButton />
    </>
  );
};

export default KMentor;
