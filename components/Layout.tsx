
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Dna, 
  Utensils, 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck,
  Settings,
  Bell,
  Search,
  ShoppingCart,
  Lock,
  LogOut,
  ChevronDown,
  LogIn,
  LayoutGrid
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';
import { UserRole } from '../types';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState<string>('Guest');

  // Authentication & Role sync
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedName = localStorage.getItem('userName');
    
    if (!storedRole && location.pathname !== '/auth') {
      navigate('/auth');
    } else {
      setRole(storedRole);
      setUserName(storedName || 'John Doe');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setRole(null);
    navigate('/auth');
    setIsProfileOpen(false);
  };

  // If we are on the Auth page, render without layout
  if (location.pathname === '/auth') {
    return <div className="bg-slate-50 min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <CartDrawer />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 shrink-0 no-print">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
            VaricoCare
          </h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Hub</p>
            <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem to="/lab-analyzer" icon={<Dna size={20} />} label="AI Lab Analyzer" />
            <SidebarItem to="/exercises" icon={<Activity size={20} />} label="Recovery Exercises" />
            <SidebarItem to="/diet" icon={<Utensils size={20} />} label="Diet Guide" />
            <SidebarItem to="/shop" icon={<ShoppingBag size={20} />} label="Supplements Store" />
          </div>

          {role === UserRole.ADMIN && (
            <div className="mb-4 pt-4 border-t border-slate-50">
              <p className="px-4 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Admin Control</p>
              <SidebarItem to="/admin" icon={<Lock size={20} />} label="Admin Panel" />
            </div>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
          {role ? (
            <>
              <SidebarItem to="/profile" icon={<UserIcon size={20} />} label="My Profile" />
              <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-rose-500 hover:bg-rose-50 font-medium mt-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all font-medium"
            >
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20 shrink-0 no-print">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl w-96 max-md:hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search health records, tools..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Demo Role Display */}
            {role && (
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase max-md:hidden border ${role === UserRole.ADMIN ? 'bg-slate-900 border-slate-900 text-white' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                {role} Portal
              </div>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-3 rounded-2xl transition-all duration-300 group flex items-center gap-2 border ${
                totalItems > 0 
                  ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ShoppingCart size={22} className={totalItems > 0 ? 'animate-bounce-subtle' : ''} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-blue-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center px-1 shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            <button className="relative p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              {role ? (
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-4 border-l border-slate-100 group transition-all"
                >
                  <div className="text-right max-md:hidden">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{userName}</p>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${role === UserRole.ADMIN ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {role === UserRole.ADMIN ? 'Administrator' : 'Premium Member'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden ring-2 ring-white group-hover:ring-blue-100 transition-all">
                    <img src={`https://picsum.photos/100/100?random=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
                >
                  Sign In
                </button>
              )}

              {isProfileOpen && role && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/profile" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors">
                    <UserIcon size={18} /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors">
                    <Settings size={18} /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-sm transition-colors mt-1 border-t border-slate-50"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-8 max-md:p-4">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>

        {/* Mobile Navigation */}
        <nav className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 no-print">
           <Link to="/" className={`p-2 ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400'}`}><LayoutDashboard size={24} /></Link>
           <Link to="/exercises" className={`p-2 ${location.pathname === '/exercises' ? 'text-blue-600' : 'text-slate-400'}`}><Activity size={24} /></Link>
           <Link to="/lab-analyzer" className={`p-2 ${location.pathname === '/lab-analyzer' ? 'text-blue-600' : 'text-slate-400'}`}><Dna size={24} /></Link>
           <Link to="/shop" className={`p-2 ${location.pathname === '/shop' ? 'text-blue-600' : 'text-slate-400'}`}><ShoppingBag size={24} /></Link>
           <Link to="/profile" className={`p-2 ${location.pathname === '/profile' ? 'text-blue-600' : 'text-slate-400'}`}><UserIcon size={24} /></Link>
        </nav>
      </main>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
