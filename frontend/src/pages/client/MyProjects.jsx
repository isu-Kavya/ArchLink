import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { Mail, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/my-projects');
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchProjects();
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
                <h1 className="text-3xl font-bold font-montserrat text-white">My Projects</h1>
            </div>

            <div className="bg-card-bg rounded-xl shadow-lg border border-slate-800 overflow-hidden">
                {loading ? (
                     <div className="p-8 text-center text-slate-400 font-medium">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-400 mb-4 font-medium text-lg">No projects found.</p>
                        <p className="text-accent font-semibold cursor-pointer hover:underline" onClick={() => window.location.href='/client/dashboard'}>Start by requesting one!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs tracking-wider">Project Title</th>
                                    <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs tracking-wider">Architect</th>
                                    <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs tracking-wider">Date Requested</th>
                                    <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs tracking-wider">Notifications</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {projects.map((project, index) => (
                                    <motion.tr 
                                        key={project._id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-5 font-bold text-white">{project.projectTitle}</td>
                                        <td className="px-6 py-5 text-slate-400">
                                            <div className="flex items-center space-x-3">
                                                {project.architectId?.profilePicture && project.architectId.profilePicture !== '/uploads/placeholder.jpg' ? (
                                                    <img 
                                                        src={`http://localhost:5000${project.architectId.profilePicture}`} 
                                                        alt={project.architectId.fullName} 
                                                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-700">
                                                        {project.architectId?.fullName?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                                <span className="font-medium">{project.architectId?.fullName || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${project.status === 'responded' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' : 
                                                  project.status === 'closed' ? 'bg-green-900/20 text-green-400 border border-green-800' : 
                                                  'bg-yellow-900/20 text-yellow-400 border border-yellow-800'}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {project.emailSent ? (
                                                <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-800 w-fit">
                                                    <Mail size={16} />
                                                    <span className="text-sm font-bold">Check Email</span>
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 text-sm italic">Waiting for response...</div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    </MainLayout>
  );
};

export default MyProjects;
