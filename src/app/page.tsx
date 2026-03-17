import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Problema from "@/components/sections/Problema";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Features from "@/components/sections/Features";
import Planos from "@/components/sections/Planos";
import Depoimentos from "@/components/sections/Depoimentos";
import FAQ from "@/components/sections/FAQ";
import CTAFinal from "@/components/sections/CTAFinal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problema />
        <ComoFunciona />
        <Features />
        <Planos />
        <Depoimentos />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
