import { useEffect, useState } from 'react';
import { restaurantAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [selected, setSelected] = useState(null);
    const [menu, setMenu] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', category: '', image: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const { data } = await restaurantAPI.getOwnerRestaurants();
                const list = Array.isArray(data) ? data : (data?.restaurants || []);
                if (!Array.isArray(list)) {
                    console.error('Unexpected owner restaurants response', data);
                }
                setRestaurants(list);
                if (list.length > 0) {
                    setSelected(list[0]);
                }
            } catch (err) {
                console.error('Failed to load owner restaurants', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    useEffect(() => {
        if (!selected) return;
        const fetchMenu = async () => {
            try {
                const { data } = await restaurantAPI.getMenu(selected._id || selected.id);
                setMenu(data);
            } catch (err) {
                console.error('Failed to load menu', err);
            }
        };
        fetchMenu();
    }, [selected]);

    const handleCreate = async () => {
        if (!selected) return;
        try {
            const payload = { ...form, price: Number(form.price) };
            await restaurantAPI.createMenuItem(selected._id || selected.id, payload);
            const { data } = await restaurantAPI.getMenu(selected._id || selected.id);
            setMenu(data);
            setForm({ name: '', price: '', category: '', image: '' });
        } catch (err) {
            console.error('Create failed', err);
        }
    };

    const handleDelete = async (menuId) => {
        try {
            await restaurantAPI.deleteMenuItem(selected._id || selected.id, menuId);
            setMenu(prev => prev.filter(m => (m._id || m.id) !== menuId));
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
                <div className="flex gap-6">
                    <div className="w-1/3 bg-white p-4 rounded-2xl shadow-sm">
                        <h3 className="font-semibold mb-3">Your Restaurants</h3>
                        <div className="space-y-2">
                            {restaurants.map(r => (
                                <button key={r._id || r.id} onClick={() => setSelected(r)} className={`w-full text-left p-3 rounded-lg ${selected && (selected._id||selected.id) === (r._id||r.id) ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                                    <div className="font-medium">{r.name}</div>
                                    <div className="text-sm text-gray-500">{r.cuisine}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{selected?.name || 'Select a restaurant'}</h3>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Add Menu Item</h4>
                            <div className="grid grid-cols-4 gap-2">
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="p-2 border rounded" />
                                <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" className="p-2 border rounded" />
                                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="p-2 border rounded" />
                                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Image URL" className="p-2 border rounded" />
                            </div>
                            <button onClick={handleCreate} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-xl">Add Item</button>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Menu Items</h4>
                            {menu.length === 0 ? (
                                <div className="text-gray-500">No menu items yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {menu.map(item => (
                                        <div key={item._id || item.id} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.category} • ${item.price.toFixed(2)}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(item))} className="px-3 py-1 bg-gray-100 rounded">Copy</button>
                                                <button onClick={() => handleDelete(item._id || item.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
