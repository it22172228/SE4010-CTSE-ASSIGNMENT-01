import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const MenuItemCard = ({ item, onAddToCart }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
        >
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description || item.category}</p>
                <div className="mt-4 font-semibold text-gray-900">${item.price.toFixed(2)}</div>
            </div>
            <div className="w-32 h-32 flex-shrink-0 relative rounded-xl overflow-hidden">
                <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAddToCart(item)}
                    className="absolute bottom-2 right-2 bg-white text-gray-900 p-2 rounded-full shadow-lg border border-gray-100/50 hover:bg-gray-50 z-10"
                >
                    <Plus size={20} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MenuItemCard;
