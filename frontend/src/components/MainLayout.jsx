import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, Home, User, Folder, LayoutDashboard, 
  LogOut, PlusCircle, Users 
} from 'lucide-react';

  const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-accent text-primary font-bold' 
          : 'text-slate-400 hover:text-accent hover:bg-slate-800'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-primary' : 'text-accent'} />
      <span>{label}</span>
    </Link>
  );
};

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-dark-bg font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-20 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-card-bg border-r border-slate-800 text-white transform transition-transform duration-200 ease-in-out z-30 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <Link to="/" className="text-2xl font-bold tracking-wider font-sans text-white hover:text-accent transition-colors" onClick={closeSidebar}>
            WellDrafted
          </Link>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem to="/" icon={Home} label="Home" onClick={closeSidebar} />
          
          {user && (
            <>
              {user.role === 'CLIENT' && (
                <>
                  <SidebarItem to="/client/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSidebar} />
                  <SidebarItem to="/client/projects" icon={Folder} label="My Projects" onClick={closeSidebar} />
                  <SidebarItem to="/client/profile" icon={User} label="Profile" onClick={closeSidebar} />
                </>
              )}
              {user.role === 'ARCHITECT' && (
                <>
                  <SidebarItem to="/architect/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSidebar} />
                  <SidebarItem to="/architect/requests" icon={Folder} label="Project Requests" onClick={closeSidebar} />
                  <SidebarItem to="/architect/profile" icon={User} label="Edit Profile" onClick={closeSidebar} />
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSidebar} />
                  <SidebarItem to="/admin/architects" icon={Users} label="Manage Architects" onClick={closeSidebar} />
                  <SidebarItem to="/admin/projects" icon={Folder} label="All Projects" onClick={closeSidebar} />
                </>
              )}
            </>
          )}

          {!user && (
            <>
              <SidebarItem to="/login" icon={User} label="Login" onClick={closeSidebar} />
              <SidebarItem to="/register" icon={PlusCircle} label="Register" onClick={closeSidebar} />
            </>
          )}
        </nav>

        {user && (
          <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-accent rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-dark-bg">
        {/* Navbar */}
        <header className="bg-card-bg border-b border-slate-800 shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 flex justify-end items-center">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-accent">
                  Guest
                </Link>
              )}
            </div>
          </div>
        </header>


        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-dark-bg p-6 text-white">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
