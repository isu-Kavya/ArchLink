import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import api from '../../utils/api'; 
import { motion } from 'framer-motion';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [architects, setArchitects] = useState([]);
  const [formData, setFormData] = useState({
      architectId: '',
      projectTitle: '',
      projectDescription: '',
      projectType: '',
      budgetRange: '',
      preferredCompletionDate: '',
      location: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
      const fetchArchitects = async () => {
          try {
              const { data } = await api.get('/client/architects');
              setArchitects(data);
          } catch (error) {
              console.error('Error fetching architects:', error);
          }
      };
      fetchArchitects();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
          await api.post('/projects/request', formData);
          setMessage('Project request submitted successfully!');
          setFormData({
            architectId: '',
            projectTitle: '',
            projectDescription: '',
            projectType: '',
            budgetRange: '',
            preferredCompletionDate: '',
            location: ''
          });
      } catch (error) {
          setMessage('Error submitting request. Please try again.');
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-bold font-montserrat text-white">Client Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card-bg p-6 rounded-xl shadow-md border border-slate-800 h-fit">
            <h2 className="text-xl font-bold mb-4 font-montserrat text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 border border-slate-700 hover:border-accent transition-all shadow-sm"
              >
                Find an Architect
              </button>
              <button 
                onClick={() => navigate('/client/projects')}
                className="w-full py-3 px-4 bg-transparent border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-accent hover:text-accent transition-all shadow-sm"
              >
                View My Projects
              </button>
            </div>
          </div>

           <div className="bg-card-bg p-8 rounded-xl shadow-lg border border-slate-800 md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 font-montserrat text-white border-l-4 border-accent pl-4">Start a New Project</h2>
            {message && (
                <div className={`p-4 mb-6 text-sm rounded-lg border ${message.includes('success') ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Select Architect</label>
                    <select 
                        name="architectId" 
                        required 
                        value={formData.architectId} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white"
                    >
                        <option value="">Choose an architect...</option>
                        {architects.map(arch => (
                            <option key={arch._id} value={arch._id}>{arch.fullName} — {arch.specialization}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Project Title</label>
                    <input type="text" name="projectTitle" required value={formData.projectTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Project Type</label>
                    <input type="text" name="projectType" placeholder="e.g. Residential, Commercial" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Budget Range</label>
                    <input type="text" name="budgetRange" placeholder="e.g. $50k - $100k" value={formData.budgetRange} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Preferred Completion Time</label>
                    <input type="date" name="preferredCompletionDate" value={formData.preferredCompletionDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                    <textarea name="projectDescription" rows="4" required value={formData.projectDescription} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"></textarea>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    disabled={loading} 
                    className="md:col-span-2 py-4 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold text-lg rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {loading ? 'Submitting Request...' : 'Submit Project Request'}
                </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ClientDashboard;
