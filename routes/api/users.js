const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const isAuthenticated = require('../../middleware/isAuthenticated');

// Get a user profile
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

// Update a user profile
router.put('/:id', isAuthenticated, userController.updateUser);

module.exports = router;
