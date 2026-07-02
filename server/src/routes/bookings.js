import express from 'express';
import { createBooking, getBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(protect, isAdmin, getBookings);

export default router;
