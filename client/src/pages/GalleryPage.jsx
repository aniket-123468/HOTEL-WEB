import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GoldDivider from '../components/GoldDivider';

import imgGrandLobby from '../assets/hotel_grand_lobby.png';
import imgImperialSuite from '../assets/hotel_imperial_suite.png';
import imgFineDining from '../assets/hotel_fine_dining.png';
import imgRooftopPool from '../assets/hotel_rooftop_pool.png';
import imgSpaSanctuary from '../assets/hotel_spa_sanctuary.png';
import imgHeritageCorridor from '../assets/hotel_heritage_corridor.png';
import imgBreakfastSpread from '../assets/hotel_breakfast_spread.png';
import imgCourtyardGarden from '../assets/hotel_courtyard_garden.png';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
function Animate({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

const categories = ['All', 'Architecture', 'Interiors', 'Culinary Art', 'Moments'];

const galleryImages = [
  {
    id: 1,
    category: 'Architecture',
    title: 'The Grand Lobby',
    src: imgGrandLobby,
    alt: 'Luxury hotel grand lobby with crystal chandeliers and Mughal arches',
  },
  {
    id: 2,
    category: 'Architecture',
    title: 'The Heritage Corridor',
    src: imgHeritageCorridor,
    alt: 'Grand arched corridor with brass lanterns and sandstone floors',
  },
  {
    id: 3,
    category: 'Interiors',
    title: 'The Imperial Suite',
    src: imgImperialSuite,
    alt: 'Imperial suite bedroom with charcoal silk drapes and Delhi skyline views',
  },
  {
    id: 4,
    category: 'Moments',
    title: 'The Courtyard at Twilight',
    src: imgCourtyardGarden,
    alt: 'Mughal-style courtyard garden with reflecting pool at twilight',
  },
  {
    id: 5,
    category: 'Culinary Art',
    title: 'The Line Restaurant',
    src: imgFineDining,
    alt: 'Heritage fine dining restaurant with arched jali screens and candlelit tables',
  },
  {
    id: 6,
    category: 'Culinary Art',
    title: 'Morning Indulgence',
    src: imgBreakfastSpread,
    alt: 'Luxury breakfast spread with gold-rim crockery and fresh pastries',
  },
  {
    id: 7,
    category: 'Moments',
    title: 'Rooftop Serenity',
    src: imgRooftopPool,
    alt: 'Rooftop infinity pool overlooking New Delhi skyline at golden hour',
  },
  {
    id: 8,
    category: 'Interiors',
    title: 'The Spa Sanctuary',
    src: imgSpaSanctuary,
    alt: 'Luxury spa treatment room with lotus murals and koi garden views',
  },
];

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    activeFilter === 'All'
      ? galleryImages
      : galleryImages.filter(
          (img) => img.category.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <>
      <Helmet>
        <title>Heritage Gallery — Delhi Line Hotel</title>
        <meta name="description" content="A visual journey through the architecture, interiors, culinary art, and memorable moments of Delhi Line Hotel." />
      </Helmet>

      {/* ================================================================
          HERO — 90vh
          ================================================================ */}
      <header className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 hero-mask">
          <img
            src={imgGrandLobby}
            alt="Delhi Line Hotel facade at dusk — Mughal-inspired arches, champagne gold illumination"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          className="relative z-10 text-center px-5 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <h1 className="font-display-lg text-[40px] md:text-display-lg text-on-primary mb-6 drop-shadow-lg">
            The Heritage Gallery
          </h1>
          <GoldDivider className="w-48 mx-auto mb-8" />
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto italic">
            A visual journey through time, tradition, and the pinnacle of modern Indian hospitality.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60">
          <span className="font-label-caps text-[10px] tracking-widest text-white">SCROLL</span>
          <span className="material-symbols-outlined text-white">expand_more</span>
        </div>
      </header>

      {/* ================================================================
          STICKY FILTER BAR
          ================================================================ */}
      <section className="sticky top-20 z-40 bg-surface py-6 border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-5 md:px-[80px] flex flex-wrap justify-center gap-8 md:gap-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`group relative py-2 font-label-caps text-label-caps transition-colors duration-300 ${
                activeFilter === cat
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {cat.toUpperCase()}
              <span
                className={`absolute bottom-0 left-0 h-px bg-secondary transition-all duration-300 ${
                  activeFilter === cat ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* ================================================================
          MASONRY GALLERY
          ================================================================ */}
      <main className="max-w-[1280px] mx-auto px-5 md:px-[80px] py-24">
        <AnimatePresence>
          <motion.div
            className="columns-1 md:columns-2 lg:columns-3 gap-8"
            layout
          >
            {filtered.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="masonry-item zoom-effect relative group cursor-pointer overflow-hidden bg-white shadow-ambient"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-on-primary">
                  <span className="font-label-caps text-[10px] mb-2 tracking-widest opacity-80 uppercase">
                    {img.category}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ================================================================
          LIGHTBOX
          ================================================================ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-5xl max-h-[90vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-widest mb-1">
                    {lightbox.category.toUpperCase()}
                  </p>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary">{lightbox.title}</h3>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="text-surface-variant hover:text-on-primary transition-colors"
                  aria-label="Close lightbox"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          EXPERIENCE CTA
          ================================================================ */}
      <section className="w-full bg-surface-container-high py-32 px-5 md:px-[80px] overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <Animate className="max-w-xl">
            <h2 className="font-display-lg text-headline-md md:text-[48px] mb-8" style={{ fontFamily: '"Playfair Display", serif', lineHeight: '1.2' }}>
              Experience the Heritage
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Step into a world where every corner tells a story of elegance and every moment is
              curated for the extraordinary. Your journey through Delhi's finest begins here.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate('/book')}
                className="bg-primary text-on-primary font-label-caps text-label-caps px-12 py-5 hover:opacity-90 transition-all tracking-widest rounded"
              >
                BOOK YOUR STAY
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="border border-secondary text-secondary font-label-caps text-label-caps px-12 py-5 hover:bg-secondary/10 transition-all tracking-widest rounded"
              >
                VIEW SUITES
              </button>
            </div>
          </Animate>

          <Animate className="w-full md:w-1/2 aspect-video bg-white shadow-2xl relative overflow-hidden group">
            <img
              src={imgHeritageCorridor}
              alt="Delhi Line Hotel main entrance at night — concierges in traditional attire"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Animate>
        </div>
      </section>
    </>
  );
}
