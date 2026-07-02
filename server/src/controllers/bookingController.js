import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { z } from 'zod';

const TAX_RATE = 0.18;

const bookingInputSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  checkIn: z.string().refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid check-in date' }),
  checkOut: z.string().refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid check-out date' }),
  guests: z.number().min(1).max(10),
  guestInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
  }),
  arrivalTime: z.string().optional(),
  notes: z.string().optional(),
  preferences: z
    .object({
      dietary: z.boolean().optional(),
      airportTransfer: z.boolean().optional(),
      quietRoom: z.boolean().optional(),
    })
    .optional(),
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (guests allowed)
export const createBooking = async (req, res, next) => {
  try {
    const validation = bookingInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map((e) => e.message).join(', '),
      });
    }

    const { roomId, checkIn, checkOut, guests, guestInfo, arrivalTime, notes, preferences } =
      validation.data;

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    // Validate guests <= room capacity
    if (guests > room.maxGuests) {
      return res.status(400).json({
        success: false,
        error: `This room accommodates a maximum of ${room.maxGuests} guests`,
      });
    }

    // Calculate nights & total
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ success: false, error: 'Check-out must be after check-in' });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const subtotal = room.pricePerNight * nights;
    const taxAmount = Math.round(subtotal * TAX_RATE);
    const totalAmount = subtotal + taxAmount;

    const booking = await Booking.create({
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      guestInfo,
      arrivalTime,
      notes,
      preferences,
      totalAmount,
      taxAmount,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      booking: {
        _id: booking._id,
        room: { name: room.name, wing: room.wing, tier: room.tier },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        guests: booking.guests,
        guestInfo: booking.guestInfo,
        totalAmount: booking.totalAmount,
        taxAmount: booking.taxAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('room', 'name tier').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
