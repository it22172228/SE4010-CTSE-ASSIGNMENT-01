import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useEffect } from 'react';

const NotificationToast = ({ notification, onClose }) => {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex"
                >
                    <div className="w-2 bg-primary-500"></div>
                    <div className="p-4 flex gap-4 w-full items-start">
                        <div className="bg-primary-100 p-2 rounded-full text-primary-600 mt-1">
                            <Bell size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">Order Update</h4>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-1">
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
