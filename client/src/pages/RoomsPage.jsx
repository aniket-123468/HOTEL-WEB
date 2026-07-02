import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GoldDivider from '../components/GoldDivider';
import Button from '../components/Button';
import api from '../services/api';
import useBookingStore from '../store/bookingStore';

import imgHeritageCorridor from '../assets/hotel_heritage_corridor.png';
import imgGrandLobby from '../assets/hotel_grand_lobby.png';
import imgImperialSuite from '../assets/hotel_imperial_suite.png';
import imgSpaSanctuary from '../assets/hotel_spa_sanctuary.png';
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

const imageMap = {
  'hotel_heritage_corridor.png': imgHeritageCorridor,
  'hotel_grand_lobby.png': imgGrandLobby,
  'hotel_imperial_suite.png': imgImperialSuite,
};

export default function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load rooms:', err);
        setError('Unable to load our accommodations at this moment.');
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBook = (room) => {
    const { setSelectedRoom, setStep } = useBookingStore.getState();
    setSelectedRoom(room);
    setStep(1); // Start booking at Step 1: Select Dates with room preselected
    navigate('/book');
  };

  return (
    <>
      <Helmet>
        <title>Rooms & Suites — Delhi Line Hotel</title>
        <meta name="description" content="Discover the curated collection of Classic Heritage rooms, Executive Studios, and the Royal Line Suite at Delhi Line Hotel, New Delhi." />
      </Helmet>

      {/* ================================================================
          HERO — 60vh
          ================================================================ */}
      <header className="relative h-[60vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8NONZCWdsyBYehVqoVUei5X24txmbghszfY-QVouYCzpBMCnU_041atRiILWNmIuYz852F6vfO4pZ1ceWEWuYGaugTmihjncRN5Fgy0nD-Mr9ZIpRCnkygUOrKDOAY4CS_lJkhCYBCR63nZZ_hl3U-TYwx3tnCv7lQNKveVI7m3kS2y7gKhjg2hRRB81KwEMh10wqjFXtgIddNxD2ULPUm2EiYQRs2pBwJ_J6ikSsSDGexM2seCq9j3_1PHsJBZGDSmukexffvp8"
            alt="Luxury hotel lobby in New Delhi — warm golden light through arched windows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/20" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(251,249,248,0) 0%, rgba(251,249,248,1) 100%)',
            }}
          />
        </div>
        <div className="relative z-10 px-5 md:px-[80px] max-w-[1280px] mx-auto w-full">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="font-label-caps text-label-caps text-secondary tracking-[0.2em] mb-4 block">
              THE RESIDENCES
            </span>
            <h1 className="font-display-lg text-[40px] md:text-display-lg text-primary mb-6">
              Delhi Line Accommodations
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              A refined sanctuary where the echoes of Lutyens' Delhi meet the sophisticated needs
              of the modern traveler. Discover our curated collection of rooms and suites.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ================================================================
          ROOM LISTINGS
          ================================================================ */}
      <section className="py-24 px-5 md:px-[80px] max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-label-caps text-on-surface-variant tracking-widest text-[11px]">Gathering Residences...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-body-lg text-red-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-on-primary font-label-caps px-8 py-3 rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            rooms.map((room, i) => {
              const imageRight = i % 2 !== 0;
              const isRoyal = room.tier === 'Royal Suite';
              const tagBg = isRoyal ? 'bg-secondary text-on-secondary' : 'bg-surface/90 text-on-surface';
              const chips = [room.size, `${room.maxGuests} Guests`, ...room.amenities.slice(0, 1)];
              const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(room.pricePerNight);
              const resolvedImage = imageMap[room.images[0]] || room.images[0];
              const ctaText = isRoyal ? 'EXPLORE THE SUITE' : 'EXPLORE DETAILS';

              return (
                <article
                  key={room._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group"
                >
                  {/* Image — alternates left/right */}
                  <Animate
                    className={`md:col-span-7 overflow-hidden rounded-sm hover-zoom relative ${
                      imageRight ? 'order-1 md:order-2' : 'order-1'
                    }`}
                  >
                    <img
                      src={resolvedImage}
                      alt={room.name}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                    <div className={`absolute top-6 ${imageRight ? 'right-6' : 'left-6'}`}>
                      <span className={`${tagBg} backdrop-blur-md px-4 py-2 font-label-caps text-[10px] tracking-widest border border-outline-variant`}>
                        {room.wing}
                      </span>
                    </div>
                  </Animate>

                  {/* Text */}
                  <Animate
                    className={`md:col-span-5 flex flex-col gap-6 ${
                      imageRight
                        ? 'order-2 md:order-1 items-end text-right pr-0 md:pr-12'
                        : 'items-start pl-0 md:pl-12'
                    }`}
                  >
                    <h2 className="font-headline-md text-headline-md text-primary">{room.name}</h2>
                    <GoldDivider className="max-w-[200px]" />
                    <p className="font-body-md text-body-md text-on-surface-variant">{room.description}</p>

                    {/* Chips */}
                    <div className={`flex flex-wrap gap-3 ${imageRight ? 'justify-end' : ''}`}>
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className={`px-3 py-1 rounded-full text-[11px] font-label-caps uppercase tracking-tighter border ${
                            isRoyal
                              ? 'border-secondary text-secondary'
                              : 'border-outline-variant text-on-surface-variant'
                          }`}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">
                        STARTING FROM
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary">
                        {formattedPrice}{' '}
                        <span className="text-sm font-body-md text-on-surface-variant">/ Night</span>
                      </span>
                    </div>

                    {/* CTA */}
                    {isRoyal ? (
                      <button
                        onClick={() => handleBook(room)}
                        className="mt-4 bg-primary text-on-primary px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-all rounded"
                      >
                        {ctaText}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBook(room)}
                        className="mt-4 flex items-center gap-2 font-label-caps text-label-caps text-primary group-hover:text-secondary transition-colors"
                      >
                        {ctaText}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </Animate>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ================================================================
          AMENITY BENTO GRID — "Beyond the Sleep"
          ================================================================ */}
      <section className="bg-surface-container-low py-24">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto">
          <Animate className="text-center mb-16">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-2 block">
              CRAFTED EXPERIENCES
            </span>
            <h3 className="font-display-lg text-[40px] md:text-display-lg-mobile text-primary" style={{ fontFamily: '"Playfair Display", serif' }}>
              Beyond the Sleep
            </h3>
          </Animate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento 1 — Wellness Spa */}
            <Animate className="md:col-span-2 bg-surface-container-lowest p-8 shadow-ambient border border-secondary/10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <h4 className="font-headline-sm text-headline-sm mb-4">Delhi Line Wellness Spa</h4>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Rejuvenate your senses with Ayurvedic treatments and modern hydrotherapy in our
                  tranquil subterranean sanctuary.
                </p>
                <a href="#" className="font-label-caps text-label-caps text-secondary border-b border-secondary pb-1">
                  VIEW SPA MENU
                </a>
              </div>
              <div className="w-full md:w-1/2 aspect-square overflow-hidden rounded-sm">
                <img
                  src={imgSpaSanctuary}
                  alt="Luxury wellness spa with stone pool and Ayurvedic elements"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Animate>

            {/* Bento 2 — Digital Concierge */}
            <Animate className="bg-secondary text-on-secondary p-8 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl mb-6 block">concierge</span>
                <h4 className="font-headline-sm text-headline-sm mb-4">24/7 Digital Concierge</h4>
                <p className="font-body-md opacity-80">
                  Access room service, housekeeping, and city tours with a single touch from your
                  in-room tablet.
                </p>
              </div>
              <div className="pt-8 border-t border-on-secondary/20 mt-8">
                <p className="font-label-caps text-[10px] tracking-widest opacity-60">
                  IMMEDIATE ASSISTANCE
                </p>
              </div>
            </Animate>

            {/* Bento 3 — In-Room Dining */}
            <Animate className="bg-surface-container-highest p-8 shadow-ambient flex flex-col justify-center text-center">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4 block">restaurant</span>
              <h4 className="font-headline-sm text-headline-sm mb-2">In-Room Dining</h4>
              <p className="font-body-md text-on-surface-variant">
                A curated menu of local Delhi street-inspired fine dining delivered to your door.
              </p>
            </Animate>

            {/* Bento 4 — City Walks */}
            <Animate className="md:col-span-2 bg-surface p-8 border border-secondary/10 flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="w-full md:w-1/2">
                <h4 className="font-headline-sm text-headline-sm mb-4">Curated City Walks</h4>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Expert-led architectural tours through Old Delhi and Lutyens' boulevards,
                  exclusively for hotel residents.
                </p>
                <a href="#" className="font-label-caps text-label-caps text-secondary border-b border-secondary pb-1">
                  BOOK A TOUR
                </a>
              </div>
              <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-sm">
                <img
                  src={imgCourtyardGarden}
                  alt="Expert guide showing intricate details of a Mughal-era courtyard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Animate>
          </div>
        </div>
      </section>
    </>
  );
}
