const { createPayment, verifyPayment, getPaymentDetails } = require('../controller/Payment.controller');
const router = require('express').Router();

router.post('/create-order', createPayment);
router.post('/verify', verifyPayment);
router.get('/:paymentId', getPaymentDetails);

module.exports = router;
