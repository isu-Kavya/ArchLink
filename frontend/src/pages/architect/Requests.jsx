import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { Check, Mail } from 'lucide-react';
import api from '../../utils/api';
import { motion } from 'framer-motion';

const ProjectRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/projects/architect-requests');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAcceptRequest = async (id) => {
        if (!window.confirm('Accept this project request? This will change status to Responded.')) return;
        
        try {
            await api.patch(`/projects/${id}/respond`, { status: 'responded' });
            // Re-fetch to update state
            fetchRequests();
            
            // Dispatch custom event to notify Dashboard stats
            window.dispatchEvent(new Event('projectStatusUpdated'));
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request');
        }
    };

    const handleMarkCompleted = async (id) => {
        if (!window.confirm('Mark this project as closed/email sent?')) return;
        
        try {
            await api.patch(`/projects/${id}/respond`, { status: 'closed' });
            // Re-fetch to update state
            fetchRequests();
            
            // Dispatch custom event to notify Dashboard stats
            window.dispatchEvent(new Event('projectStatusUpdated'));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

  return (
    <MainLayout>
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-bold font-montserrat text-white">Project Requests</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No pending requests.</div>
                ) : (
                    requests.map((request, index) => (
                        <motion.div 
                            key={request._id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card-bg rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white">{request.projectTitle}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase
                                        ${request.status === 'responded' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : 
                                          request.status === 'closed' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                          'bg-yellow-900/20 text-yellow-400 border-yellow-800'}
                                    `}>
                                        {request.status}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    <span className="font-semibold text-slate-300">Client:</span> {request.clientId?.fullName} 
                                    <a href={`mailto:${request.clientId?.email}`} className="text-accent hover:underline ml-1">
                                        ({request.clientId?.email})
                                    </a>
                                </p>
                                <p className="text-slate-400 text-sm">
                                    <span className="font-semibold text-slate-300">Budget:</span> {request.budgetRange}
                                </p>
                                <div className="p-4 bg-slate-900/50 rounded-lg text-slate-300 text-sm leading-relaxed border border-slate-800">
                                    {request.projectDescription}
                                </div>
                            </div>
                            
                            <div className="flex md:flex-col justify-end gap-3 min-w-[200px]">
                                {request.status === 'pending' && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleAcceptRequest(request._id)}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
                                    >
                                        <Check size={18} />
                                        <span>Accept Request</span>
                                    </motion.button>
                                )}

                                {request.status === 'responded' && (
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center space-x-2 p-3 bg-slate-900 rounded-lg border border-slate-800"
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={request.emailSent} 
                                            onChange={() => !request.emailSent && handleMarkCompleted(request._id)}
                                            disabled={request.emailSent}
                                            className="w-5 h-5 text-accent rounded focus:ring-accent bg-slate-800 border-slate-600 disabled:opacity-50"
                                            id={`check-${request._id}`}
                                        />
                                        <label htmlFor={`check-${request._id}`} className={`text-sm font-medium ${request.emailSent ? 'text-green-400' : 'text-slate-300 cursor-pointer'}`}>
                                            {request.emailSent ? 'Email Sent to Client' : 'Mark Response Sent'}
                                        </label>
                                    </motion.div>
                                )}
                                
                                {request.status === 'closed' && (
                                    <div className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-900/20 border border-green-800 text-green-400 font-bold rounded-lg">
                                        <Check size={18} />
                                        <span>Completed</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    </MainLayout>
  );
};

export default ProjectRequests;
