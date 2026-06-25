import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const { registerClient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await registerClient(formData);
    
    if (result.success) {
      navigate('/client/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-card-bg rounded-xl shadow-lg border border-slate-800 overflow-hidden mt-10"
      >
        <div className="px-8 py-6 bg-slate-900/50 text-white border-b-4 border-accent">
          <h2 className="text-2xl font-bold font-montserrat">Join WellDrafted</h2>
          <p className="text-slate-400 mt-1">Create your client account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
            <textarea
              name="address"
              rows="2"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-accent to-yellow-400 hover:brightness-110 text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-accent/50"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </MainLayout>
  );
};

export default Register;
