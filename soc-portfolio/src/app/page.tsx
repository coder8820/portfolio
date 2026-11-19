import StatusBar from "@/components/StatusBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CyberSpiderBackground from "@/components/CyberSpiderBackground";

export default function Home() {
  return (
    <>
      <CyberSpiderBackground />
      <StatusBar />
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
