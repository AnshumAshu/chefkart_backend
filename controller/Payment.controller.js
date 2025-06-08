const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
const Payment = require('../model/Payment.Model');
const Booking = require('../model/Booking.Model');

dotenv.config();

// Initialize razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new payment order
exports.createPayment = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking Not found' });

        const options = {
            amount: amount * 100, // in paisa
            currency: "INR",
            receipt: `receipt_${bookingId}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify payment and save to DB
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
            userId,
            amount,
            paymentMethod
        } = req.body;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const payment = new Payment({
            bookingId,
            userId,
            amount,
            status: 'completed',
            transactionId: razorpay_payment_id,
            paymentMethod,
        });

        await payment.save();
        res.status(200).json({ message: "Payment successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const paymentData = await Payment.findById(paymentId)
            .populate('bookingId')
            .populate('userId');

        if (!paymentData) return res.status(404).json({ message: "Payment not found" });

        res.status(200).json({ success: true, payment: paymentData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
