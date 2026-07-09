import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Room from '../models/Room.js';
import MenuItem from '../models/MenuItem.js';
import GalleryImage from '../models/GalleryImage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root regardless of where the script is executed from
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const users = [
  {
    name: 'Default User',
    email: 'user@delhiline.com',
    password: 'Password123',
    role: 'user',
  },
  {
    name: 'Default Admin',
    email: 'admin@delhiline.com',
    password: 'Password123',
    role: 'admin',
  },
];

const rooms = [
  {
    name: 'Classic Heritage',
    tier: 'Classic',
    description:
      "Intimately designed with hand-selected Indian textiles and dark wood finishes, our Classic Heritage rooms offer a soulful connection to the city's storied past without compromising on modern luxury.",
    pricePerNight: 18500,
    weekendMultiplier: 1.15,
    seasonalMultiplier: 1.0,
    size: '35 sqm',
    amenities: ['Free Wi-Fi', '24/7 Room Service', 'Mughal Courtyard View', 'Minibar', 'Bespoke Bath Amenities'],
    images: ['hotel_heritage_corridor.png'],
    maxGuests: 2,
    wing: 'HERITAGE WING',
  },
  {
    name: 'Executive Studio',
    tier: 'Executive',
    description:
      'Perfect for the business traveler, these studios feature a dedicated workspace, floor-to-ceiling windows, and a minimalist aesthetic that promotes clarity and productivity.',
    pricePerNight: 24000,
    weekendMultiplier: 1.15,
    seasonalMultiplier: 1.0,
    size: '50 sqm',
    amenities: ['High-speed Wi-Fi', 'Smart Tech Automation', 'Dedicated Workspace', 'Skyline View', 'Espresso Machine'],
    images: ['hotel_grand_lobby.png'],
    maxGuests: 2,
    wing: 'SKYLINE WING',
  },
  {
    name: 'The Royal Line Suite',
    tier: 'Royal Suite',
    description:
      "Our crown jewel. A sprawling residence featuring a private dining room, a marble-clad spa bathroom, and unparalleled views of the city's historic landmarks. This is heritage redefined.",
    pricePerNight: 75000,
    weekendMultiplier: 1.20,
    seasonalMultiplier: 1.1,
    size: '120 sqm',
    amenities: ['24/7 Private Butler', 'In-room Jacuzzi', 'Private Dining Room', 'Rashtrapati Bhavan Views', 'Airport Limousine Transfer'],
    images: ['hotel_imperial_suite.png'],
    maxGuests: 4,
    wing: 'SIGNATURE SUITE',
  },
];

const menuItems = [
  // Tasting Journey
  {
    name: 'Spiced Scallop Crudo',
    category: 'Tasting Journey',
    description: 'Kashmiri chili oil, finger lime, cilantro foam',
    price: 1850,
    image: 'hotel_fine_dining.png',
    tags: ['Signature', 'Seafood'],
  },
  {
    name: 'Duo of Highland Lamb',
    category: 'Tasting Journey',
    description: 'Smoked eggplant, fermented garlic, red wine jus',
    price: 3200,
    image: 'hotel_fine_dining.png',
    tags: ['Signature', 'Meat'],
  },
  {
    name: 'Cardamom Silk',
    category: 'Tasting Journey',
    description: 'White chocolate aero, rose dust, honey tuile',
    price: 1400,
    image: 'hotel_breakfast_spread.png',
    tags: ['Dessert'],
  },
  // À La Carte
  {
    name: 'Saffron Bisque',
    category: 'À La Carte',
    description: 'Lobster oil, smoked paprika cream, micro coriander',
    price: 950,
    image: 'hotel_fine_dining.png',
    tags: ['Soup', 'Seafood'],
  },
  {
    name: 'Charcoal Paneer',
    category: 'À La Carte',
    description: 'Truffle-infused makhani, heritage grain risotto',
    price: 1600,
    image: 'hotel_fine_dining.png',
    tags: ['Vegetarian'],
  },
  {
    name: 'Rose Water Soufflé',
    category: 'À La Carte',
    description: 'Pistachio praline, gulkand ice cream',
    price: 1200,
    image: 'hotel_breakfast_spread.png',
    tags: ['Dessert'],
  },
  // Sommelier Select
  {
    name: 'Château Margaux 2015',
    category: 'Sommelier Select',
    description: 'Premier Grand Cru Classé, Bordeaux',
    price: 28000,
    image: 'hotel_fine_dining.png',
    tags: ['Red Wine', 'Premium'],
  },
  {
    name: 'Dom Pérignon 2012',
    category: 'Sommelier Select',
    description: 'Vintage Champagne, Épernay',
    price: 22000,
    image: 'hotel_fine_dining.png',
    tags: ['Champagne', 'Premium'],
  },
  {
    name: 'Opus One 2018',
    category: 'Sommelier Select',
    description: 'Napa Valley Cabernet Sauvignon',
    price: 35000,
    image: 'hotel_fine_dining.png',
    tags: ['Red Wine', 'Premium'],
  },
];

const galleryImages = [
  {
    title: 'The Grand Lobby',
    category: 'Architecture',
    imageUrl: 'hotel_grand_lobby.png',
    altText: 'Luxury hotel grand lobby with crystal chandeliers and Mughal arches',
  },
  {
    title: 'The Heritage Corridor',
    category: 'Architecture',
    imageUrl: 'hotel_heritage_corridor.png',
    altText: 'Grand arched corridor with brass lanterns and sandstone floors',
  },
  {
    title: 'The Imperial Suite',
    category: 'Interiors',
    imageUrl: 'hotel_imperial_suite.png',
    altText: 'Imperial suite bedroom with charcoal silk drapes and Delhi skyline views',
  },
  {
    title: 'The Courtyard at Twilight',
    category: 'Moments',
    imageUrl: 'hotel_courtyard_garden.png',
    altText: 'Mughal-style courtyard garden with reflecting pool at twilight',
  },
  {
    title: 'The Line Restaurant',
    category: 'Culinary Art',
    imageUrl: 'hotel_fine_dining.png',
    altText: 'Heritage fine dining restaurant with arched jali screens and candlelit tables',
  },
  {
    title: 'Morning Indulgence',
    category: 'Culinary Art',
    imageUrl: 'hotel_breakfast_spread.png',
    altText: 'Luxury breakfast spread with gold-rim crockery and fresh pastries',
  },
  {
    title: 'Rooftop Serenity',
    category: 'Moments',
    imageUrl: 'hotel_rooftop_pool.png',
    altText: 'Rooftop infinity pool overlooking New Delhi skyline at golden hour',
  },
  {
    title: 'The Spa Sanctuary',
    category: 'Interiors',
    imageUrl: 'hotel_spa_sanctuary.png',
    altText: 'Luxury spa treatment room with lotus murals and koi garden views',
  },
];

export const seedData = async () => {
  try {
    // Check if users already exist to avoid reseeding unnecessarily
    const count = await User.countDocuments();
    if (count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');
    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();
    await MenuItem.deleteMany();
    await GalleryImage.deleteMany();
    console.log('Cleared existing collections.');

    // Seed Users
    for (const u of users) {
      await User.create(u);
    }
    console.log(`Seeded ${users.length} Users.`);

    // Seed Rooms
    await Room.insertMany(rooms);
    console.log(`Seeded ${rooms.length} Rooms.`);

    // Seed MenuItems
    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} Menu Items.`);

    // Seed GalleryImages
    await GalleryImage.insertMany(galleryImages);
    console.log(`Seeded ${galleryImages.length} Gallery Images.`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// If run directly (not imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose.connect(process.env.MONGODB_URI).then(() => seedData().then(() => process.exit(0)));
}
