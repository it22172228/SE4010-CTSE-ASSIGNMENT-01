import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Home } from 'lucide-react';

const OrderTimeline = ({ currentStatus }) => {
    const steps = [
        { id: 'PLACED', label: 'Order Placed', icon: Clock },
        { id: 'PREPARING', label: 'Preparing', icon: CheckCircle2 },
        { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { id: 'DELIVERED', label: 'Delivered', icon: Home },
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStatus);

    return (
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>

                {/* Active Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 rounded-full z-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors duration-300 ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                            >
                                <Icon size={20} />
                            </motion.div>
                            <div className={`mt-3 font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;
