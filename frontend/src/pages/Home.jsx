import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Modal Form State
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

  // About Modal State
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Scroll to top visibility & Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate initial loading progress
  useEffect(() => {
      const timer = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(timer);
                  return 100;
              }
              return prev + 10;
          });
      }, 100);
      return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const { data } = await api.get('/client/architects');
        setArchitects(data);
      } catch (error) {
        console.error('Error fetching architects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchitects();
  }, []);

  const handleBookClick = (architect) => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (user.role !== 'CLIENT') {
        alert('Only clients can book architects.');
        return;
    }
    setSelectedArchitect(architect);
    setMessage('');
  };

  const handleCloseModal = () => {
      setSelectedArchitect(null);
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
              architectId: selectedArchitect._id
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-dark-bg flex flex-col font-sans text-white"
    >
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Initial Load Progress Bar (disappears after load) */}
      <AnimatePresence>
        {progress < 100 && (
            <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 h-1 bg-accent z-[60] transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        )}
      </AnimatePresence>

      {/* Navbar Overlay */}
      <nav className="absolute top-0 w-full z-20 px-6 py-6 md:px-12 flex justify-between items-center text-primary glass-nav fixed">
        <Link to="/" className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform text-white">WellDrafted</Link>
        <div className="flex gap-6 text-sm font-medium tracking-wide text-white">
          <Link to="/" className="hover:text-accent transition-colors relative group">
              HOME
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          {user ? (
             user.role === 'CLIENT' ? (
                <>
                    <Link to="/client/dashboard" className="hover:text-accent transition-colors hover:scale-105 inline-block">DASHBOARD</Link>
                    <Link to="/client/projects" className="hover:text-accent transition-colors hover:scale-105 inline-block">MY PROJECTS</Link>
                    <Link to="/client/profile" className="hover:text-accent transition-colors hover:scale-105 inline-block">PROFILE</Link>
                </>
             ) : user.role === 'ARCHITECT' ? (
                <>
                    <Link to="/architect/dashboard" className="hover:text-accent transition-colors hover:scale-105 inline-block">DASHBOARD</Link>
                    <Link to="/architect/requests" className="hover:text-accent transition-colors hover:scale-105 inline-block">REQUESTS</Link>
                    <Link to="/architect/profile" className="hover:text-accent transition-colors hover:scale-105 inline-block">PROFILE</Link>
                </>
             ) : (
                <Link to="/admin/dashboard" className="hover:text-accent transition-colors hover:scale-105 inline-block">DASHBOARD</Link>
             )
          ) : (
             <>
                <Link to="/login" className="hover:text-accent transition-colors hover:scale-105 inline-block">LOGIN</Link>
                <Link to="/register" className="hover:text-accent transition-colors hover:scale-105 inline-block">REGISTER</Link>
             </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[70vh] md:h-screen flex items-center justify-center text-center px-4 overflow-hidden">
         <div className="absolute inset-0 z-0">
             <img 
                src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*yhXdKuAGtm6iRDl2mZ6Erg.jpeg" 
                alt="Architecture Hero" 
                className="w-full h-full object-cover object-center"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40 mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-dark-bg/40"></div>
         </div>
         
         <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block text-accent text-sm tracking-[0.3em] font-medium uppercase mb-4"
            >
              Established 2011
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-2"
            >
               WellDrafted
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed"
            >
               "If you can dream it, we can architect it."
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-8"
            >
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const el = document.getElementById('featured-architects');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,244,78,0.4)] hover:shadow-[0_0_30px_rgba(255,244,78,0.6)] transition-all animate-bounce"
                >
                    Explore Architects
                </motion.button>
            </motion.div>
         </div>
      </header>

      {/* About Us Section */}
      <section className="py-24 px-6 md:px-12 bg-card-bg text-white">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 animate-float-subtle"
            >
                <h2 className="text-4xl font-bold text-white">About Us</h2>
                <div className="h-1 w-20 bg-accent"></div>
                <p className="text-lg text-secondary leading-loose">
                    The architectural firm has successfully completed various architectural design projects for Holiday homes, hotels & leisure, commercial projects, residential buildings & residential apartments.
                </p>
                <p className="text-lg text-secondary leading-loose">
                    They enjoy reputation as a trusted architecture and design house among their national and international clients, thanks to their industry expertise.
                </p>
                <div className="pt-4">
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAboutModal(true)}
                        className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors rounded-xl shadow-lg"
                     >
                        READ MORE
                     </motion.button>
                </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] bg-slate-900 hidden md:block rounded-xl overflow-hidden shadow-2xl animate-float-subtle"
              style={{ animationDelay: '1s' }}
            >
                 <img 
                    src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop" 
                    alt="Architectural Drawing" 
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700 opacity-80 hover:opacity-100"
                 />
            </motion.div>
         </div>
      </section>

      {/* Featured Architects Section */}
      <section id="featured-architects" className="py-24 px-6 md:px-12 bg-dark-bg border-t border-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
           <motion.div 
             initial={{ x: -50, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="text-center mb-16"
           >
              <span className="text-accent uppercase tracking-widest text-sm font-bold bg-slate-900 px-2 py-1 rounded">Our Team</span>
              <h2 className="text-4xl font-bold text-white mt-3">Featured Architects</h2>
           </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {architects.map((arch, index) => (
                <motion.div 
                  key={arch._id} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                  className="bg-card-bg rounded-xl overflow-hidden shadow-md border border-slate-800"
                >
                  <div className="h-64 overflow-hidden relative bg-slate-800 group">
                    {arch.profilePicture && arch.profilePicture !== '/uploads/placeholder.jpg' ? (
                      <img 
                        src={`http://localhost:5000${arch.profilePicture}`} 
                        alt={arch.fullName} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-5xl bg-slate-900">
                        {arch.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 text-center">
                    <motion.h3 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                        className="text-2xl font-bold text-white mb-2"
                    >
                        {arch.fullName}
                    </motion.h3>
                    <p className="text-accent font-bold text-sm uppercase tracking-wide mb-4">{arch.specialization}</p>
                    <p className="text-secondary leading-relaxed mb-6 line-clamp-2">
                       {arch.profileDescription || "Expert architect ready to bring your vision to life."}
                    </p>
                    <div className="flex justify-center gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/architect/${arch._id}`)}
                            className="px-6 py-2 border-2 border-slate-700 text-slate-300 text-sm font-bold rounded-lg hover:border-accent hover:bg-accent hover:text-black transition-all"
                        >
                            PROFILE
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBookClick(arch)}
                            className="px-6 py-2 bg-gradient-to-r from-accent to-yellow-400 text-black text-sm font-bold border-none rounded-lg hover:brightness-110 transition-all shadow-md"
                        >
                            BOOK
                        </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg text-secondary py-16 px-6 md:px-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-3xl font-bold text-white mb-6">WellDrafted</h2>
                <p className="max-w-md leading-relaxed mb-6">
                    A premier architectural firm dedicated to creating spaces that inspire, function, and endure. We bridge the gap between imagination and reality.
                </p>
            </div>
            <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Navigation</h3>
                <ul className="space-y-4">
                    <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                    <li><Link to="/login" className="hover:text-accent transition-colors">Login</Link></li>
                    <li><Link to="/register" className="hover:text-accent transition-colors">Register</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact</h3>
                <ul className="space-y-4">
                    <li>45/6, Kinross Rd, Colombo 04</li>
                    <li>contact@welldrafted.com</li>
                    <li>0112763584</li>
                </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2026 WellDrafted Architectural Firm. All Rights Reserved.</p>
         </div>
      </footer>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-accent text-black p-3 rounded-full shadow-lg hover:brightness-110 transition-all z-50"
        >
            <ArrowUp size={24} />
        </motion.button>
      )}

      {/* About Modal */}
      <AnimatePresence>
      {showAboutModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card-bg rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-t-4 border-accent text-white"
              >
                  <button 
                    onClick={() => setShowAboutModal(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors hover:rotate-90 duration-300"
                  >
                      <X size={24} />
                  </button>
                  
                  <div className="p-12">
                      <h2 className="text-3xl font-bold text-white mb-8">Our Philosophy</h2>
                      <div className="space-y-6 text-secondary leading-loose text-lg">
                          <p>
                              Architecture is an art which in combination of art and science, architects exercise by creative spaces. As a matured architects even with different angle of experience, we believe creativity is the key to success. We adopt a logical approach to all the aspects of the project from the stage of its inception till the end. And throughout the project, our aim is to keep the same tempo with the client.
                          </p>
                          <p>
                              <strong className="text-white block mb-2">Scope of the service:</strong>
                              We connect architectures with you. We provide both architectural and consortium services as the projects and client's needs vary. In addition we have a pool of allied professionals from whom we choose as appropriate for the context and scale of Architectural, Interior designing, Landscaping, and other services like Structural engineering, Water supply and drainage, Quantity surveying and Project management etc..
                          </p>
                      </div>
                      <div className="mt-10 pt-8 border-t border-slate-700 flex justify-end">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAboutModal(false)}
                            className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm rounded-lg"
                          >
                              Close
                          </motion.button>
                      </div>
                  </div>
              </motion.div>
          </div>
      )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
      {selectedArchitect && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card-bg rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white border-t-4 border-accent"
              >
                  <div className="flex items-center justify-between p-8 border-b border-slate-800">
                      <h2 className="text-2xl font-bold text-white">Request {selectedArchitect.fullName}</h2>
                      <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors hover:rotate-90 duration-300">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-8">
                      {message === 'success' ? (
                          <div className="text-center py-12">
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="text-accent text-6xl mb-6 inline-block"
                              >
                                ✓
                              </motion.div>
                              <h3 className="text-2xl font-bold text-white mb-2">Request Sent Successfully</h3>
                              <p className="text-secondary">We will review your project and get back to you shortly.</p>
                          </div>
                      ) : (
                          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {message === 'error' && (
                                  <div className="md:col-span-2 p-4 bg-red-900/20 text-red-400 border border-red-900 text-sm rounded-lg">
                                      Failed to submit request. Please try again.
                                  </div>
                              )}
                              
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Title</label>
                                  <input type="text" name="projectTitle" required value={formData.projectTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Type</label>
                                  <input type="text" name="projectType" placeholder="e.g. Residential" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Range</label>
                                  <input type="text" name="budgetRange" placeholder="e.g. $50k - $100k" value={formData.budgetRange} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Completion</label>
                                  <input type="date" name="preferredCompletionDate" value={formData.preferredCompletionDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all dark-date-input" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600" />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                  <textarea name="projectDescription" rows="4" required value={formData.projectDescription} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-slate-600"></textarea>
                              </div>
                              
                              <div className="md:col-span-2 pt-6 flex gap-4">
                                  <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button" 
                                    onClick={handleCloseModal} 
                                    className="flex-1 py-4 border border-slate-700 text-slate-300 font-bold tracking-wider rounded-lg hover:bg-slate-800 transition-colors uppercase text-sm"
                                  >
                                      Cancel
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    disabled={submitting} 
                                    className="flex-1 py-4 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold tracking-wider rounded-lg hover:brightness-110 transition-colors uppercase text-sm disabled:opacity-70"
                                  >
                                      {submitting ? 'Sending...' : 'Send Request'}
                                  </motion.button>
                              </div>
                          </form>
                      )}
                  </div>
              </motion.div>
          </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
