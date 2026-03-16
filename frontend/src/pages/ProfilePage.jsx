import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI, orderAPI } from '../utils/api';
import { restaurantAPI } from '../utils/api';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [ownerRestaurants, setOwnerRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restForm, setRestForm] = useState({ name: '', cuisine: '', image: '' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ownerLoading, setOwnerLoading] = useState(false);
    const [ownerError, setOwnerError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const { data: u } = await authAPI.getUser(user.id || user._id);
                setUserInfo(u);

                const { data: o } = await orderAPI.getUserOrders(user.id || user._id);
                setOrders(o);
                // if owner, fetch owned restaurants
                if (u?.role === 'owner' || user?.role === 'owner') {
                    setOwnerLoading(true);
                    try {
                        const { data } = await restaurantAPI.getOwnerRestaurants();
                        const list = Array.isArray(data) ? data : (data?.restaurants || []);
                        setOwnerRestaurants(list);
                        if (list.length > 0) {
                            setSelectedRestaurant(list[0]);
                            setRestForm({ name: list[0].name || '', cuisine: list[0].cuisine || '', image: list[0].image || '' });
                        }
                    } catch (err) {
                        console.error('Failed to load owner restaurants', err);
                        setOwnerError(err.response?.data?.message || err.message);
                    } finally {
                        setOwnerLoading(false);
                    }
                }
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
                    {user?.role === 'owner' && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">Your Restaurants</h3>
                            {ownerLoading ? (
                                <div>Loading restaurants...</div>
                            ) : ownerError ? (
                                <div className="text-red-600">{ownerError}</div>
                            ) : ownerRestaurants.length === 0 ? (
                                <div className="text-gray-500">You have no restaurants yet. Create one below or visit Owner Dashboard.</div>
                            ) : (
                                <div className="space-y-2 mb-4">
                                    {ownerRestaurants.map(r => (
                                        <button key={r._id || r.id} onClick={() => { setSelectedRestaurant(r); setRestForm({ name: r.name || '', cuisine: r.cuisine || '', image: r.image || '' }); }} className={`w-full text-left p-3 rounded-lg ${selectedRestaurant && (selectedRestaurant._id||selectedRestaurant.id) === (r._id||r.id) ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                                            <div className="font-medium">{r.name}</div>
                                            <div className="text-sm text-gray-500">{r.cuisine}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Edit/Create form for restaurant */}
                            <div className="p-4 border rounded">
                                <h4 className="font-semibold mb-2">{selectedRestaurant ? 'Edit Restaurant' : 'Create Restaurant'}</h4>
                                <input value={restForm.name} onChange={e => setRestForm({...restForm, name: e.target.value})} placeholder="Name" className="w-full p-2 mb-2 border rounded" />
                                <input value={restForm.cuisine} onChange={e => setRestForm({...restForm, cuisine: e.target.value})} placeholder="Cuisine" className="w-full p-2 mb-2 border rounded" />
                                <input value={restForm.image} onChange={e => setRestForm({...restForm, image: e.target.value})} placeholder="Image URL" className="w-full p-2 mb-2 border rounded" />
                                <div className="flex gap-2">
                                    {selectedRestaurant ? (
                                        <button onClick={async () => {
                                            try {
                                                await restaurantAPI.updateRestaurant(selectedRestaurant._id || selectedRestaurant.id, restForm);
                                                // refresh
                                                const { data } = await restaurantAPI.getOwnerRestaurants();
                                                const list = Array.isArray(data) ? data : (data?.restaurants || []);
                                                setOwnerRestaurants(list);
                                                setSelectedRestaurant(list.find(x => String(x._id||x.id) === String(selectedRestaurant._id||selectedRestaurant.id)) || null);
                                            } catch (err) { console.error(err); }
                                        }} className="px-4 py-2 bg-primary-600 text-white rounded-xl">Save</button>
                                    ) : (
                                        <button onClick={async () => {
                                            try {
                                                const { data } = await restaurantAPI.createRestaurant(restForm);
                                                const { data: listData } = await restaurantAPI.getOwnerRestaurants();
                                                const list = Array.isArray(listData) ? listData : (listData?.restaurants || []);
                                                setOwnerRestaurants(list);
                                                if (list.length > 0) setSelectedRestaurant(list[0]);
                                                setRestForm({ name: '', cuisine: '', image: '' });
                                            } catch (err) { console.error(err); }
                                        }} className="px-4 py-2 bg-primary-600 text-white rounded-xl">Create</button>
                                    )}
                                    <button onClick={() => { setSelectedRestaurant(null); setRestForm({ name: '', cuisine: '', image: '' }); }} className="px-4 py-2 bg-gray-200 rounded-xl">Clear</button>
                                </div>
                            </div>
                        </div>
                    )}

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
