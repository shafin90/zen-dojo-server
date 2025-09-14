const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    stripeChargeId: {
        type: String,
        unique: true,
        sparse: true
    },
    currency: {
        type: String,
        default: 'usd',
        uppercase: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank_transfer', 'wallet'],
        default: 'card'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    refundAmount: {
        type: Number,
        default: 0,
        min: [0, 'Refund amount cannot be negative']
    },
    refundReason: {
        type: String,
        trim: true
    },
    metadata: {
        type: Map,
        of: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
paymentSchema.index({ email: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for payment summary
paymentSchema.virtual('summary').get(function() {
    return {
        id: this._id,
        className: this.className,
        amount: this.amount,
        email: this.email,
        paymentStatus: this.paymentStatus,
        currency: this.currency,
        createdAt: this.createdAt
    };
});

// Virtual for net amount (after refunds)
paymentSchema.virtual('netAmount').get(function() {
    return this.amount - this.refundAmount;
});

// Instance method to update payment status
paymentSchema.methods.updateStatus = function(newStatus) {
    this.paymentStatus = newStatus;
    return this.save();
};

// Instance method to process refund
paymentSchema.methods.processRefund = function(refundAmount, reason) {
    if (this.paymentStatus !== 'completed') {
        throw new Error('Only completed payments can be refunded');
    }
    
    if (refundAmount > this.netAmount) {
        throw new Error('Refund amount cannot exceed net payment amount');
    }
    
    this.refundAmount += refundAmount;
    this.refundReason = reason;
    
    if (this.refundAmount >= this.amount) {
        this.paymentStatus = 'refunded';
    }
    
    return this.save();
};

// Static method to find payments by email
paymentSchema.statics.findByEmail = function(email) {
    return this.find({ email: email, isActive: true }).sort({ createdAt: -1 });
};

// Static method to find payments by status
paymentSchema.statics.findByStatus = function(status) {
    return this.find({ paymentStatus: status, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function() {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
                avgAmount: { $avg: '$amount' }
            }
        }
    ]);
};

// Pre-save middleware to generate transaction ID
paymentSchema.pre('save', function(next) {
    if (this.isNew && !this.transactionId) {
        this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

module.exports = paymentSchema;
