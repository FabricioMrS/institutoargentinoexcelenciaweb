
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
      <WhatsAppButton floating={true} />
    </>
  );
};

export default Index;
