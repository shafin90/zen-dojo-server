const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
        maxlength: [100, 'Class name cannot exceed 100 characters']
    },
    instructorName: {
        type: String,
        required: [true, 'Instructor name is required'],
        trim: true,
        maxlength: [100, 'Instructor name cannot exceed 100 characters']
    },
    instructorEmail: {
        type: String,
        required: [true, 'Instructor email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Available seats is required'],
        min: [0, 'Available seats cannot be negative'],
        default: 0
    },
    classStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    duration: {
        type: Number, // in minutes
        min: [1, 'Duration must be at least 1 minute']
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
classSchema.index({ className: 1 });
classSchema.index({ classStatus: 1 });
classSchema.index({ instructorEmail: 1 });
classSchema.index({ category: 1 });

// Virtual for available seats
classSchema.virtual('seatsRemaining').get(function() {
    return this.availableSeats - this.enrolledStudents.length;
});

// Virtual for class summary
classSchema.virtual('summary').get(function() {
    return {
        id: this._id,
        className: this.className,
        instructorName: this.instructorName,
        price: this.price,
        availableSeats: this.availableSeats,
        seatsRemaining: this.seatsRemaining,
        classStatus: this.classStatus,
        category: this.category
    };
});

// Instance method to enroll a student
classSchema.methods.enrollStudent = function(studentId) {
    if (this.seatsRemaining > 0 && !this.enrolledStudents.includes(studentId)) {
        this.enrolledStudents.push(studentId);
        return this.save();
    }
    throw new Error('No seats available or student already enrolled');
};

// Instance method to unenroll a student
classSchema.methods.unenrollStudent = function(studentId) {
    this.enrolledStudents = this.enrolledStudents.filter(id => !id.equals(studentId));
    return this.save();
};

// Instance method to update status
classSchema.methods.updateStatus = function(newStatus) {
    this.classStatus = newStatus;
    return this.save();
};

// Static method to find classes by status
classSchema.statics.findByStatus = function(status) {
    return this.find({ classStatus: status, isActive: true });
};

// Static method to find classes by instructor
classSchema.statics.findByInstructor = function(instructorEmail) {
    return this.find({ instructorEmail: instructorEmail, isActive: true });
};

// Static method to find available classes
classSchema.statics.findAvailable = function() {
    return this.find({ 
        classStatus: 'approved', 
        isActive: true,
        $expr: { $gt: [{ $subtract: ['$availableSeats', { $size: '$enrolledStudents' }] }, 0] }
    });
};

module.exports = classSchema;
