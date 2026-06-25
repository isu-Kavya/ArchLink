import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password, role);
    
    if (result.success) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'architect') navigate('/architect/dashboard');
      else navigate('/client/dashboard');
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
        <div className="px-8 py-6 bg-slate-900 text-white border-b-4 border-accent">
          <h2 className="text-2xl font-bold font-montserrat">Welcome Back</h2>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">I am a...</label>
            <div className="grid grid-cols-3 gap-3">
              {['client', 'architect', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                    role === r
                      ? 'bg-accent text-black border-accent font-bold shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-accent hover:text-white'
                  } capitalize`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-accent to-yellow-400 hover:brightness-110 text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-accent/50"
          >
            Sign In
          </motion.button>
        </form>
      </motion.div>
    </MainLayout>
  );
};

export default Login;
