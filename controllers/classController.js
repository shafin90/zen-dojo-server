const Class = require('../models/Class');

class ClassController {
    // Pending Classes
    static async createPendingClass(req, res) {
        try {
            const classData = req.body;
            classData.classStatus = 'pending';
            
            const newClass = new Class(classData);
            const savedClass = await newClass.save();
            
            res.status(201).json({
                success: true,
                message: 'Pending class created successfully',
                data: savedClass
            });
        } catch (error) {
            console.error('Error in createPendingClass controller:', error);
            
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

    static async getAllPendingClasses(req, res) {
        try {
            const classes = await Class.findByStatus('pending');
            
            res.status(200).json({
                success: true,
                message: 'Pending classes retrieved successfully',
                data: classes
            });
        } catch (error) {
            console.error('Error in getAllPendingClasses controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async deletePendingClass(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Class ID is required'
                });
            }

            const deletedClass = await Class.findByIdAndUpdate(
                id, 
                { isActive: false }, 
                { new: true }
            );
            
            if (deletedClass) {
                res.status(200).json({
                    success: true,
                    message: 'Pending class deleted successfully',
                    data: deletedClass
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }
        } catch (error) {
            console.error('Error in deletePendingClass controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Approved Classes
    static async approveClass(req, res) {
        try {
            const classData = req.body;
            classData.classStatus = 'approved';
            
            const newClass = new Class(classData);
            const savedClass = await newClass.save();
            
            res.status(201).json({
                success: true,
                message: 'Class approved successfully',
                data: savedClass
            });
        } catch (error) {
            console.error('Error in approveClass controller:', error);
            
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

    static async getAllApprovedClasses(req, res) {
        try {
            const classes = await Class.findByStatus('approved');
            
            res.status(200).json({
                success: true,
                message: 'Approved classes retrieved successfully',
                data: classes
            });
        } catch (error) {
            console.error('Error in getAllApprovedClasses controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async deleteApprovedClass(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Class ID is required'
                });
            }

            const deletedClass = await Class.findByIdAndUpdate(
                id, 
                { isActive: false }, 
                { new: true }
            );
            
            if (deletedClass) {
                res.status(200).json({
                    success: true,
                    message: 'Approved class deleted successfully',
                    data: deletedClass
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }
        } catch (error) {
            console.error('Error in deleteApprovedClass controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Selected Classes
    static async selectClass(req, res) {
        try {
            const classData = req.body;
            
            if (!classData.className || !classData.email) {
                return res.status(400).json({
                    success: false,
                    message: 'Class name and email are required'
                });
            }

            // Create a selected class record (this could be a separate model or use metadata)
            const selectedClass = new Class({
                ...classData,
                classStatus: 'selected',
                selectedBy: classData.email
            });
            
            const savedClass = await selectedClass.save();
            
            res.status(201).json({
                success: true,
                message: 'Class selected successfully',
                data: savedClass
            });
        } catch (error) {
            console.error('Error in selectClass controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async getAllSelectedClasses(req, res) {
        try {
            const classes = await Class.findByStatus('selected');
            
            res.status(200).json({
                success: true,
                message: 'Selected classes retrieved successfully',
                data: classes
            });
        } catch (error) {
            console.error('Error in getAllSelectedClasses controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async deleteSelectedClass(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Class ID is required'
                });
            }

            const deletedClass = await Class.findByIdAndUpdate(
                id, 
                { isActive: false }, 
                { new: true }
            );
            
            if (deletedClass) {
                res.status(200).json({
                    success: true,
                    message: 'Selected class deleted successfully',
                    data: deletedClass
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }
        } catch (error) {
            console.error('Error in deleteSelectedClass controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Enrolled Classes
    static async getAllEnrolledClasses(req, res) {
        try {
            const classes = await Class.find({ 
                classStatus: 'completed', 
                isActive: true 
            }).populate('enrolledStudents', 'name email');
            
            res.status(200).json({
                success: true,
                message: 'Enrolled classes retrieved successfully',
                data: classes
            });
        } catch (error) {
            console.error('Error in getAllEnrolledClasses controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = ClassController;
