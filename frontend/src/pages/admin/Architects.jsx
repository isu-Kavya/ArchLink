import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ManageArchitects = () => {
    const [architects, setArchitects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', role: 'ARCHITECT'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchArchitects();
    }, []);

    const fetchArchitects = async () => {
        try {
            const { data } = await api.get('/admin/architects');
            // Ensure data maps to expected structure and add default status
            setArchitects(data.map(arch => ({...arch, status: arch.availabilityStatus || 'Active'})));
        } catch (error) {
            console.error('Error fetching architects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if(window.confirm('Are you sure you want to remove this architect?')) {
            try {
                await api.delete(`/admin/architects/${id}`);
                setArchitects(prev => prev.filter(arch => arch._id !== id));
            } catch (error) {
                console.error('Error removing architect:', error);
                alert('Failed to remove architect');
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/admin/register-architect', formData);
            setArchitects([...architects, { ...data, status: 'Active' }]); // Optimistic add or use returned data
            setShowForm(false);
            setFormData({ fullName: '', email: '', password: '', role: 'ARCHITECT' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create architect');
        }
    };

  return (
    <MainLayout>
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-bold font-montserrat text-white">Manage Architects</h1>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="py-2 px-4 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                    {showForm ? 'Cancel' : 'Add New Architect'}
                </motion.button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-card-bg p-6 rounded-xl shadow-md border border-slate-800 overflow-hidden"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Register New Architect</h2>
                        {error && <div className="p-3 mb-4 bg-red-900/20 text-red-400 border border-red-800 rounded-lg text-sm">{error}</div>}
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" placeholder="Full Name" required
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                             <input 
                                type="email" placeholder="Username" required
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                             <input 
                                type="password" placeholder="Password" required
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit" 
                                className="md:col-span-2 py-3 px-4 bg-accent text-primary font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:brightness-110"
                            >
                                Create Account
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card-bg rounded-xl shadow-sm border border-slate-800 overflow-hidden"
            >
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading architects...</div>
                ) : architects.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No architects found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-white border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-300">Email</th>
                                    <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {architects.map((arch, index) => (
                                    <motion.tr 
                                        key={arch._id} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">{arch.fullName}</td>
                                        <td className="px-6 py-4 text-slate-400">{arch.email}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${
                                                arch.status === 'Active' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>{arch.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemove(arch._id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                            >
                                                Remove
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    </MainLayout>
  );
};

export default ManageArchitects;
