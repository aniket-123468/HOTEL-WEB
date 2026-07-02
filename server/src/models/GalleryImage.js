import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an image title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Architecture', 'Interiors', 'Culinary Art', 'Moments'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    cloudinaryPublicId: {
      type: String,
    },
    altText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;
