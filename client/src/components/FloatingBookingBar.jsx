import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useBookingStore from '../store/bookingStore';

/**
 * FloatingBookingBar — fixed pill at bottom of viewport (desktop only).
 * From homepage/rooms/gallery reference HTML: rounded-full, gold-tinted shadow,
 * bg-surface-container-highest, border border-secondary/30.
 */
export default function FloatingBookingBar() {
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } =
    useBookingStore();

  const [localCheckIn, setLocalCheckIn] = useState(checkIn || '');
  const [localCheckOut, setLocalCheckOut] = useState(checkOut || '');
  const [localGuests, setLocalGuests] = useState(guests || 2);

  const handleCheck = () => {
    setCheckIn(localCheckIn);
    setCheckOut(localCheckOut);
    setGuests(localGuests);
    navigate('/book');
  };

  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
      className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        rounded-full px-6 py-3 bg-surface-container-highest
        border border-secondary/30
        shadow-[0_8px_30px_rgb(197,160,89,0.12)]
        items-center gap-6 whitespace-nowrap
        hover:shadow-[0_12px_40px_rgb(197,160,89,0.18)]
        transition-shadow duration-300"
    >
      {/* Check-in */}
      <div className="flex items-center gap-2 px-4 border-r border-outline-variant cursor-pointer group">
        <span className="material-symbols-outlined text-secondary text-xl">calendar_today</span>
        <div className="flex flex-col">
          <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">CHECK-IN</span>
          {localCheckIn ? (
            <span className="font-bold text-primary text-xs">{formatDate(localCheckIn)}</span>
          ) : (
            <input
              type="date"
              value={localCheckIn}
              onChange={(e) => setLocalCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="border-0 p-0 text-xs font-bold text-primary bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-2 px-4 border-r border-outline-variant cursor-pointer group">
        <span className="material-symbols-outlined text-secondary text-xl">calendar_month</span>
        <div className="flex flex-col">
          <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">CHECK-OUT</span>
          {localCheckOut ? (
            <span className="font-bold text-primary text-xs">{formatDate(localCheckOut)}</span>
          ) : (
            <input
              type="date"
              value={localCheckOut}
              onChange={(e) => setLocalCheckOut(e.target.value)}
              min={localCheckIn || new Date().toISOString().split('T')[0]}
              className="border-0 p-0 text-xs font-bold text-primary bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 px-4 cursor-pointer">
        <span className="material-symbols-outlined text-secondary text-xl">group</span>
        <div className="flex flex-col">
          <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">GUESTS</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocalGuests(Math.max(1, localGuests - 1))}
              className="text-secondary hover:opacity-70 transition-opacity leading-none"
              aria-label="Decrease guests"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="font-bold text-primary text-xs w-4 text-center">{localGuests}</span>
            <button
              onClick={() => setLocalGuests(Math.min(10, localGuests + 1))}
              className="text-secondary hover:opacity-70 transition-opacity leading-none"
              aria-label="Increase guests"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheck}
        className="bg-primary text-on-primary rounded-full px-7 py-2.5
          font-label-caps text-label-caps uppercase tracking-widest
          hover:opacity-80 transition-opacity flex items-center gap-2"
      >
        Check Availability
      </button>
    </motion.div>
  );
}
