
import React from 'react';
import { 
  TrendingUp, 
  Heart, 
  Flame, 
  Calendar,
  ChevronRight,
  Plus,
  Utensils,
  ArrowRight,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const mockHealthData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 70 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 75 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 88 },
];

const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string;
  trend: string;
}> = ({ label, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-4 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
        {trend}
      </span>
    </div>
    <div>
      <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="hidden print:block border-b-2 border-blue-600 pb-6 mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">VaricoCare Weekly Health Report</h1>
            <p className="text-slate-500">Patient Status & Recovery Progress Summary</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">John Doe</p>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Good Morning, John</h1>
          <p className="text-slate-500 font-medium">Your recovery progress is looking strong this week.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex-1 md:flex-none bg-white text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all border border-slate-100"
          >
            <Download size={18} />
            Export Report
          </button>
          <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Log Progress
          </button>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Health Score" 
          value="88/100" 
          icon={<Heart size={24} />} 
          color="bg-rose-500" 
          trend="+5.2%"
        />
        <StatCard 
          label="Sperm Motility" 
          value="45%" 
          icon={<TrendingUp size={24} />} 
          color="bg-blue-500" 
          trend="+12%"
        />
        <StatCard 
          label="Daily Calories" 
          value="2,450" 
          icon={<Flame size={24} />} 
          color="bg-orange-500" 
          trend="ON TRACK"
        />
        <StatCard 
          label="Workouts" 
          value="12/15" 
          icon={<Calendar size={24} />} 
          color="bg-emerald-500" 
          trend="80% DONE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Recovery Score Over Time</h3>
            <select className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer no-print">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHealthData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Checklist */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Daily Tasks</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md no-print">2 LEFT</span>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Morning Pelvic Stretch', completed: true, time: '8:00 AM' },
              { title: 'Vitamin C + Zinc Supplement', completed: true, time: '9:30 AM' },
              { title: 'Cold Shower Hydrotherapy', completed: false, time: '11:00 AM' },
              { title: 'Kegel Routine (Level 2)', completed: false, time: '4:00 PM' },
              { title: 'Evening Circulation Yoga', completed: false, time: '8:00 PM' }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-all group border border-transparent">
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'border-slate-200'
                }`}>
                  {task.completed && <ChevronRight size={16} className="rotate-90" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/exercises')}
            className="w-full mt-10 group flex items-center justify-between p-5 bg-slate-900 text-white rounded-[24px] font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 no-print"
          >
            <span>View All Routines</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};