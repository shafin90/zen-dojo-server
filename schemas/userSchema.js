const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    photoURL: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        photoURL: this.photoURL,
        status: this.status,
        isActive: this.isActive
    };
});

// Instance method to update user status
userSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    return this.save();
};

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

// Static method to find users by status
userSchema.statics.findByStatus = function(status) {
    return this.find({ status: status, isActive: true });
};

module.exports = userSchema;
