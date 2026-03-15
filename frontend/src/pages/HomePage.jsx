import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { restaurantAPI } from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import { Search } from 'lucide-react';

const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await restaurantAPI.getRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine))];

    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || r.cuisine === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-primary-600 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Premium Food, Delivered Fast.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl"
                    >
                        Experience the finest local restaurants from the comfort of your home.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-2xl relative"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for restaurants or cuisines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-400 shadow-xl text-lg"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 mt-8 mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {cuisines.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => setFilter(c)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors ${filter === c
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Restaurant Grid */}
            <div className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center py-20">
                        {/* Skeleton */}
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden h-72 border border-gray-100">
                                <div className="bg-gray-200 h-48 w-full"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRestaurants.map((restaurant, index) => (
                            <RestaurantCard key={restaurant._id || restaurant.id} restaurant={restaurant} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
