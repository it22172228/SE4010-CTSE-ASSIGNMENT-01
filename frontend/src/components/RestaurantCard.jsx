import { motion } from 'framer-motion';
import { Star, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <Link to={`/restaurant/${restaurant._id || restaurant.id}`}>
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-500 hover:text-red-500 transition-colors z-10">
                        <Heart size={20} />
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-700">{restaurant.rating || "4.5"}</span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Delivery</span>
                            <span className="text-gray-900">$2.99</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Time</span>
                            <span className="flex text-gray-900"><Clock size={16} className="mr-1 relative top-[2px]" /> 25-35 min</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default RestaurantCard;
