import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI, orderAPI } from '../utils/api';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const { data: u } = await authAPI.getUser(user.id || user._id);
                setUserInfo(u);

                const { data: o } = await orderAPI.getUserOrders(user.id || user._id);
                setOrders(o);
            } catch (err) {
                console.error('Failed to load profile data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{userInfo?.name || user.name}</h2>
                            <p className="text-gray-500">{userInfo?.email || user.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/cart')} className="px-4 py-2 bg-primary-600 text-white rounded-xl">Your Cart</button>
                            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-xl">Logout</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Your Orders</h3>
                    {orders.length === 0 ? (
                        <div className="text-gray-500">No orders yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(o => (
                                <div key={o._id || o.id} className="p-4 border rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">Order #{o._id || o.id}</div>
                                            <div className="text-gray-500 text-sm">Status: {o.status}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">${o.total.toFixed(2)}</div>
                                            <div className="text-gray-500 text-sm">{new Date(o.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
