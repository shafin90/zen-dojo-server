const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Payment routes
router.post('/process_payment', PaymentController.processPayment);
router.post('/create_payment_intent', PaymentController.createPaymentIntent);
router.get('/payments', PaymentController.getAllPayments);
router.get('/payments/email/:email', PaymentController.getPaymentsByEmail);
router.put('/payments/:paymentId/status', PaymentController.updatePaymentStatus);
router.get('/verify_payment/:paymentIntentId', PaymentController.verifyPayment);

module.exports = router;
