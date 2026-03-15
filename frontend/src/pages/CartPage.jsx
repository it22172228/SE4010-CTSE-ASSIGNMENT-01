import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const CartPage = () => {
    const { cartItems, currentRestaurantId, clearCart, updateQuantity } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const orderData = {
                restaurantId: currentRestaurantId,
                items: cartItems.map(item => ({
                    menuItemId: item._id || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total
            };

            const { data } = await orderAPI.createOrder(orderData);
            setSuccess(true);
            clearCart();

            // Redirect to tracking page after 2 seconds
            setTimeout(() => {
                navigate(`/track/${data._id || data.id}`);
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Are you logged in?');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-green-100 text-green-600 p-6 rounded-full mb-6"
                >
                    <CheckCircle2 size={64} />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 text-lg">Redirecting to order tracking...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h3>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                        >
                            Browse Restaurants
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-8">
                            {cartItems.map(item => (
                                <div key={item._id || item.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                            <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3"} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100 mb-8">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span>${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
