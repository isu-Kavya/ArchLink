import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const AllProjects = () => {
     const [projects, setProjects] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects/all');
                setProjects(data);
            } catch (error) {
                console.error('Error fetching all projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
     }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-bold font-montserrat text-white">All Projects</h1>
        </div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card-bg rounded-xl shadow-sm border border-slate-800 overflow-hidden"
        >
            {loading ? (
                <div className="p-8 text-center text-slate-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No projects found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-white border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-300">Project Title</th>
                                <th className="px-6 py-4 font-semibold text-slate-300">Client</th>
                                <th className="px-6 py-4 font-semibold text-slate-300">Architect</th>
                                <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {projects.map((proj, index) => (
                                <motion.tr 
                                    key={proj._id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-white">{proj.projectTitle}</td>
                                    <td className="px-6 py-4 text-slate-400">{proj.clientId?.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-400">{proj.architectId?.fullName || 'Unassigned'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border uppercase
                                            ${proj.status === 'responded' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : 
                                              proj.status === 'closed' ? 'bg-green-900/20 text-green-400 border-green-800' : 
                                              'bg-yellow-900/20 text-yellow-400 border-yellow-800'}`}>
                                            {proj.status}
                                        </span>
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

export default AllProjects;
