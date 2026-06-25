import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const ClientProfile = () => {
    const { user, login } = useAuth(); // login used to update context if needed, but manual state update is better
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '' // Optional password update
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/client/profile');
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phoneNumber: data.phoneNumber || '',
                    address: data.address || '',
                    password: ''
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            // Filter out empty password if not changing
            const dataToSend = { ...formData };
            if (!dataToSend.password) delete dataToSend.password;

            const { data } = await api.put('/client/profile', dataToSend);
            
            // Update local storage user data to reflect name changes immediately
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Force a reload to update context (or better, expose a 'updateUser' method in AuthContext)
            // For now, page reload works or simple UI feedback
             window.location.reload(); 

            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) return <MainLayout><div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div></MainLayout>;

    return (
    <MainLayout>
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto space-y-6"
            >
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <h1 className="text-3xl font-bold font-montserrat text-white">My Profile</h1>
                </div>
                
                <div className="bg-card-bg p-8 rounded-xl shadow-lg border border-slate-800">
                    {message && <div className="p-4 mb-6 bg-green-900/20 text-green-400 border border-green-800 rounded-lg text-sm font-medium">{message}</div>}
                    {error && <div className="p-4 mb-6 bg-red-900/20 text-red-400 border border-red-800 rounded-lg text-sm font-medium">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                            <input 
                                type="text" name="fullName" required 
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                                value={formData.fullName} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
                            <input 
                                type="email" name="email" disabled 
                                className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed"
                                value={formData.email}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
                            <input 
                                type="text" name="phoneNumber" 
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                                value={formData.phoneNumber} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Address</label>
                            <textarea 
                                name="address" rows="3" 
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                                value={formData.address} onChange={handleChange}
                            ></textarea>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-800 mt-6">
                             <h3 className="text-md font-bold text-white mb-2">Change Password</h3>
                             <p className="text-xs text-slate-500 mb-4 font-medium">Leave blank to keep current password</p>
                             <input 
                                type="password" name="password" placeholder="New Password"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.password} onChange={handleChange}
                            />
                        </div>

                        <div className="pt-6">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit" 
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:brightness-110"
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    </form>
                </div>
             </motion.div>
    </MainLayout>
    );
};

export default ClientProfile;
