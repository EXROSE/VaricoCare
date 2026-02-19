
import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Flame, 
  ArrowRight, 
  RefreshCcw, 
  Scale, 
  Calendar, 
  Target,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Soup,
  Coffee,
  Apple,
  Beef,
  Heart,
  Info
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { DailyDietPlan } from '../types';

export const DietPlan: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DailyDietPlan | null>(null);
  const [curatedTips, setCuratedTips] = useState<{id: string, text: string, type: 'Alert' | 'Tip'}[]>([]);
  const [formData, setFormData] = useState({
    weight: 75,
    age: 28,
    grade: 2,
    goal: 'Maintenance',
    testosterone: 450
  });

  useEffect(() => {
    const storedTips = localStorage.getItem('vc_diet_tips');
    if (storedTips) {
      setCuratedTips(JSON.parse(storedTips));
    }
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const generatedPlan = await GeminiService.generateDietPlan(formData);
      setPlan(generatedPlan);
    } catch (error) {
      console.error("Diet generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const MealCard = ({ title, meal, icon: Icon, color }: { title: string, meal: any, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
          <span className="text-sm font-bold text-slate-900">{meal?.calories || 0} kcal</span>
        </div>
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{meal?.name || 'Loading...'}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
        Optimized for Grade {formData.grade} recovery with vascular-support ingredients.
      </p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Utensils size={12} /> Nutritional Recovery
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Personalized Diet</h1>
          <p className="text-slate-500 max-w-lg font-medium">
            Optimized nutrition plans to balance testosterone and reduce vascular inflammation.
          </p>
        </div>
      </header>

      {!plan ? (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-50 border border-slate-50 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Current Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Varicocele Grade</label>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                  {[1, 2, 3].map(g => (
                    <button key={g} onClick={() => setFormData({...formData, grade: g})} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${formData.grade === g ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Age</label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Goal</label>
                <select value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-100 font-bold appearance-none">
                  <option>Maintenance</option><option>Fat Loss</option><option>Muscle Gain</option><option>Fertility Focus</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={generatePlan} disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <><Loader2 className="animate-spin" /> Tailoring...</> : <>Generate Recovery Plan <ArrowRight /></>}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MealCard title="Breakfast" meal={plan.breakfast} icon={Coffee} color="bg-blue-500" />
            <MealCard title="Lunch" meal={plan.lunch} icon={Soup} color="bg-emerald-500" />
            <MealCard title="Dinner" meal={plan.dinner} icon={Beef} color="bg-rose-500" />
            <MealCard title="Snacks" meal={plan.snacks} icon={Apple} color="bg-orange-500" />
          </div>

          {/* Admin Managed Tips Section */}
          <div className="space-y-6 pt-10">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Info className="text-blue-600" /> Clinical Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curatedTips.length > 0 ? curatedTips.map(tip => (
                <div key={tip.id} className={`p-6 rounded-[32px] border flex gap-4 ${tip.type === 'Alert' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
                  {tip.type === 'Alert' ? <AlertCircle className="shrink-0" /> : <CheckCircle2 className="shrink-0" />}
                  <p className="text-sm font-bold leading-relaxed">{tip.text}</p>
                </div>
              )) : (
                <p className="text-slate-400 font-medium italic col-span-2">No additional guidelines available at this time.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
