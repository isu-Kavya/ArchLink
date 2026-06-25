import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const ArchitectProfile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        yearsOfExperience: '',
        profileDescription: '',
        portfolioLink: '',
        availabilityStatus: 'Available',
        profilePicture: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Portfolio Form State
    const [portfolioTitle, setPortfolioTitle] = useState('');
    const [portfolioImages, setPortfolioImages] = useState([]);
    const [portfolioUploading, setPortfolioUploading] = useState(false);
    const [portfolioMessage, setPortfolioMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/architect/profile');
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phoneNumber: data.phoneNumber || '',
                    specialization: data.specialization || '',
                    yearsOfExperience: data.yearsOfExperience || '',
                    profileDescription: data.profileDescription || '',
                    portfolioLink: data.portfolioLink || '',
                    availabilityStatus: data.availabilityStatus || 'Available',
                    profilePicture: data.profilePicture || '',
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formDataObj, config);
            setFormData(prev => ({ ...prev, profilePicture: data }));
            setUploading(false);
        } catch (error) {
            console.error('File upload error:', error);
            setError('Failed to upload image');
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            const dataToSend = { ...formData };
            if (!dataToSend.password) delete dataToSend.password;

            const { data } = await api.put('/architect/profile', dataToSend);
            
            // Update local storage user data
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
             // Force a reload to update context
             window.location.reload(); 

            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    // Portfolio Handlers
    const handlePortfolioImagesChange = (e) => {
        setPortfolioImages(e.target.files);
    };

    const handlePortfolioSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioTitle || portfolioImages.length === 0) {
            setPortfolioMessage('Please provide a title and select images.');
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append('title', portfolioTitle);
        for (let i = 0; i < portfolioImages.length; i++) {
            formDataObj.append('images', portfolioImages[i]);
        }

        setPortfolioUploading(true);
        setPortfolioMessage('');

        try {
            const config = {
                 headers: { 'Content-Type': 'multipart/form-data' }
            };
            await api.post('/architect/portfolio/upload', formDataObj, config);
            setPortfolioMessage('Project uploaded successfully!');
            setPortfolioTitle('');
            setPortfolioImages([]);
            // Ideally fetch updated portfolio list here, but reloading page works for MVP
        } catch (error) {
            console.error(error);
            setPortfolioMessage('Failed to upload project.');
        } finally {
            setPortfolioUploading(false);
        }
    };


    if (loading) return <MainLayout><div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div></MainLayout>;

    return (
    <MainLayout>
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto space-y-8"
            >
                <h1 className="text-3xl font-bold font-montserrat text-white border-b-2 border-accent pb-2 inline-block">Edit Profile</h1>
                
                <div className="bg-card-bg p-8 rounded-xl shadow-lg border border-slate-800">
                    {message && <div className="p-4 mb-6 bg-green-900/20 text-green-400 border border-green-800 rounded-lg text-sm font-medium">{message}</div>}
                    {error && <div className="p-4 mb-6 bg-red-900/20 text-red-400 border border-red-800 rounded-lg text-sm font-medium">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 flex items-center space-x-8 border-b border-slate-800 pb-8 mb-4">
                             <div className="h-32 w-32 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border-4 border-accent shadow-md">
                                {formData.profilePicture && formData.profilePicture !== '/uploads/placeholder.jpg' ? (
                                    <img 
                                        src={`http://localhost:5000${formData.profilePicture}`} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                     <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold text-4xl bg-slate-900">
                                         {formData.fullName.charAt(0)}
                                     </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Profile Picture</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-400
                                        file:mr-4 file:py-2.5 file:px-6
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-bold
                                        file:bg-slate-800 file:text-white
                                        hover:file:bg-slate-700
                                        cursor-pointer
                                    "
                                />
                                {uploading && <p className="text-xs text-accent mt-2 font-medium animate-pulse">Uploading...</p>}
                            </div>
                        </div>

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
                        
                        <div className="md:col-span-2">
                             <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-4 mt-4">Professional Info</h3>
                        </div>

                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Specialization</label>
                            <input 
                                type="text" name="specialization" placeholder="e.g. Modern Residential"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.specialization} onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Years of Experience</label>
                            <input 
                                type="number" name="yearsOfExperience" 
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                                value={formData.yearsOfExperience} onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Portfolio Link</label>
                            <input 
                                type="url" name="portfolioLink" placeholder="https://"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.portfolioLink} onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Availability</label>
                            <select 
                                name="availabilityStatus"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                                value={formData.availabilityStatus} onChange={handleChange}
                            >
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Bio / Description</label>
                            <textarea 
                                name="profileDescription" rows="4" 
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.profileDescription} onChange={handleChange}
                            ></textarea>
                        </div>
                        
                        <div className="md:col-span-2 pt-6 border-t border-slate-800 mt-4">
                             <h3 className="text-md font-bold text-white mb-4">Change Password</h3>
                             <input 
                                type="password" name="password" placeholder="New Password (optional)"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                value={formData.password} onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2 pt-6">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit" 
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-accent to-yellow-400 hover:brightness-110 text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                            >
                                Save Profile
                            </motion.button>
                        </div>
                    </form>
                </div>

                {/* Manage Portfolio Section */}
                <div className="bg-card-bg p-8 rounded-xl shadow-lg border border-slate-800">
                    <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-accent pl-4">Manage Portfolio</h2>
                    <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                         {portfolioMessage && (
                            <div className={`p-4 rounded-lg text-sm font-medium ${portfolioMessage.includes('success') ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-blue-900/20 text-blue-400 border border-blue-800'}`}>
                                {portfolioMessage}
                            </div>
                         )}
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Project Title</label>
                            <input 
                                type="text" 
                                value={portfolioTitle}
                                onChange={(e) => setPortfolioTitle(e.target.value)}
                                placeholder="e.g. Minimalist Villa"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-300 mb-2">Upload Images (Max 5)</label>
                             <input 
                                type="file" 
                                multiple
                                accept="image/*"
                                onChange={handlePortfolioImagesChange}
                                className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2.5 file:px-6
                                file:rounded-lg file:border-0
                                file:text-sm file:font-bold
                                file:bg-slate-800 file:text-white
                                hover:file:bg-slate-700
                                cursor-pointer border border-slate-700 rounded-lg"
                            />
                        </div>
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit" 
                            disabled={portfolioUploading}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-accent font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {portfolioUploading ? 'Uploading...' : 'Add to Portfolio'}
                        </motion.button>
                    </form>
                </div>
             </motion.div>
    </MainLayout>
    );
};

export default ArchitectProfile;
