import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, isAdmin, createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, isAdmin, updateRoom)
  .delete(protect, isAdmin, deleteRoom);

export default router;
