import Hero from "@/components/Hero";
import About from "@/components/About";
import Advantages from "@/components/Advantages";
import AktualnosciSection from "@/components/AktualnosciSection";
import OsiagnieciaSection from "@/components/OsiagnieciaSection";
import TrainingGroups from "@/components/TrainingGroups";
import Coaches from "@/components/Coaches";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Advantages />
      <AktualnosciSection />
      <OsiagnieciaSection />
      <TrainingGroups />
      <Coaches />
      <CallToAction />
    </>
  );
}
