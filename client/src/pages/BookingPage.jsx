import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GoldDivider from '../components/GoldDivider';
import useBookingStore from '../store/bookingStore';
import api from '../services/api';

import imgHeritageCorridor from '../assets/hotel_heritage_corridor.png';
import imgGrandLobby from '../assets/hotel_grand_lobby.png';
import imgImperialSuite from '../assets/hotel_imperial_suite.png';

const imageMap = {
  'hotel_heritage_corridor.png': imgHeritageCorridor,
  'hotel_grand_lobby.png': imgGrandLobby,
  'hotel_imperial_suite.png': imgImperialSuite,
};

const arrivalOptions = [
  'Early Morning (6 AM - 10 AM)',
  'Midday (10 AM - 3 PM)',
  'Evening (3 PM - 9 PM)',
  'Late Night (9 PM - 2 AM)',
];

const TAX_RATE = 0.18;

export default function BookingPage() {
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, selectedRoom: preselectedRoom, setCheckIn, setCheckOut, setGuests } = useBookingStore();

  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(preselectedRoom || null);
  const [localGuests, setLocalGuests] = useState(guests || 2);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null); // to hold booking before payment
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null); // success modal data

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    arrival: arrivalOptions[1],
    dietary: false,
    airport: false,
    quiet: true,
    notes: '',
  });

  // If a room was preselected from RoomsPage, go straight to step 2 or 3
  useEffect(() => {
    if (preselectedRoom) {
      setSelectedRoom(preselectedRoom);
      setStep(2);
    }
  }, []);

  // Calculate derived values
  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();
  const subtotal = selectedRoom && nights > 0 ? selectedRoom.pricePerNight * nights : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const goToStep = (s) => {
    if (s <= step || (s === 2 && step >= 1) || (s === 3 && selectedRoom)) {
      setStep(s);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch rooms when moving to step 2
  const proceedToRooms = async () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (rooms.length > 0) return; // already fetched
    setLoadingRooms(true);
    setRoomsError(null);
    try {
      const res = await api.get('/rooms');
      setRooms(res.data.rooms);
    } catch (err) {
      setRoomsError('Unable to load rooms. Please try again.');
    } finally {
      setLoadingRooms(false);
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.post('/bookings', {
        roomId: selectedRoom._id,
        checkIn,
        checkOut,
        guests: localGuests,
        guestInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        arrivalTime: form.arrival,
        notes: form.notes,
        preferences: {
          dietary: form.dietary,
          airportTransfer: form.airport,
          quietRoom: form.quiet,
        },
      });

      setPendingBooking(res.data.booking);
      
      // Initialize mock payment order
      await api.post('/payments/create-order', {
        amount: res.data.booking.totalAmount * 100, // paise
        receipt: res.data.booking._id,
      });

      setShowPaymentModal(true);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMockPayment = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/payments/verify', {
        razorpay_order_id: 'mock_order_123',
        razorpay_payment_id: 'mock_payment_456',
        razorpay_signature: 'mock_sig_789',
        bookingId: pendingBooking._id,
      });

      setShowPaymentModal(false);
      setConfirmedBooking(res.data.booking);
    } catch (err) {
      setSubmitError('Payment verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <Helmet>
        <title>Book Your Stay — Delhi Line Hotel</title>
        <meta name="description" content="Reserve your luxury suite at Delhi Line Hotel, New Delhi. Select dates, choose your residence, and complete your booking in minutes." />
      </Helmet>

      {/* ================================================================
          BOOKING STEPPER
          ================================================================ */}
      <div className="flex justify-center mb-16 gap-6 md:gap-16 px-5 pt-12 flex-wrap">
        {[
          { num: '01', label: 'Select Dates' },
          { num: '02', label: 'Select Room' },
          { num: '03', label: 'Guest Details' },
        ].map(({ num, label }, i) => {
          const s = i + 1;
          const isActive = s === step;
          const isDone = s < step;
          return (
            <button
              key={s}
              onClick={() => goToStep(s)}
              className={`flex items-center gap-3 pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-secondary text-secondary'
                  : isDone
                  ? 'border-secondary/40 text-secondary/60'
                  : 'border-transparent text-on-surface-variant opacity-40'
              }`}
            >
              <span className="font-label-caps text-label-caps">{num}</span>
              <span className="font-headline-sm text-[16px] uppercase tracking-widest">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-5 md:px-[80px] max-w-[1280px] mx-auto pb-32">
        {/* ============================================================
            MAIN CONTENT AREA
            ============================================================ */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* ---- STEP 1: SELECT DATES ---- */}
            {step === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="font-display-lg text-headline-md" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Your Journey in Delhi
                  </h2>
                  <GoldDivider className="w-24" />
                  <p className="font-body-lg text-on-surface-variant max-w-xl">
                    Begin by selecting your preferred window of residence. Our availability is curated
                    to ensure exclusivity and personalized attention.
                  </p>
                </div>

                <div className="bg-white p-8 shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-secondary/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Date inputs */}
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block">
                          Check-In Date
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full text-lg font-semibold text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block">
                          Check-Out Date
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full text-lg font-semibold text-primary"
                        />
                      </div>
                    </div>

                    {/* Guests + proceed */}
                    <div className="flex flex-col justify-center gap-8 border-l border-secondary/10 pl-8 md:pl-12">
                      <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block">
                          Guests
                        </label>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => setLocalGuests(Math.max(1, localGuests - 1))}
                            className="text-secondary hover:opacity-70 transition-opacity"
                          >
                            <span className="material-symbols-outlined">remove_circle_outline</span>
                          </button>
                          <span className="font-headline-sm text-2xl w-8 text-center">{localGuests}</span>
                          <button
                            onClick={() => setLocalGuests(Math.min(6, localGuests + 1))}
                            className="text-secondary hover:opacity-70 transition-opacity"
                          >
                            <span className="material-symbols-outlined">add_circle_outline</span>
                          </button>
                        </div>
                      </div>

                      {checkIn && checkOut && (
                        <div className="space-y-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block">
                            Stay Period
                          </label>
                          <p className="font-headline-sm text-[18px]">{checkIn} — {checkOut}</p>
                          <p className="font-body-md text-on-surface-variant italic">
                            {nights} Night{nights !== 1 ? 's' : ''} · Heritage Splendor Awaits
                          </p>
                        </div>
                      )}

                      <button
                        disabled={!checkIn || !checkOut}
                        onClick={() => { setGuests(localGuests); proceedToRooms(); }}
                        className="bg-primary text-on-primary py-4 px-8 font-label-caps text-label-caps tracking-[0.2em] hover:bg-secondary transition-all rounded disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        PROCEED TO ROOMS
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ---- STEP 2: SELECT ROOM ---- */}
            {step === 2 && (
              <motion.section
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="font-display-lg text-headline-md" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Curated Residences
                  </h2>
                  <GoldDivider className="w-24" />
                  <p className="font-body-lg text-on-surface-variant max-w-xl">
                    Choose from our collection of rooms and suites, each designed as a sanctuary of calm
                    amidst the vibrant energy of the capital.
                  </p>
                </div>

                {loadingRooms ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                    <p className="font-label-caps text-on-surface-variant tracking-widest text-[11px]">Loading Residences...</p>
                  </div>
                ) : roomsError ? (
                  <div className="text-center py-20">
                    <p className="font-body-md text-red-500 mb-4">{roomsError}</p>
                    <button onClick={proceedToRooms} className="bg-primary text-on-primary px-8 py-3 font-label-caps rounded">
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {rooms.map((room) => {
                      const formattedPrice = formatINR(room.pricePerNight);
                      const resolvedImage = imageMap[room.images[0]] || room.images[0];
                      return (
                        <motion.div
                          key={room._id}
                          className="group bg-white flex flex-col md:flex-row shadow-ambient hover:shadow-ambient-lg transition-all duration-500 overflow-hidden"
                          whileHover={{ y: -2 }}
                        >
                          <div className="md:w-2/5 overflow-hidden">
                            <img
                              src={resolvedImage}
                              alt={room.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                          <div className="md:w-3/5 p-8 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest block mb-1">{room.wing}</span>
                                  <h3 className="font-headline-sm text-headline-sm">{room.name}</h3>
                                </div>
                                <div className="font-label-caps text-label-caps text-secondary whitespace-nowrap ml-4 text-right">
                                  FROM {formattedPrice}<br/>
                                  <span className="text-xs font-body-md text-on-surface-variant">/ Night</span>
                                </div>
                              </div>
                              <div className="flex gap-3 flex-wrap mb-6">
                                {[room.size, `${room.maxGuests} Guests`, ...room.amenities.slice(0, 2)].map((c) => (
                                  <span key={c} className="px-3 py-1 bg-surface-container-low border border-outline-variant text-[10px] font-label-caps uppercase">
                                    {c}
                                  </span>
                                ))}
                              </div>
                              <p className="font-body-md text-on-surface-variant line-clamp-2">{room.description}</p>
                            </div>
                            <div className="mt-8 flex justify-end">
                              <button
                                onClick={() => selectRoom(room)}
                                className="border border-primary px-8 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all rounded"
                              >
                                SELECT RESIDENCE
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            )}

            {/* ---- STEP 3: GUEST DETAILS ---- */}
            {step === 3 && (
              <motion.section
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="font-display-lg text-headline-md" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Personalized Guest Care
                  </h2>
                  <GoldDivider className="w-24" />
                  <p className="font-body-lg text-on-surface-variant max-w-xl">
                    To provide our hallmark personalized service, please share your contact information
                    and any specific preferences for your arrival.
                  </p>
                </div>

                <form
                  className="bg-white p-8 md:p-12 shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-secondary/10 space-y-12"
                  onSubmit={handleSubmit}
                >
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Julian Alexander' },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'e.g. julian@legacy.com' },
                      { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 000 000 0000' },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key} className="relative group">
                        <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block mb-4">
                          {label}
                        </label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full"
                          required
                        />
                      </div>
                    ))}

                    <div className="relative group">
                      <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block mb-4">
                        Expected Arrival
                      </label>
                      <select
                        value={form.arrival}
                        onChange={(e) => setForm({ ...form, arrival: e.target.value })}
                        className="w-full appearance-none"
                      >
                        {arrivalOptions.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-6">
                    <h4 className="font-headline-sm text-[16px] uppercase tracking-widest text-secondary">
                      Preferences &amp; Requests
                    </h4>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { key: 'dietary', label: 'Dietary Requirements' },
                        { key: 'airport', label: 'Airport Transfer' },
                        { key: 'quiet', label: 'Quiet Room' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                            className="rounded-none border-secondary text-secondary focus:ring-secondary"
                          />
                          <span className="font-body-md text-on-surface-variant">{label}</span>
                        </label>
                      ))}
                    </div>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any additional notes for our concierge..."
                      className="w-full bg-transparent border border-slate-300 p-4 h-32 focus:border-secondary focus:ring-0 font-body-md rounded"
                    />
                  </div>

                  {/* Security notice */}
                  <div className="flex items-center gap-4 bg-surface-container-low p-6">
                    <span className="material-symbols-outlined text-secondary">verified_user</span>
                    <p className="font-body-md text-[14px]">
                      Your data is protected by AES-256 encryption. We never share your personal
                      information with third parties.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-on-primary py-5 font-label-caps text-label-caps tracking-[0.2em] hover:bg-secondary transition-all rounded disabled:opacity-50"
                  >
                    {submitting ? 'PROCESSING...' : 'COMPLETE RESERVATION'}
                  </button>
                </form>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================
            STICKY RESERVATION SUMMARY SIDEBAR
            ============================================================ */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white p-8 shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-secondary/10">
              <h3 className="font-headline-sm text-[18px] mb-6 uppercase tracking-widest border-b border-secondary/10 pb-4">
                Reservation Summary
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Dates</span>
                    <p className="font-body-md font-semibold">{checkIn || '—'} — {checkOut || '—'}</p>
                    {nights > 0 && (
                      <p className="font-body-md text-on-surface-variant text-xs">{nights} Night{nights !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Guests</span>
                    <p className="font-body-md font-semibold">{localGuests} Adult{localGuests !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Residence</span>
                  <p className="font-body-md font-semibold">{selectedRoom?.name || 'Not Selected'}</p>
                  {selectedRoom && (
                    <p className="font-body-md text-on-surface-variant text-xs">{selectedRoom.wing}</p>
                  )}
                </div>

                <GoldDivider />

                {subtotal > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between font-body-md text-on-surface-variant">
                      <span>{nights} Night{nights !== 1 ? 's' : ''} × {formatINR(selectedRoom.pricePerNight)}</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-body-md text-on-surface-variant">
                      <span>Service &amp; Tax (18%)</span>
                      <span>{formatINR(tax)}</span>
                    </div>
                    <div className="flex justify-between font-headline-md text-[20px] text-secondary mt-4">
                      <span>Grand Total</span>
                      <span>{formatINR(total)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="font-body-md text-on-surface-variant text-sm italic">
                    Select dates and a room to see pricing.
                  </p>
                )}
              </div>
            </div>

            {/* Delhi Line Advantage card */}
            <div className="bg-primary p-8 text-on-primary">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-secondary-fixed">workspace_premium</span>
                <span className="font-label-caps text-label-caps tracking-widest">DELHI LINE ADVANTAGE</span>
              </div>
              <p className="text-[13px] font-body-md opacity-80 leading-relaxed">
                Booking directly through our portal entitles you to complimentary breakfast,
                early check-in, and priority room upgrades upon availability.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ================================================================
          MOCK RAZORPAY PAYMENT MODAL
          ================================================================ */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-8 rounded shadow-2xl relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-lg font-semibold">Razorpay Checkout (Mock)</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="font-body-md text-on-surface-variant mb-6 text-sm">
                This is a simulated payment gateway. In a real environment, the Razorpay modal would open here to collect payment details for <strong>{formatINR(pendingBooking?.totalAmount)}</strong>.
              </p>
              
              <button
                onClick={handleMockPayment}
                disabled={submitting}
                className="w-full bg-[#3395FF] hover:bg-[#2073D4] text-white py-3 rounded font-semibold transition-colors flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span>Pay {formatINR(pendingBooking?.totalAmount)}</span>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          BOOKING CONFIRMATION MODAL
          ================================================================ */}
      <AnimatePresence>
        {confirmedBooking && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-lg w-full p-10 text-center shadow-2xl border border-secondary/20 rounded relative overflow-hidden"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-secondary/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-secondary/30" />

              <span className="material-symbols-outlined text-secondary text-6xl mb-4 block">check_circle</span>
              <span className="font-label-caps text-[10px] text-secondary tracking-widest uppercase block mb-2">
                Booking Confirmed
              </span>
              <h3 className="font-display-lg text-headline-md text-primary mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                Welcome to Delhi Line Hotel
              </h3>
              <GoldDivider className="w-32 mx-auto mb-6" />

              <div className="bg-surface-container-low p-6 mb-6 text-left space-y-3 rounded">
                <div className="flex justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Booking ID</span>
                  <span className="font-body-md font-semibold text-primary text-sm">{confirmedBooking._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Room</span>
                  <span className="font-body-md font-semibold text-sm">{confirmedBooking.room?.name || 'Luxury Residence'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Check-In</span>
                  <span className="font-body-md text-sm">{new Date(confirmedBooking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Check-Out</span>
                  <span className="font-body-md text-sm">{new Date(confirmedBooking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between border-t border-secondary/10 pt-3 mt-3">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Grand Total</span>
                  <span className="font-headline-sm text-secondary text-base">{formatINR(confirmedBooking.totalAmount)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Payment</span>
                  <span className="font-body-md text-sm text-green-700 font-semibold uppercase tracking-wider text-[11px] bg-green-100 px-2 py-0.5 rounded-sm">Paid</span>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-sm mb-8">
                A confirmation has been logged. Our team will reach out to{' '}
                <strong>{confirmedBooking.guestInfo?.email || 'your email'}</strong> within 24 hours.
              </p>

              <button
                onClick={() => { setConfirmedBooking(null); navigate('/'); }}
                className="w-full bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-secondary transition-all tracking-widest"
              >
                RETURN TO HOME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
