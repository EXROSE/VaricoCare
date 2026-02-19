
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, UserCircle, BriefcaseMedical, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [portalType, setPortalType] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Reset errors when switching between login/signup or portals
  useEffect(() => {
    setError(null);
  }, [isLogin, portalType]);

  const validateForm = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin && name.trim().length < 2) {
      setError('Please enter your full name.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call and role assignment
    setTimeout(() => {
      setIsLoading(false);
      
      // Authentication Logic
      if (isLogin) {
        if (portalType === UserRole.ADMIN) {
          // Specific Admin Credential Check
          const isValidAdmin = (email === 'admin@gmail.com' && password === 'admin123') || 
                               (email === 'admin@varicocare.com' && password === 'admin123');
          
          if (!isValidAdmin) {
            setError('Invalid admin credentials. Try admin@gmail.com with password admin123');
            return;
          }
        } else {
          // Patient login demo logic - avoid using admin email in patient portal
          if (email === 'admin@gmail.com' || email === 'admin@varicocare.com') {
            setError('This is an admin email. Please switch to the Admin Portal above.');
            return;
          }
        }
      }

      // Successful "Authentication"
      localStorage.setItem('userRole', portalType);
      localStorage.setItem('userName', isLogin ? (portalType === UserRole.ADMIN ? 'System Admin' : 'John Doe') : name);
      localStorage.setItem('userEmail', email);
      
      // Redirect based on role
      navigate(portalType === UserRole.ADMIN ? '/admin' : '/');
    }, 1500);
  };

  const isUserPortal = portalType === UserRole.USER;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100 overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Branding Side - Dynamic based on Portal */}
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-500 ${isUserPortal ? 'bg-blue-600' : 'bg-slate-900'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg ${isUserPortal ? 'text-blue-600' : 'text-slate-900'}`}>
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">VaricoCare</h1>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-6">
              {isUserPortal ? (
                <>Empowering your <br /><span className="text-emerald-300">recovery journey.</span></>
              ) : (
                <>Secure Administrative <br /><span className="text-blue-400">Control Panel.</span></>
              )}
            </h2>
            <p className="text-blue-100/80 text-lg mb-8 leading-relaxed max-w-sm">
              {isUserPortal 
                ? "The world's first AI-driven platform dedicated to varicocele health and male fertility optimization."
                : "Manage user reports, product inventory, and platform analytics with high-level security and precision."}
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="bg-emerald-400 p-2 rounded-lg">
                <CheckCircle2 size={20} className="text-blue-900" />
              </div>
              <p className="text-sm font-medium">{isUserPortal ? 'Clinically backed protocols' : 'Real-time platform analytics'}</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="bg-emerald-400 p-2 rounded-lg">
                <CheckCircle2 size={20} className="text-blue-900" />
              </div>
              <p className="text-sm font-medium">{isUserPortal ? 'Real-time AI Lab Analysis' : 'User management & Verification'}</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
          {/* Portal Selector */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setPortalType(UserRole.USER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${isUserPortal ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              <UserCircle size={18} /> Patient
            </button>
            <button 
              type="button"
              onClick={() => setPortalType(UserRole.ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${!isUserPortal ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              <BriefcaseMedical size={18} /> Admin
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? `${isUserPortal ? 'Patient' : 'Admin'} Login` : 'Create Account'}
            </h3>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Enter your credentials to continue.' : 'Start your health journey today.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder={isUserPortal ? "patient@varicocare.com" : "admin@gmail.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {isLogin && <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 mt-4 ${isUserPortal ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Login Now' : 'Sign Up Free'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {isUserPortal && (
            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-600 font-black hover:underline"
                >
                  {isLogin ? 'Create Account' : 'Login Instead'}
                </button>
              </p>
            </div>
          )}
          
          {!isUserPortal && isLogin && (
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                 Demo: admin@gmail.com / admin123
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
