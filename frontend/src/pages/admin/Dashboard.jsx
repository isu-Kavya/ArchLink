import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalArchitects: 0,
        totalClients: 0,
        totalProjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-bold font-montserrat text-white">Admin Dashboard</h1>
        </div>
        
        {loading ? (
             <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-card-bg rounded-xl shadow-md border-b-4 border-accent hover:shadow-lg transition-all border border-slate-800"
                >
                    <h3 className="text-xs font-bold font-montserrat text-slate-400 mb-2 uppercase tracking-widest">Total Users</h3>
                    <p className="text-4xl font-black text-white font-montserrat">{stats.totalUsers}</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-slate-800 rounded-xl shadow-md border-b-4 border-accent hover:shadow-lg transition-all border border-slate-700"
                >
                    <h3 className="text-xs font-bold font-montserrat text-slate-400 mb-2 uppercase tracking-widest">Architects</h3>
                    <p className="text-4xl font-black text-white font-montserrat">{stats.totalArchitects}</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-card-bg rounded-xl shadow-md border-b-4 border-slate-600 hover:shadow-lg transition-all border border-slate-800"
                >
                    <h3 className="text-xs font-bold font-montserrat text-slate-400 mb-2 uppercase tracking-widest">Clients</h3>
                    <p className="text-4xl font-black text-white font-montserrat">{stats.totalClients}</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-accent rounded-xl shadow-md border-b-4 border-white hover:shadow-lg transition-all"
                >
                    <h3 className="text-xs font-bold font-montserrat text-zinc-800 mb-2 uppercase tracking-widest">Projects</h3>
                    <p className="text-4xl font-black text-zinc-900 font-montserrat">{stats.totalProjects}</p>
                </motion.div>
            </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;
