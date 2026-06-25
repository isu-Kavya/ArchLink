import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const ArchitectDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        active: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/projects/architect-requests');
                
                const pending = data.filter(p => p.status?.toLowerCase() === 'pending').length;
                const active = data.filter(p => p.status?.toLowerCase() === 'responded').length;
                const completed = data.filter(p => p.status?.toLowerCase() === 'closed').length;

                setStats({ pending, active, completed });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        // Listen for the custom event dispatched from ArchitectRequests
        const handleStatsUpdate = () => {
            fetchRequests(); 
        };

        window.addEventListener('projectStatusUpdated', handleStatsUpdate);
        
        fetchRequests();

        return () => {
            window.removeEventListener('projectStatusUpdated', handleStatsUpdate);
        };
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
            <h1 className="text-3xl font-bold font-montserrat text-white">Architect Dashboard</h1>
        </div>
        
        {loading ? (
             <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-card-bg rounded-xl shadow-md border-l-4 border-accent border-y border-r border-slate-800"
                >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Pending Requests</h3>
                    <p className="text-5xl font-bold text-white font-montserrat">{stats.pending}</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-card-bg rounded-xl shadow-md border-l-4 border-blue-500 border-y border-r border-slate-800"
                >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Active Projects</h3>
                    <p className="text-5xl font-bold text-white font-montserrat">{stats.active}</p>
                </motion.div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-slate-800/50 rounded-xl shadow-md border-l-4 border-green-500 border-y border-r border-slate-800"
                >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Completed</h3>
                    <p className="text-5xl font-bold text-white font-montserrat">{stats.completed}</p>
                </motion.div>
            </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default ArchitectDashboard;
