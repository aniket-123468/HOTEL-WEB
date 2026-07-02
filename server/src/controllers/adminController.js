import Booking from '../models/Booking.js';
import DiningReservation from '../models/DiningReservation.js';
import Room from '../models/Room.js';

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalDiningReservations = await DiningReservation.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    const bookings = await Booking.find();
    const revenue = bookings.reduce((acc, booking) => acc + (booking.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalDiningReservations,
        totalRooms,
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
