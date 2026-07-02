import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GoldDivider from '../components/GoldDivider';
import api from '../services/api';

import imgFineDining from '../assets/hotel_fine_dining.png';
import imgBreakfastSpread from '../assets/hotel_breakfast_spread.png';

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

const menuTabs = ['Tasting Journey', 'À La Carte', 'Sommelier Select'];

const imageMap = {
  'hotel_fine_dining.png': imgFineDining,
  'hotel_breakfast_spread.png': imgBreakfastSpread,
};
export default function DiningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tasting Journey');

  // Menu items state
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState(null);

  // Reservation form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '19:00',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch menu items on active tab change
  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      setMenuError(null);
      try {
        const response = await api.get(`/dining/menu?category=${encodeURIComponent(activeTab)}`);
        setMenuItems(response.data.menuItems);
      } catch (err) {
        console.error('Menu load error:', err);
        setMenuError('Failed to retrieve the signature menu.');
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Basic client validation
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      setSubmitError('Please fill out all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/dining/reservation', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        notes: form.notes,
      });

      setSuccess(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        guests: 2,
        date: '',
        time: '19:00',
        notes: '',
      });
    } catch (err) {
      console.error('Reservation error:', err);
      setSubmitError(err.response?.data?.error || 'Failed to request reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>The Line Restaurant — Fine Dining at Delhi Line Hotel</title>
        <meta name="description" content="Experience contemporary Indian gastronomy at The Line, the Michelin-awarded restaurant at Delhi Line Hotel, New Delhi." />
      </Helmet>

      {/* ================================================================
          HERO — full-screen with animated background
          ================================================================ */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDCCStM266WfD7_OZPVBL30HdRYfZ55H_CFd1OQ2A2QFJM1A2ozgbN5Wlr5fGssCFTtHZNIgiBiiNuyVRnWaaCnFk3p5KSxwNeCZF_eossxVN1XS8NFY2cpy7yrn6oI_CUd0vWhilK33JTA7ELzX3oSGn6QgVCT-ffrcrvENfsSyYeUkUy42JmzPh4qy0g69NpMOfzYaoetYHA-128qkYyB_wa-ZQMebUNKG-r107jfgKnsgQRuI0CupI5lu4SL8RFPJqalVl_fVY"
            alt="Intimate fine dining table with candlelight at The Line restaurant"
            className="w-full h-full object-cover animate-slow-pulse"
          />
        </div>

        <div className="relative z-20 text-center text-on-primary px-5 max-w-4xl">
          <span className="font-label-caps text-label-caps tracking-[0.4em] uppercase mb-6 block text-secondary-fixed">
            Delhi Line Hotel Presents
          </span>
          <h1 className="font-display-lg text-[40px] md:text-display-lg mb-8 text-glow uppercase tracking-tighter">
            The Line
          </h1>
          <GoldDivider className="w-48 mx-auto mb-8" />
          <p className="font-body-lg text-body-lg text-white/95 max-w-2xl mx-auto italic">
            "Gastronomy that bridges the ancient spices of Delhi with modern, world-class culinary artistry."
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-65">
          <span className="font-label-caps text-[10px] tracking-widest text-white">SCROLL</span>
          <span className="material-symbols-outlined text-white">expand_more</span>
        </div>
      </header>

      {/* ================================================================
          CHEF SECTION
          ================================================================ */}
      <section className="px-5 md:px-[80px] py-32 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <Animate className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-secondary-fixed-dim/30 pointer-events-none" />
          <div className="bg-white p-4 shadow-ambient relative z-10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5TJ7L4_UkvKtz1jj8IBOXVDNwYKKjBNbNooTea0lmLIPO1EL1i5KMxMnZjJuvZUEf042JIq_Ns2c5RSxd8a3iUOjX-vmClUqHqQq6Vphzdr1yDubv7voTDsUaN3z_yDK3ZZcf6beqzFK9zOJNb6t_wgm1wolK7UroMzHKJdwxjPgJ-k1zeW3d1LAyHGK96SercnDbyjH_chFZJSkF3OM7ngmyHVDhFFN1FaC_dAOvmySigFgFvah3q-FXN3lxAhNsWSHU7OMQceo"
              alt="Chef Vikram Seth — Executive Chef at The Line Restaurant"
              className="w-full h-[600px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-secondary px-8 py-10 text-on-secondary z-20">
            <p className="font-headline-sm text-headline-sm italic">
              "The plate is a canvas of our shared history."
            </p>
          </div>
        </Animate>

        <Animate className="space-y-8">
          <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">
            Culinary Excellence
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">
            Master of the Craft: Chef Vikram Seth
          </h2>
          <div className="w-20 h-0.5 bg-secondary" />
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            With a lineage rooted in the spice markets of Old Delhi and a journey that spanned the
            Michelin-starred kitchens of London and Paris, Chef Vikram Seth brings a unique duality
            to 'The Line'.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            His philosophy centers on "The Essential Flavor" — stripping away the unnecessary to let
            the seasonal purity of locally sourced ingredients shine through architectural plating and
            forgotten regional techniques.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <h4 className="font-label-caps text-label-caps text-primary mb-2">Philosophy</h4>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">Heritage Modernity</p>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-primary mb-2">Signature</h4>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">Saffron-Infused Heritage</p>
            </div>
          </div>
        </Animate>
      </section>

      {/* ================================================================
          SIGNATURE MENUS — TABBED
          ================================================================ */}
      <section className="bg-primary py-32 text-on-primary">
        <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto">
          <Animate className="text-center mb-16">
            <span className="font-label-caps text-label-caps text-secondary-fixed tracking-widest uppercase mb-4 block">
              The Curated Experience
            </span>
            <h2 className="font-headline-md text-headline-md mb-8">Signature Menus</h2>

            {/* Tab buttons */}
            <div className="flex justify-center gap-8 md:gap-[32px] flex-wrap">
              {menuTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-label-caps text-label-caps pb-2 border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? 'border-secondary-fixed text-secondary-fixed'
                      : 'border-transparent text-on-primary/60 hover:text-on-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Animate>

          {/* Tab content with Framer Motion fade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {loadingMenu ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-secondary-fixed border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-label-caps text-on-primary/70 tracking-widest text-[11px]">Revealing tasting journey...</p>
                </div>
              ) : menuError ? (
                <div className="col-span-3 text-center py-20">
                  <p className="font-body-md text-red-300">{menuError}</p>
                </div>
              ) : (
                menuItems.map((item) => {
                  const resolvedImage = imageMap[item.image] || item.image;
                  const formattedPrice = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(item.price);

                  return (
                    <div key={item._id} className="group cursor-pointer">
                      <div className="overflow-hidden mb-6 aspect-[3/4]">
                        <img
                          src={resolvedImage}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline-sm text-headline-sm">{item.name}</h3>
                        <span className="font-label-caps text-label-caps text-secondary-fixed whitespace-nowrap ml-4">
                          {formattedPrice}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-primary/70 italic">{item.description}</p>
                    </div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ================================================================
          RESERVE A TABLE FORM
          ================================================================ */}
      <section className="py-32 px-5 relative overflow-hidden bg-surface-container-low">
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto bg-white p-8 md:p-20 shadow-ambient relative z-10 flex flex-col md:flex-row gap-12">
          {/* Left — contact info */}
          <div className="md:w-1/2">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-4 block">
              Reservations
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Secure Your Evening</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              We recommend booking at least 48 hours in advance for weekend seating. Private dining
              suites are available for parties up to 12.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">call</span>
                <span className="font-label-caps text-label-caps">+91 11 4050 9000</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">mail</span>
                <span className="font-label-caps text-label-caps text-secondary">
                  theline@delhilinehotel.com
                </span>
              </div>
            </div>
          </div>

          {/* Right — reservation form */}
          <div className="md:w-1/2 space-y-6">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-sm">
                {submitError}
              </div>
            )}
            <div className="space-y-2">
              <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Guests *
                </label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleInputChange}
                  className="w-full"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="8">8 Guests</option>
                  <option value="12">12 Guests</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider block">
                  Special Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  placeholder="Window seat, anniversary, etc."
                  className="w-full"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-all mt-4 rounded disabled:opacity-50"
            >
              {submitting ? 'Requesting...' : 'Confirm Availability'}
            </button>
          </div>
        </form>

        {/* Decorative bg text */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 font-bold text-surface-container-highest opacity-5 pointer-events-none select-none -mr-40"
          style={{ fontSize: '20rem', fontFamily: '"Playfair Display", serif' }}
        >
          LINE
        </div>
      </section>

      {/* Confirmation Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccess(false)}
          >
            <motion.div
              className="bg-white max-w-md w-full p-8 text-center shadow-2xl border border-secondary/20 rounded relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-outlined text-secondary text-5xl mb-4">check_circle</span>
              <h3 className="font-display-lg text-headline-sm text-primary mb-4">Reservation Requested</h3>
              <p className="font-body-md text-on-surface-variant mb-6">
                Your reservation at The Line has been received. A host will review and contact you shortly to confirm table availability.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded hover:bg-secondary transition-all w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
