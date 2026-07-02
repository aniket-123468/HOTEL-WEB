import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GoldDivider from '../components/GoldDivider';
import Button from '../components/Button';
import TestimonialSlider from '../components/TestimonialSlider';

import imgGrandLobby from '../assets/hotel_grand_lobby.png';
import imgImperialSuite from '../assets/hotel_imperial_suite.png';
import imgFineDining from '../assets/hotel_fine_dining.png';
import imgRooftopPool from '../assets/hotel_rooftop_pool.png';
import imgSpaSanctuary from '../assets/hotel_spa_sanctuary.png';
import imgHeritageCorridor from '../assets/hotel_heritage_corridor.png';
import imgBreakfastSpread from '../assets/hotel_breakfast_spread.png';
import imgCourtyardGarden from '../assets/hotel_courtyard_garden.png';

// Fade-up animation variant for scroll sections
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Delhi Line Hotel — Heritage Modern Luxury, New Delhi</title>
        <meta
          name="description"
          content="Experience the pinnacle of heritage hospitality at Delhi Line Hotel. Iconic suites, Michelin-starred dining, and bespoke experiences in the heart of New Delhi."
        />
      </Helmet>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative h-screen w-full flex items-center overflow-hidden -mt-20">
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-gradient z-10 pointer-events-none" />

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={imgGrandLobby}
            alt="Grand luxury hotel lobby in Delhi — soaring ceilings, marble floors, crystal chandeliers"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-20 px-5 md:px-[80px] max-w-[1280px] mx-auto w-full text-white">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          >
            <p className="font-label-caps text-label-caps mb-6 tracking-[0.3em] text-secondary-fixed">
              DELHI LINE HOTEL
            </p>
            <h1 className="font-display-lg text-[40px] md:text-display-lg mb-8 leading-tight">
              The Heritage of Hospitality
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <Button variant="ghost-white" size="lg" onClick={() => navigate('/rooms')}>
                Discover More
              </Button>
              <Button variant="ghost-white" size="lg">
                Virtual Tour
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          INTRO / LEGACY SECTION
          ================================================================ */}
      <section className="py-32 bg-surface">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Image with decorative corner bracket */}
          <AnimatedSection className="relative">
            <div className="absolute -top-12 -left-12 w-48 h-48 border-t border-l border-secondary/40 pointer-events-none" />
            <img
              src={imgCourtyardGarden}
              alt="Mughal-style inner courtyard garden at twilight"
              className="w-full aspect-[4/5] object-cover shadow-2xl relative z-10"
            />
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection className="flex flex-col">
            <h2 className="font-headline-md text-headline-md mb-8 text-primary">
              A Legacy Reimagined for the Modern Traveler
            </h2>
            <GoldDivider className="mb-10" />
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              At Delhi Line, we intertwine the storied architectural grandeur of the capital with a
              contemporary design ethos. Every corner tells a story of meticulous craft, from
              hand-laid marble mosaics to the bespoke gold-leaf finishes that capture the golden hour.
            </p>
            <Button variant="text" onClick={() => navigate('/')}>
              Explore Our Philosophy
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          SIGNATURE SUITES — BENTO GRID
          ================================================================ */}
      <section className="py-32 bg-surface-container-low">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-20">
            <p className="font-label-caps text-label-caps text-secondary mb-4">ACCOMMODATION</p>
            <h2 className="font-display-lg text-headline-md" style={{ fontFamily: '"Playfair Display", serif' }}>
              Signature Suites
            </h2>
          </AnimatedSection>

          {/* Bento grid — col-8 featured + col-4 two-stack */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
            {/* Featured suite — col-8 */}
            <AnimatedSection className="md:col-span-8 group relative overflow-hidden bg-white shadow-ambient">
              <img
                src={imgImperialSuite}
                alt="Presidential suite with panoramic Delhi skyline view — king bed, ivory silk chairs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <span className="bg-surface/20 backdrop-blur-md text-white px-3 py-1 text-xs tracking-widest font-label-caps mb-4 w-fit">
                  SEA VIEW
                </span>
                <h3 className="text-white font-headline-md text-headline-md">The Imperial Suite</h3>
                <p className="text-white/80 font-body-md mt-2 max-w-md">
                  Our premier residence offering unparalleled vistas and a private butler service.
                </p>
              </div>
            </AnimatedSection>

            {/* Two smaller suites — col-4, 2 rows */}
            <div className="md:col-span-4 grid grid-rows-2 gap-8">
              <AnimatedSection className="group relative overflow-hidden bg-white shadow-ambient">
                <img
                  src={imgHeritageCorridor}
                  alt="Heritage Chamber with mahogany writing desk and warm reading nook"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <h3 className="text-white font-headline-sm text-headline-sm">Heritage Chambers</h3>
                </div>
              </AnimatedSection>

              <AnimatedSection className="group relative overflow-hidden bg-white shadow-ambient">
                <img
                  src={imgSpaSanctuary}
                  alt="Sanctuary Spa Room with carved stone soaking tub and courtyard garden view"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <h3 className="text-white font-headline-sm text-headline-sm">Sanctuary Spa Rooms</h3>
                </div>
              </AnimatedSection>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="ghost" onClick={() => navigate('/rooms')}>
              View All Accommodations
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================
          THE LINE RESTAURANT
          ================================================================ */}
      <section className="relative py-40 overflow-hidden bg-primary text-on-primary">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
            {/* Text */}
            <AnimatedSection>
              <p className="font-label-caps text-label-caps text-secondary-fixed-dim mb-6 tracking-widest">
                FINE DINING
              </p>
              <h2 className="font-display-lg text-[40px] md:text-display-lg mb-10">
                The Line Restaurant
              </h2>
              <p className="font-body-lg text-body-lg text-surface-variant/80 mb-12 leading-relaxed">
                A culinary journey that traces the geometric precision of modern gastronomy while
                honoring ancestral flavors. Led by Michelin-awarded chefs, The Line offers an
                omakase-style experience that evolves with the seasons.
              </p>

              {/* Stats */}
              <div className="flex gap-10 mb-16">
                <div className="border-l border-secondary-fixed-dim/30 pl-6">
                  <span className="block font-headline-sm text-headline-sm text-secondary-fixed">120+</span>
                  <span className="font-label-caps text-[10px] text-surface-variant/50">VINTAGE LABELS</span>
                </div>
                <div className="border-l border-secondary-fixed-dim/30 pl-6">
                  <span className="block font-headline-sm text-headline-sm text-secondary-fixed">3</span>
                  <span className="font-label-caps text-[10px] text-surface-variant/50">CHEF'S HATS</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-on-secondary"
                onClick={() => navigate('/dining')}
              >
                Reserve a Table
              </Button>
            </AnimatedSection>

            {/* Image with decorative border frame */}
            <AnimatedSection className="relative group">
              <div className="absolute inset-0 border border-secondary-fixed-dim translate-x-6 translate-y-6 -z-10 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4BV8PReU-_k6j_Rz6Yq57him5jsVkdkmXGJvELqzBTzpkiR4kJ7Nb7I6E4F0gzgTvM-RS592IBeBUok6qcoAlmAortcnTnKmwXo32mdKRMQ6FerGxJizkfOK0H7CNLV2XTgN2jgBcggryadCHI7ekE6RMVXTKC3_fAINji2KaPD0l4KEH0NSmVuLzFf907fCZzMc3gcvH19wF3KO9dVvFtLm8_NW3Lz1qTyZrbpbsQAObO7YJ_hLYtmPD6x6BwzFRbJlOxx09cOw"
                alt="Signature dish at The Line — seared scallop with pea purée and edible gold leaf"
                className="w-full aspect-square object-cover shadow-2xl"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          GUEST JOURNEY — TESTIMONIALS
          ================================================================ */}
      <section className="py-32 bg-surface">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-headline-md text-headline-md mb-20 text-primary">The Guest Journey</h2>
          </AnimatedSection>
          <TestimonialSlider />
        </div>
      </section>

      {/* ================================================================
          GOLD DIVIDER
          ================================================================ */}
      <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto">
        <GoldDivider />
      </div>

      {/* ================================================================
          LOCATION SECTION
          ================================================================ */}
      <section className="py-32" id="about">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <h2 className="font-headline-md text-headline-md mb-6">In the Heart of History</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Located at the intersection of the historic old city and the vibrant contemporary
              district, Delhi Line Hotel provides a gateway to the soul of the capital.
            </p>
            <ul className="space-y-4 font-body-md text-body-md">
              <li className="flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                12 Dr. APJ Abdul Kalam Road, New Delhi, 110011
              </li>
              <li className="flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">call</span>
                +91 11 4050 6070
              </li>
              <li className="flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">mail</span>
                reservations@delhilinehotel.com
              </li>
            </ul>
          </AnimatedSection>

          {/* Map image — grayscale to color on hover */}
          <AnimatedSection className="h-[400px] bg-surface-container overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS-e0CsZKQj-8pOv7nMAurmCJkBEDHNpaBiPv22R_YfqdjdaPyIn5vRFL1RSvl7l2yBLWLnoEYttdEpXm9KOm7eCdyhZjTiZ35qbzpEaVtEmXIleB9kdSBSS2blJ77hlUb3QcwXMHv1skhMAZfN4S8qjC3FUteE6SavbjHFHVcPhDoo8cx0mzn4CKA0EDujoXjAkGF35zgw3SRzv4G854qklU5W7UFuvR7ESRuVW9MF0IS3vYVMxipB8JJuIadrkDCXwZZFrXep4U"
              alt="Map view of Delhi Line Hotel location in New Delhi"
              className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
