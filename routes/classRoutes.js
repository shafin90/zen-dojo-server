const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// Pending Classes routes
router.post('/pending_classes', ClassController.createPendingClass);
router.get('/getting_pending_classes', ClassController.getAllPendingClasses);
router.delete('/delete_class_from_pending_class/:id', ClassController.deletePendingClass);

// Approved Classes routes
router.post('/approve_class', ClassController.approveClass);
router.get('/getting_approved_classes', ClassController.getAllApprovedClasses);
router.delete('/denied_from_approved_class/:id', ClassController.deleteApprovedClass);

// Selected Classes routes
router.post('/selected_class', ClassController.selectClass);
router.get('/getting_selected_class', ClassController.getAllSelectedClasses);
router.delete('/delete_class/:id', ClassController.deleteSelectedClass);

// Enrolled Classes routes
router.get('/getEnrolledClasses', ClassController.getAllEnrolledClasses);

module.exports = router;
