import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote:
      '"An exceptional oasis in the heart of the city. The attention to detail in the design and the silent, intuitive service makes Delhi Line a true heritage modern masterpiece."',
    author: 'ELIZABETH VANCE',
    location: 'LONDON',
  },
  {
    id: 2,
    quote:
      '"The Line restaurant alone is worth the journey. Chef Vikram\'s tasting menu is a profound meditation on Indian flavors — the most memorable meal I\'ve had in years."',
    author: 'JEAN-PIERRE MOREAU',
    location: 'PARIS',
  },
  {
    id: 3,
    quote:
      '"From the butler service to the bespoke pillow menu, every moment felt curated just for us. Delhi Line has redefined what luxury hospitality means to me."',
    author: 'PRIYA MEHROTRA',
    location: 'MUMBAI',
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
      transition: { duration: 0.4, ease: 'easeIn' },
    }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden min-h-[280px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={t.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center px-4 w-full"
          >
            {/* Quote icon */}
            <span
              className="material-symbols-outlined text-secondary mb-8"
              style={{ fontSize: '3rem', fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>

            <blockquote className="font-display-lg text-headline-sm md:text-headline-md text-on-surface italic mb-10 leading-snug text-center">
              {t.quote}
            </blockquote>

            <div className="w-16 h-px bg-secondary mb-4" />

            <cite className="font-label-caps text-label-caps not-italic text-on-surface-variant">
              {t.author} — {t.location}
            </cite>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-4 mt-12" role="tablist" aria-label="Testimonials">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Testimonial ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-secondary scale-125' : 'bg-secondary/20 hover:bg-secondary/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
