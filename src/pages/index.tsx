import CarrearProgress from "@/components/CareerProgress";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import Widget from "@/components/Widget";

export default function Home() {
  return (
    <main className="h-screen bg-white dark:bg-gray-800">
      <HeroSection />
      {/* componente vazio */}
      {/* <About /> */}
      {/* <CarrearProgress /> */}
      {/* <SkillsSection /> */}
      <Footer />
      <Widget />
    </main>
  );
}
