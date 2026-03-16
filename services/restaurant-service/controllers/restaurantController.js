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
            ownerId: req.user?.id || req.user?.id,
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

const getOwnerRestaurants = async (req, res, next) => {
    try {
        const ownerId = req.user?.id || req.user?.id;
        const restaurants = await Restaurant.find({ ownerId });
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    try {
        const { id, menuId } = req.params;
        const { name, price, category, image } = req.body;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        // Allow action if owner or admin
        if (String(restaurant.ownerId) !== String(req.user?.id || req.user?.id) && req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('Forbidden: not the owner');
        }

        const menuItem = await MenuItem.findOne({ _id: menuId, restaurantId: id });
        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        if (name !== undefined) menuItem.name = name;
        if (price !== undefined) menuItem.price = price;
        if (category !== undefined) menuItem.category = category;
        if (image !== undefined) menuItem.image = image;

        const updated = await menuItem.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const { id, menuId } = req.params;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        // Allow action if owner or admin
        if (String(restaurant.ownerId) !== String(req.user?.id || req.user?.id) && req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('Forbidden: not the owner');
        }

        const menuItem = await MenuItem.findOne({ _id: menuId, restaurantId: id });
        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        next(error);
    }
};

const updateRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, cuisine, image } = req.body;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        // Allow action if owner or admin
        if (String(restaurant.ownerId) !== String(req.user?.id || req.user?.id) && req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('Forbidden: not the owner');
        }

        if (name !== undefined) restaurant.name = name;
        if (cuisine !== undefined) restaurant.cuisine = cuisine;
        if (image !== undefined) restaurant.image = image;

        const updated = await restaurant.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const deleteRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        // Allow if owner or admin
        if (String(restaurant.ownerId) !== String(req.user?.id || req.user?.id) && req.user?.role !== 'admin') {
            res.status(403);
            throw new Error('Forbidden: not the owner');
        }

        await restaurant.deleteOne();
        // Also delete menu items for this restaurant
        await MenuItem.deleteMany({ restaurantId: id });
        res.json({ message: 'Restaurant deleted' });
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
    , getOwnerRestaurants, updateMenuItem, deleteMenuItem, updateRestaurant, deleteRestaurant
};
