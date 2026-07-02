import Booking from '../models/Booking.js';
import crypto from 'crypto';

// Simulated Razorpay Key Secret
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'MOCK_SECRET_12345';

// @desc    Create a mock Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ success: false, error: 'Amount and receipt are required' });
    }

    // Mock Razorpay Order ID generation
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    res.status(200).json({
      success: true,
      order: {
        id: mockOrderId,
        entity: 'order',
        amount: amount, // amount in paise
        amount_paid: 0,
        amount_due: amount,
        currency: currency,
        receipt: receipt,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify mock Razorpay payment and update booking
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !bookingId) {
      return res.status(400).json({ success: false, error: 'Missing payment details' });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // In a real scenario, we would verify the HMAC signature here
    // const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
    // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    // const expectedSignature = hmac.digest('hex');
    // if (expectedSignature !== razorpay_signature) {
    //   return res.status(400).json({ success: false, error: 'Invalid signature' });
    // }

    // Mock successful verification
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.razorpayOrderId = razorpay_order_id;
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};
