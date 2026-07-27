import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Services from '../components/landing/Services';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import ContactSection from '../components/landing/Contact';

const Home = () => {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
