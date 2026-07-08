import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SkyReveal from "./components/SkyReveal.jsx";
import LotSummary from "./components/LotSummary.jsx";
import InteractiveMasterplan from "./components/InteractiveMasterplan.jsx";
import ProjectTimeline from "./components/ProjectTimeline.jsx";
import WhyAttappadi from "./components/WhyAttappadi.jsx";
import InvestorBenefits from "./components/InvestorBenefits.jsx";
import FutureVision from "./components/FutureVision.jsx";
import Typologies from "./components/Typologies.jsx";
import Amenities from "./components/Amenities.jsx";
import Gallery from "./components/Gallery.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SkyReveal />
      <LotSummary />
      <InteractiveMasterplan />
      <ProjectTimeline />
      <WhyAttappadi />
      <InvestorBenefits />
      <FutureVision />
      <Typologies />
      <Amenities />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
