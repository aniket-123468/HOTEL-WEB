import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Registered user (optional — guests can book without account)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Guest contact details (required when user is not provided)
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please add a check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please add a check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please add number of guests'],
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    arrivalTime: { type: String },
    notes: { type: String },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    preferences: {
      dietary: { type: Boolean, default: false },
      airportTransfer: { type: Boolean, default: false },
      quietRoom: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
