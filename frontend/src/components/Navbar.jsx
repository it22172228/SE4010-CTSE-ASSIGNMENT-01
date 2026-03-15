import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ cartCount, toggleCart }) => {
    return (
        <nav className="sticky top-0 z-40 w-full glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            className="bg-primary-500 text-white p-2 rounded-xl"
                        >
                            <Utensils size={24} />
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            SmartEat
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleCart}
                            className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center translate-x-1 -translate-y-1"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
