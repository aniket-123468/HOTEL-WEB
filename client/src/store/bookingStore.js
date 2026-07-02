import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * bookingStore — global booking state managed with Zustand.
 * Persisted to sessionStorage so dates/room survive page navigation.
 */
const useBookingStore = create(
  persist(
    (set) => ({
      checkIn: '',
      checkOut: '',
      guests: 2,
      selectedRoom: null,
      selectedRoomPrice: 0,
      step: 1,

      setCheckIn: (date) => set({ checkIn: date }),
      setCheckOut: (date) => set({ checkOut: date }),
      setGuests: (count) => set({ guests: count }),
      setSelectedRoom: (room) =>
        set({ selectedRoom: room, selectedRoomPrice: room?.pricePerNight || 0 }),
      setStep: (step) => set({ step }),

      reset: () =>
        set({
          checkIn: '',
          checkOut: '',
          guests: 2,
          selectedRoom: null,
          selectedRoomPrice: 0,
          step: 1,
        }),
    }),
    {
      name: 'dlh-booking',
      storage: {
        getItem: (key) => {
          const val = sessionStorage.getItem(key);
          return val ? JSON.parse(val) : null;
        },
        setItem: (key, val) => sessionStorage.setItem(key, JSON.stringify(val)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);

export default useBookingStore;
