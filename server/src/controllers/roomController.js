import Room from '../models/Room.js';
import { z } from 'zod';

const roomInputSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  tier: z.enum(['Classic', 'Executive', 'Royal Suite'], {
    errorMap: () => ({ message: 'Tier must be Classic, Executive, or Royal Suite' }),
  }),
  description: z.string().min(1, 'Description is required'),
  pricePerNight: z.number().min(0, 'Price must be a positive number'),
  weekendMultiplier: z.number().min(1.0, 'Weekend multiplier must be at least 1.0').optional(),
  seasonalMultiplier: z.number().min(1.0, 'Seasonal multiplier must be at least 1.0').optional(),
  size: z.string().min(1, 'Size is required (e.g. 35 sqm)'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  maxGuests: z.number().min(1, 'Max guests must be at least 1'),
  wing: z.string().min(1, 'Wing is required'),
});

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res, next) => {
  try {
    const { tier } = req.query;
    const filter = {};
    if (tier) {
      filter.tier = tier;
    }

    const rooms = await Room.find(filter);

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res, next) => {
  try {
    const validation = roomInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map(err => err.message).join(', '),
      });
    }

    const room = await Room.create(validation.data);

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res, next) => {
  try {
    const validation = roomInputSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map(err => err.message).join(', '),
      });
    }

    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, validation.data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
