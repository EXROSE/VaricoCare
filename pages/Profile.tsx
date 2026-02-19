
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  Activity, 
  Dna, 
  ChevronRight, 
  Edit3, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  Package,
  Clock,
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';

// Helper SVG Components
const Target: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const Trash2: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
  </svg>
);

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    date: '14 May 2024',
    total: 89.98,
    status: OrderStatus.SHIPPED,
    items: []
  },
  {
    id: 'ORD-6542',
    date: '28 April 2024',
    total: 34.99,
    status: OrderStatus.DELIVERED,
    items: []
  },
  {
    id: 'ORD-1209',
    date: '10 March 2024',
    total: 124.50,
    status: OrderStatus.DELIVERED,
    items: []
  }
];

const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <div className="group relative inline-block">
    <Info size={14} className="text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none text-center">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

export const Profile: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();
  const [activeProfileTab, setActiveProfileTab] = useState<'wishlist' | 'orders'>('wishlist');

  const handleExportPDF = () => {
    window.print();
  };

  const userStats = [
    { 
      label: 'Varicocele Grade', 
      value: 'Grade 2', 
      icon: Activity, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      tooltip: 'Clinical severity based on vein dilation size and reflux duration. Grade 2 is palpable without maneuvers.'
    },
    { 
      label: 'Fertility Goal', 
      value: 'Optimization', 
      icon: Target, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      tooltip: 'The primary health objective. Optimization focuses on improving parameters like sperm motility and count.'
    },
    { 
      label: 'Last Lab Scan', 
      value: '12 May 2024', 
      icon: Dna, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50',
      tooltip: 'The timestamp of your last clinical report upload processed by our AI diagnostic engine.'
    },
    { 
      label: 'Membership', 
      value: 'Premium', 
      icon: ShieldCheck, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      tooltip: 'Your current account tier. Premium provides unlimited AI scans and advanced recovery protocols.'
    },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case OrderStatus.SHIPPED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100';
      case OrderStatus.CANCELLED: return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="hidden print:block border-b-2 border-blue-600 pb-6 mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">VaricoCare Patient Profile Summary</h1>
            <p className="text-slate-500">Confidential Health Record & History</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">John Doe</p>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 no-print"></div>
        
        <div className="relative group no-print">
          <div className="w-40 h-40 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden ring-4 ring-slate-50">
            <img src="https://picsum.photos/400/400?random=user" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
            <Edit3 size={20} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">John Doe</h1>
            <p className="text-slate-500 font-medium text-lg">Patient ID: VC-2024-8842 • Age: 28</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100">Premium Member</span>
            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">Verified Account</span>
          </div>
          <p className="text-slate-400 font-medium max-w-lg">
            Focusing on natural varicocele management and holistic fertility optimization since January 2024.
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px] no-print">
          <button className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Settings size={18} /> Edit Profile
          </button>
          <button 
            onClick={() => window.print()}
            className="w-full bg-white text-slate-600 py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all border border-slate-100"
          >
            <Download size={18} /> Export Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className="no-print">
                <InfoTooltip content={stat.tooltip} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Tabs Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit no-print">
            <button 
              onClick={() => setActiveProfileTab('wishlist')}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeProfileTab === 'wishlist' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Heart size={18} fill={activeProfileTab === 'wishlist' ? 'currentColor' : 'none'} />
              Wishlist
            </button>
            <button 
              onClick={() => setActiveProfileTab('orders')}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeProfileTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Package size={18} />
              Order History
            </button>
          </div>

          {activeProfileTab === 'wishlist' ? (
            <div className="space-y-6 no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Your Wishlist</h2>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                  {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((product) => (
                    <div key={product.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex gap-5 group hover:shadow-xl transition-all">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-black text-slate-900 truncate mb-1">{product.name}</h3>
                          <p className="text-xl font-black text-blue-600">${(product.discountPrice || product.price).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={14} /> Add to Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product)}
                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 border-dashed rounded-[40px] p-16 text-center space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-sm">
                    <Heart size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900">Wishlist is empty</h3>
                    <p className="text-slate-500 font-medium">Save products you love to find them later.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline pt-2"
                  >
                    Go to Shop
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Package size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Order History</h2>
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-50">
                  {MOCK_ORDERS.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all no-print">
                          <ShoppingBag size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{order.id}</h4>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                            <Clock size={12} /> {order.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                          <p className="text-lg font-black text-slate-900">${order.total.toFixed(2)}</p>
                        </div>
                        
                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>

                        <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors no-print">
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center gap-4 no-print">
                <AlertCircle className="text-blue-600 shrink-0" size={24} />
                <p className="text-xs text-blue-800 font-bold leading-relaxed">
                  Shipping typically takes 3-5 business days. You will receive an email with tracking information as soon as your order leaves our facility.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8 no-print">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl shadow-blue-900/10">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Activity size={20} className="text-blue-400" /> Health Reminders
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                <p className="text-sm font-medium text-slate-300">Schedule follow-up ultrasound for June assessment.</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <p className="text-sm font-medium text-slate-300">Continue daily Zinc supplementation for motility.</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
              View Detailed History
            </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Account Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">2FA Status</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Last Login</span>
                <span className="text-xs font-black text-slate-900">Today, 09:42 AM</span>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={18} />
              <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-widest">
                Keep your health records private. Do not share your password with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
