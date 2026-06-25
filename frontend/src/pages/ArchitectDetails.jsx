import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Briefcase, Calendar, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArchitectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [architect, setArchitect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
      projectTitle: '',
      projectDescription: '',
      projectType: '',
      budgetRange: '',
      preferredCompletionDate: '',
      location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchArchitectDetails = async () => {
      try {
        const { data } = await api.get(`/client/architects/${id}`);
        setArchitect(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load architect details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArchitectDetails();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (user.role !== 'CLIENT') {
        alert('Only clients can book architects.');
        return;
    }
    setShowModal(true);
    setMessage('');
  };

  const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        projectTitle: '', projectDescription: '', projectType: '', 
        budgetRange: '', preferredCompletionDate: '', location: ''
      });
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setMessage('');
      
      try {
          await api.post('/projects/request', {
              ...formData,
              architectId: architect._id
          });
          setMessage('success');
          setTimeout(() => {
              handleCloseModal();
          }, 1500);
      } catch (error) {
          setMessage('error');
          console.error(error);
      } finally {
          setSubmitting(false);
      }
  };


  if (loading) return (
    <MainLayout>
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
    </MainLayout>
  );

  if (error || !architect) return (
    <MainLayout>
        <div className="text-center py-20 text-red-600 font-medium font-montserrat">
            {error || 'Architect not found'}
        </div>
    </MainLayout>
  );

  return (
    <MainLayout>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition-colors font-semibold">
                <ArrowLeft size={20} className="mr-2" /> Back to Architects
            </button>

            {/* Top Profile Header */}
            <div className="bg-card-bg rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                     {/* Abstract grid pattern opacity-20 */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                     
                     <div className="absolute -bottom-0 left-8">
                        {architect.profilePicture && architect.profilePicture !== '/uploads/placeholder.jpg' ? (
                            <img 
                                src={`http://localhost:5000${architect.profilePicture}`} 
                                alt={architect.fullName} 
                                className="w-40 h-40 rounded-full border-4 border-[#fff44e] object-cover shadow-md"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full border-4 border-[#fff44e] bg-slate-800 flex items-center justify-center text-slate-400 text-5xl font-bold shadow-md">
                                {architect.fullName.charAt(0)}
                            </div>
                        )}
                     </div>
                </div>
                <div className="pt-24 px-8 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-montserrat text-white">{architect.fullName}</h1>
                            <p className="text-lg text-accent font-medium font-montserrat">{architect.specialization || 'General Architect'}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><Briefcase size={16} className="text-slate-500" /> {architect.yearsOfExperience || 0} Years Exp</span>
                                <span className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${architect.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    {architect.availabilityStatus || 'Available'}
                                </span>
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBookClick}
                            className="px-8 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black rounded-xl hover:brightness-110 transition-all font-bold shadow-md hover:shadow-lg"
                        >
                            Book This Architect
                        </motion.button>
                    </div>
                </div>
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-card-bg px-8 pb-8 rounded-b-2xl">
                        <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Contact Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-slate-500 font-semibold text-xs uppercase tracking-wide">Email</span>
                                <span className="font-medium text-slate-300 text-base">{architect.email}</span>
                            </div>
                            {architect.phoneNumber && (
                                <div>
                                    <span className="block text-slate-500 font-semibold text-xs uppercase tracking-wide">Phone</span>
                                    <span className="font-medium text-slate-300 text-base">{architect.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio & Portfolio */}
            <div className="grid grid-cols-1 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-card-bg p-8 rounded-2xl shadow-lg border border-slate-800">
                        <h2 className="text-xl font-bold font-montserrat text-white mb-4 border-l-4 border-accent pl-3">About</h2>
                        <p className="text-slate-400 leading-relaxed whitespace-pre-line font-inter">
                            {architect.profileDescription || "This architect hasn't added a bio yet."}
                        </p>
                        {architect.portfolioLink && (
                             <div className="mt-6">
                                <a 
                                    href={architect.portfolioLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-accent hover:text-white hover:underline font-bold transition-colors"
                                >
                                    View Portfolio Website
                                </a>
                             </div>
                        )}
                    </div>

                    {/* Portfolio Gallery Section */}
                    {architect.portfolioProjects && architect.portfolioProjects.length > 0 && (
                        <div className="bg-card-bg p-8 rounded-2xl shadow-lg border border-slate-800">
                            <h2 className="text-xl font-bold font-montserrat text-white mb-6 border-l-4 border-accent pl-3">Portfolio Gallery</h2>
                            <div className="space-y-10">
                                {architect.portfolioProjects.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="font-bold text-slate-300 mb-4 text-lg font-montserrat">{project.title}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {project.images.map((img, imgIndex) => (
                                                <div 
                                                    key={imgIndex} 
                                                    className="aspect-square rounded-xl overflow-hidden bg-slate-900 cursor-pointer hover:shadow-xl transition-all transform hover:scale-[1.02]"
                                                    onClick={() => setLightboxImage(`http://localhost:5000${img}`)}
                                                >
                                                    <img 
                                                        src={`http://localhost:5000${img}`} 
                                                        alt={`${project.title} - ${imgIndex + 1}`} 
                                                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white hover:text-amber-400 transition-colors">
                        <X size={32} />
                    </button>
                    <img 
                        src={lightboxImage} 
                        alt="Portfolio Fullscreen" 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-slate-800"
                    />
                </div>
            )}

            {/* Booking Modal (Reused) */}
            <AnimatePresence>
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card-bg rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-800"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                            <h2 className="text-xl font-bold font-montserrat text-white">Request {architect.fullName}</h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            {message === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="text-green-400 text-6xl mb-4 animate-bounce">✓</div>
                                    <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Request Sent!</h3>
                                    <p className="text-slate-400">Your project request has been submitted successfully.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {message === 'error' && (
                                        <div className="md:col-span-2 p-4 bg-red-900/20 text-red-400 rounded-lg text-sm border border-red-800">
                                            Failed to submit request. Please try again.
                                        </div>
                                    )}
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Project Title</label>
                                        <input type="text" name="projectTitle" required value={formData.projectTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Project Type</label>
                                        <input type="text" name="projectType" placeholder="e.g. Residential" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Budget Range</label>
                                        <input type="text" name="budgetRange" placeholder="e.g. $50k - $100k" value={formData.budgetRange} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Preferred Completion</label>
                                        <input type="date" name="preferredCompletionDate" value={formData.preferredCompletionDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                                        <textarea name="projectDescription" rows="4" required value={formData.projectDescription} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-500"></textarea>
                                    </div>
                                    
                                    <div className="md:col-span-2 pt-6 flex gap-4">
                                        <button type="button" onClick={handleCloseModal} className="flex-1 py-3 border-2 border-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-1 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                            {submitting ? 'Sending...' : 'Send Request'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </motion.div>
    </MainLayout>
  );
};

export default ArchitectDetails;
