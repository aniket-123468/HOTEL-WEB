import mongoose from 'mongoose';

const diningReservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the reservation'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add a contact email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a reservation date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a reservation time'],
    },
    guests: {
      type: Number,
      required: [true, 'Please add the number of guests'],
      min: 1,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed', // Dining tables can default to auto-confirmed
    },
  },
  {
    timestamps: true,
  }
);

const DiningReservation = mongoose.model('DiningReservation', diningReservationSchema);

export default DiningReservation;
