
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Flame, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Activity,
  Heart,
  Zap,
  Dna,
  Info,
  Maximize2,
  X,
  Trophy
} from 'lucide-react';
import { Exercise } from '../types';

const INITIAL_EXERCISES: Exercise[] = [
  { 
    id: '1', 
    title: 'Pelvic Floor Release', 
    category: 'Pelvic Floor', 
    duration: '5 min', 
    calories: '25 kcal', 
    intensity: 'Low', 
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'This foundational movement is designed to relax and lengthen the pelvic floor muscles. Chronic tension in this region can restrict local blood flow and contribute to the vascular congestion seen in Varicocele patients. By utilizing deep diaphragmatic breathing, we aim to naturally reduce the pressure on the internal spermatic veins. Hold each stretch for 30 seconds, focusing on full relaxation during the exhale.'
  },
  { 
    id: '2', 
    title: 'Testicular Circulation Flow', 
    category: 'Circulation', 
    duration: '10 min', 
    calories: '45 kcal', 
    intensity: 'Low', 
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Targeted inversions and rhythmic leg movements assist the venous valves in returning pooled blood from the scrotum back to the core circulation. This prevents the characteristic "blood pooling" that leads to vein dilation. Perform these movements slowly and rhythmically to synchronize with your heart rate for maximum drainage efficiency.'
  },
  { 
    id: '3', 
    title: 'Varico-Yoga: Cat Cow', 
    category: 'Yoga', 
    duration: '8 min', 
    calories: '30 kcal', 
    intensity: 'Medium', 
    image: 'https://images.unsplash.com/photo-1510894347713-fc3ad6cb03a2?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Cat-Cow is a gentle flow that improves spinal mobility and pelvic positioning. By alternating between arching and rounding the back, you create a natural pumping mechanism in the abdominal cavity that helps decongest the deep pelvic veins. This is particularly effective for those who spend long periods sitting or standing.'
  }
];

export const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [completions, setCompletions] = useState<string[]>([]);

  useEffect(() => {
    // Load exercises from localStorage or use initial ones
    const stored = localStorage.getItem('vc_exercises');
    if (stored) {
      setExercises(JSON.parse(stored));
    } else {
      setExercises(INITIAL_EXERCISES);
      localStorage.setItem('vc_exercises', JSON.stringify(INITIAL_EXERCISES));
    }

    // Load completions
    const storedCompletions = localStorage.getItem('vc_completions');
    if (storedCompletions) {
      setCompletions(JSON.parse(storedCompletions));
    }
  }, []);

  const categories = ['All', 'Pelvic Floor', 'Circulation', 'Yoga', 'Light'];
  const filteredExercises = selectedCategory === 'All' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Auto-finish logic could go here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(parseInt(exercise.duration) * 60);
    setIsRunning(true);
    setShowVideo(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    if (activeExercise) {
      const newCompletions = [...completions, activeExercise.id];
      setCompletions(newCompletions);
      localStorage.setItem('vc_completions', JSON.stringify(newCompletions));
      
      // Update streak in localStorage
      const currentStreak = parseInt(localStorage.getItem('vc_streak') || '0');
      localStorage.setItem('vc_streak', (currentStreak + 1).toString());
    }
    closeWorkshop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const closeWorkshop = () => {
    setActiveExercise(null);
    setIsRunning(false);
    setShowVideo(false);
  };

  if (activeExercise) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={closeWorkshop}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Exit Workshop
          </button>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Training Session</span>
              <span className="text-sm font-bold text-slate-900">{activeExercise.title}</span>
            </div>
            <button onClick={closeWorkshop} className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl border border-slate-50 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-3/5 relative bg-slate-950 flex items-center justify-center min-h-[400px]">
            {showVideo && activeExercise.videoUrl ? (
              <div className="w-full h-full animate-in fade-in zoom-in-95 duration-700 bg-black">
                <iframe 
                  src={`${activeExercise.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full border-none min-h-[400px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeExercise.title}
                ></iframe>
              </div>
            ) : (
              <>
                <img 
                  src={activeExercise.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'} 
                  alt={activeExercise.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div 
                    onClick={() => setShowVideo(true)}
                    className="w-24 h-24 bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-white/20 transition-all group/play"
                  >
                    <Play className="text-white ml-1" size={40} fill="currentColor" />
                  </div>
                  <p className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Start Video Guide</p>
                </div>
              </>
            )}
          </div>

          <div className="lg:w-2/5 p-10 md:p-12 flex flex-col justify-between space-y-12 bg-white relative">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {activeExercise.category}
                </span>
                <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                  {activeExercise.intensity} Intensity
                </span>
              </div>

              <div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">{activeExercise.title}</h2>
                <p className="text-slate-500 leading-relaxed font-medium line-clamp-6">
                  {activeExercise.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <Timer size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</p>
                    <p className="text-3xl font-black tabular-nums">{formatTime(timeLeft)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isRunning ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {isRunning ? <div className="w-4 h-4 bg-white rounded-sm"></div> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
              >
                <CheckCircle2 size={22} />
                Complete Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Activity size={14} /> Recovery Programs
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Vascular Workouts</h1>
          <p className="text-slate-500 max-w-xl font-medium">
            Exercises scientifically designed to relieve pelvic pressure and optimize blood return to the core.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black transition-all ${
                selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-400 border border-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map((exercise, idx) => (
          <div 
            key={exercise.id} 
            onClick={() => startExercise(exercise)}
            className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={exercise.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'} alt={exercise.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                   {exercise.category}
                </span>
              </div>

              {completions.includes(exercise.id) && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                    <Clock size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{exercise.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{exercise.calories}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-500 transition-all">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{exercise.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 italic">
                {exercise.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Placeholder if none */}
        {filteredExercises.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Activity size={40} />
            </div>
            <p className="text-slate-400 font-bold">No exercises found in this category.</p>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="bg-slate-900 rounded-[48px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Trophy size={40} />
          </div>
          <div>
            <h4 className="text-2xl font-black">Weekly Progress</h4>
            <p className="text-slate-400 font-medium">You've completed <span className="text-emerald-400">{completions.length}</span> exercises this week!</p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          {[1,2,3,4,5,6,7].map(d => (
            <div key={d} className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs ${
              d <= (completions.length % 7) || completions.length >= d
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'border-white/10 text-white/30'
            }`}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
