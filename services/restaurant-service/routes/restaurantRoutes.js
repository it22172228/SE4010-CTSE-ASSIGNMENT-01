const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    getMenuByRestaurant,
    createMenuItem
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for browsing
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getMenuByRestaurant);

// Protected routes for management (e.g. only authenticated users/admins)
router.post('/', protect, createRestaurant);
router.post('/:id/menu', protect, createMenuItem);

module.exports = router;
