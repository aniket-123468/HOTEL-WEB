import express from 'express';
import { getMenuItems, createReservation, getReservations } from '../controllers/diningController.js';
import { protect } from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/menu', getMenuItems);
router.post('/reservation', createReservation);
router.get('/reservations', protect, isAdmin, getReservations);

export default router;
