import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Advantages from "@/components/Advantages";
import TrainingGroups from "@/components/TrainingGroups";
import Coaches from "@/components/Coaches";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Advantages />
        <TrainingGroups />
        <Coaches />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
