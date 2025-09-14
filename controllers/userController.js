const User = require('../models/User');

class UserController {
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = await User.find({ isActive: true });
            
            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            console.error('Error in getAllUsers controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Create a new user
    static async createUser(req, res) {
        try {
            const userData = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            const user = new User(userData);
            const savedUser = await user.save();
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: savedUser
            });
        } catch (error) {
            console.error('Error in createUser controller:', error);
            
            // Handle validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors
                });
            }
            
            // Handle duplicate key error
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get user by ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const user = await User.findById(id);
            
            if (user && user.isActive) {
                res.status(200).json({
                    success: true,
                    message: 'User retrieved successfully',
                    data: user
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Error in getUserById controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Update user information
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const user = await User.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );
            
            if (user) {
                res.status(200).json({
                    success: true,
                    message: 'User updated successfully',
                    data: user
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Error in updateUser controller:', error);
            
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

    // Update user status
    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const updatedUser = await user.updateStatus(status);
            
            res.status(200).json({
                success: true,
                message: 'User status updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.error('Error in updateUserStatus controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Delete user (soft delete)
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const user = await User.findByIdAndUpdate(
                id, 
                { isActive: false }, 
                { new: true }
            );
            
            if (user) {
                res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                    data: user
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Error in deleteUser controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = UserController;
