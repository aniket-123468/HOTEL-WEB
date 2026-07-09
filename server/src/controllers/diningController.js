import MenuItem from '../models/MenuItem.js';
import DiningReservation from '../models/DiningReservation.js';
import { z } from 'zod';

const reservationInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().min(1, 'At least 1 guest required'),
  notes: z.string().optional(),
});

// @desc    Get all menu items
// @route   GET /api/dining/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const menuItems = await MenuItem.find(filter).lean();

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create dining reservation
// @route   POST /api/dining/reservation
// @access  Public
export const createReservation = async (req, res, next) => {
  try {
    const validation = reservationInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map((err) => err.message).join(', '),
      });
    }

    const reservation = await DiningReservation.create(validation.data);

    res.status(201).json({
      success: true,
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all dining reservations
// @route   GET /api/dining/reservations
// @access  Private/Admin
export const getReservations = async (req, res, next) => {
  try {
    const reservations = await DiningReservation.find().sort('-createdAt').lean();
    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    next(error);
  }
};
