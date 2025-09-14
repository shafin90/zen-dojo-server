const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// User routes
router.get('/gettingUserInfo', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUserById);
router.put('/updateUserInfo/:id', UserController.updateUser);
router.put('/updateUserStatus/:id', UserController.updateUserStatus);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
