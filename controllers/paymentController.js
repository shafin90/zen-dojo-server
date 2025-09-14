const Payment = require('../models/Payment');

class PaymentController {
    // Process payment and create enrollment
    static async processPayment(req, res) {
        try {
            const { className, amount, email } = req.body;
            
            // Basic validation
            if (!className || !amount || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Class name, amount, and email are required'
                });
            }

            // Validate amount is a positive number
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be a positive number'
                });
            }

            // Create payment record
            const payment = new Payment({
                className,
                amount,
                email,
                paymentStatus: 'completed'
            });
            
            const savedPayment = await payment.save();
            
            res.status(201).json({
                success: true,
                message: 'Payment processed and enrollment created successfully',
                data: savedPayment
            });
        } catch (error) {
            console.error('Error in processPayment controller:', error);
            
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Create Stripe payment intent
    static async createPaymentIntent(req, res) {
        try {
            const { className, amount, email } = req.body;
            
            // Basic validation
            if (!className || !amount || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Class name, amount, and email are required'
                });
            }

            // Validate amount is a positive number
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be a positive number'
                });
            }

            // Convert amount to cents for Stripe
            const amountInCents = Math.round(amount * 100);

            const result = await Payment.createPaymentIntent(className, amountInCents, email);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Payment intent created successfully',
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create payment intent',
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in createPaymentIntent controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get all payments/enrollments
    static async getAllPayments(req, res) {
        try {
            const payments = await Payment.find({ isActive: true }).sort({ createdAt: -1 });
            
            res.status(200).json({
                success: true,
                message: 'Payments retrieved successfully',
                data: payments
            });
        } catch (error) {
            console.error('Error in getAllPayments controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get payments by email
    static async getPaymentsByEmail(req, res) {
        try {
            const { email } = req.params;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const payments = await Payment.findByEmail(email);
            
            res.status(200).json({
                success: true,
                message: 'Payments retrieved successfully',
                data: payments
            });
        } catch (error) {
            console.error('Error in getPaymentsByEmail controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update payment status
    static async updatePaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;
            const { status } = req.body;
            
            if (!paymentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment ID is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            const updatedPayment = await payment.updateStatus(status);
            
            res.status(200).json({
                success: true,
                message: 'Payment status updated successfully',
                data: updatedPayment
            });
        } catch (error) {
            console.error('Error in updatePaymentStatus controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Verify payment with Stripe
    static async verifyPayment(req, res) {
        try {
            const { paymentIntentId } = req.params;
            
            if (!paymentIntentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment Intent ID is required'
                });
            }

            const result = await Payment.verifyPayment(paymentIntentId);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Payment verified successfully',
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to verify payment',
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in verifyPayment controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = PaymentController;
