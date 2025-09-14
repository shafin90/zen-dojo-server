const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51NI6RJJlO98Mt1tpbV5uJwn1GRt9lDB2ypwuk8erS5oHxTJxuMNOD0NERGU6Wvr7OI4W7NH7Aq4vAHKj1tjUwWod00RshRSN5G');
const paymentSchema = require('../schemas/paymentSchema');

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

// Static methods for Stripe integration
Payment.createPaymentIntent = async function(className, amount, email) {
    try {
        // Create a Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            description: `Payment for ${className}`,
            metadata: { 
                className: className,
                email: email
            }
        });

        return { 
            success: true, 
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return { success: false, error: error.message };
    }
};

Payment.verifyPayment = async function(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        return {
            success: true,
            data: {
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata
            }
        };
    } catch (error) {
        console.error('Error verifying payment:', error);
        return { success: false, error: error.message };
    }
};

module.exports = Payment;
