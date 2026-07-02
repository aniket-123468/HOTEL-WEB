import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
      unique: true,
    },
    tier: {
      type: String,
      required: [true, 'Please add a tier'],
      enum: ['Classic', 'Executive', 'Royal Suite'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a price per night'],
    },
    weekendMultiplier: {
      type: Number,
      default: 1.15,
    },
    seasonalMultiplier: {
      type: Number,
      default: 1.0,
    },
    size: {
      type: String,
      required: [true, 'Please add room size (e.g. "35 sqm")'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please add maximum guest occupancy'],
      default: 2,
    },
    wing: {
      type: String,
      required: [true, 'Please add a wing name (e.g. "HERITAGE WING")'],
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
