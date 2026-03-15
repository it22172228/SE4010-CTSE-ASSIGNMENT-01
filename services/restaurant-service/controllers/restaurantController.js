const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }
        res.json(restaurant);
    } catch (error) {
        next(error);
    }
};

const createRestaurant = async (req, res, next) => {
    try {
        const { name, cuisine, rating, image } = req.body;

        if (!name || !cuisine) {
            res.status(400);
            throw new Error('Please add name and cuisine');
        }

        const restaurant = await Restaurant.create({
            name,
            cuisine,
            rating,
            image
        });

        res.status(201).json(restaurant);
    } catch (error) {
        next(error);
    }
};

const getMenuByRestaurant = async (req, res, next) => {
    try {
        // Check if restaurant exists
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        const menu = await MenuItem.find({ restaurantId: req.params.id });
        res.json(menu);
    } catch (error) {
        next(error);
    }
};

const createMenuItem = async (req, res, next) => {
    try {
        const { name, price, category, image } = req.body;
        const restaurantId = req.params.id;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        if (!name || !price || !category) {
            res.status(400);
            throw new Error('Please add name, price, and category for the menu item');
        }

        const menuItem = await MenuItem.create({
            restaurantId,
            name,
            price,
            category,
            image
        });

        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    getMenuByRestaurant,
    createMenuItem
};
