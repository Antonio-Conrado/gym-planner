import Hero from "@/features/landing/components/Hero";
import Facilities from "@/features/landing/components/Facilities";
import Plans from "@/features/landing/components/Plans";
import Testimonials from "@/features/landing/components/Testimonials";
import Contact from "@/features/landing/components/Contact";
import CallToAction from "@/features/landing/components/CallToAction";
import Footer from "@/features/landing/components/Footer";
import Benefits from "@/features/landing/components/Benefits";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Benefits />
      <Facilities />
      <Plans />
      <Testimonials />
      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
}
