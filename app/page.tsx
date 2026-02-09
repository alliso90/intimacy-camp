import dynamic from "next/dynamic";
import { Header } from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

// Dynamically import heavy components to reduce initial bundle size
const HeroSection = dynamic(() => import("@/src/components/sections/HeroSection").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-screen" />,
});

const TheArmySection = dynamic(() => import("@/src/components/sections/TheArmySection").then(mod => ({ default: mod.TheArmySection })), {
  loading: () => <div className="min-h-[400px]" />,
});

const WhoWeAreSection = dynamic(() => import("@/src/components/sections/WhoWeAreSection").then(mod => ({ default: mod.WhoWeAreSection })), {
  loading: () => <div className="min-h-[400px]" />,
});

const VisionMissionSection = dynamic(() => import("@/src/components/sections/VisionMissionSection").then(mod => ({ default: mod.VisionMissionSection })), {
  loading: () => <div className="min-h-[400px]" />,
});

const InitiativesSection = dynamic(() => import("@/src/components/sections/InitiativesSection").then(mod => ({ default: mod.InitiativesSection })), {
  loading: () => <div className="min-h-[400px]" />,
});

const FeaturesSection = dynamic(() => import("@/src/components/sections/FeaturesSection").then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="min-h-[400px]" />,
});

const TestimonialsSection = dynamic(() => import("@/src/components/sections/TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="min-h-[400px]" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TheArmySection />
      <WhoWeAreSection />
      <VisionMissionSection />
      <InitiativesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
