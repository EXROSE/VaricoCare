
import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  DollarSign, 
  Trash2,
  Activity,
  Plus,
  X,
  Camera,
  Edit3,
  Utensils,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { Exercise, Product } from '../types';

const AdminStat: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} /> {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Exercises' | 'Supplements' | 'Diet Guide'>('Overview');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dietTips, setDietTips] = useState<{id: string, text: string, type: 'Alert' | 'Tip'}[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'Exercise' | 'Supplement' | 'Diet'>('Exercise');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Data Load from Persistent Storage
  useEffect(() => {
    const storedExercises = localStorage.getItem('vc_exercises');
    const storedProducts = localStorage.getItem('vc_products');
    const storedDiet = localStorage.getItem('vc_diet_tips');
    
    if (storedExercises) setExercises(JSON.parse(storedExercises));
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedDiet) setDietTips(JSON.parse(storedDiet));
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleOpenModal = (type: 'Exercise' | 'Supplement' | 'Diet', item: any = null) => {
    setModalType(type);
    setEditingItem(item || { category: type === 'Exercise' ? 'Circulation' : 'Supplements', type: 'Tip' });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'Exercise') {
      const updated = editingItem.id 
        ? exercises.map(ex => ex.id === editingItem.id ? editingItem : ex)
        : [...exercises, { ...editingItem, id: Date.now().toString() }];
      setExercises(updated);
      saveToStorage('vc_exercises', updated);
    } else if (modalType === 'Supplement') {
      const updated = editingItem.id 
        ? products.map(p => p.id === editingItem.id ? editingItem : p)
        : [...products, { ...editingItem, id: Date.now().toString() }];
      setProducts(updated);
      saveToStorage('vc_products', updated);
    } else if (modalType === 'Diet') {
      const updated = editingItem.id 
        ? dietTips.map(t => t.id === editingItem.id ? editingItem : t)
        : [...dietTips, { ...editingItem, id: Date.now().toString() }];
      setDietTips(updated);
      saveToStorage('vc_diet_tips', updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (type: 'Exercise' | 'Supplement' | 'Diet', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action is permanent.')) return;

    if (type === 'Exercise') {
      const updated = exercises.filter(ex => ex.id !== id);
      setExercises(updated);
      saveToStorage('vc_exercises', updated);
    } else if (type === 'Supplement') {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveToStorage('vc_products', updated);
    } else if (type === 'Diet') {
      const updated = dietTips.filter(t => t.id !== id);
      setDietTips(updated);
      saveToStorage('vc_diet_tips', updated);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Management</h1>
          <p className="text-slate-500 font-medium">Create and manage exercises, diet guides, and store inventory.</p>
        </div>
        
        {/* DYNAMIC ACTION BUTTON - The "Add" Button for all CURD operations */}
        {activeTab !== 'Overview' && (
          <button 
            onClick={() => handleOpenModal(
              activeTab === 'Exercises' ? 'Exercise' : 
              activeTab === 'Supplements' ? 'Supplement' : 'Diet'
            )}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Add New {activeTab === 'Supplements' ? 'Supplement' : activeTab === 'Exercises' ? 'Exercise' : 'Diet Tip'}
          </button>
        )}
      </header>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStat label="Total Revenue" value="$54,230" icon={<DollarSign size={24} />} color="bg-emerald-500" trend="+14.2%" />
        <AdminStat label="Exercises" value={exercises.length.toString()} icon={<Activity size={24} />} color="bg-blue-500" trend="+8.1%" />
        <AdminStat label="Supplements" value={products.length.toString()} icon={<Package size={24} />} color="bg-purple-500" trend="+3.2%" />
        <AdminStat label="Diet Guides" value={dietTips.length.toString()} icon={<Utensils size={24} />} color="bg-orange-500" trend="+5.4%" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-[24px] w-fit shadow-sm">
        {(['Overview', 'Exercises', 'Supplements', 'Diet Guide'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${
              activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Lists */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'Exercises' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Routine Name</th>
                  <th className="px-8 py-5 text-center">Duration</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exercises.map(ex => (
                  <tr key={ex.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={ex.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" alt="" />
                        <span className="font-bold text-slate-900">{ex.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-500">{ex.duration}</td>
                    <td className="px-8 py-5"><span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase tracking-wider">{ex.category}</span></td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal('Exercise', ex)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete('Exercise', ex.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
             {exercises.length === 0 && <div className="p-20 text-center text-slate-400 font-bold">No exercises found. Add your first routine above!</div>}
          </div>
        )}

        {activeTab === 'Supplements' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Product Name</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5 text-center">Inventory</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map(p => (
                  <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" alt="" />
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-blue-600">${p.price.toFixed(2)}</td>
                    <td className="px-8 py-5 text-center"><span className="text-xs font-bold text-slate-500">{p.stock || 0} In Stock</span></td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal('Supplement', p)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete('Supplement', p.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
             {products.length === 0 && <div className="p-20 text-center text-slate-400 font-bold">Store is empty. Add supplements above!</div>}
          </div>
        )}

        {activeTab === 'Diet Guide' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Clinical Guidance Content</th>
                  <th className="px-8 py-5 text-center">Priority</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dietTips.map(tip => (
                  <tr key={tip.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5 font-medium text-slate-700 max-w-lg">
                      <div className="flex gap-3">
                         <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${tip.type === 'Alert' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                         <p className="line-clamp-2">{tip.text}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${tip.type === 'Alert' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        {tip.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal('Diet', tip)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete('Diet', tip.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
             {dietTips.length === 0 && <div className="p-20 text-center text-slate-400 font-bold">No diet tips configured. Add content above!</div>}
          </div>
        )}

        {activeTab === 'Overview' && (
           <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                <ClipboardList size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Admin Overview</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Use the tabs above to manage medical content, exercises, and the global supplement store.</p>
              </div>
           </div>
        )}
      </div>

      {/* MODAL - The CURD Form for Create & Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  {modalType === 'Exercise' ? <Activity size={24} /> : modalType === 'Supplement' ? <Package size={24} /> : <Utensils size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editingItem?.id ? 'Edit' : 'Create New'} {modalType}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Asset Manager</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {modalType !== 'Diet' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail / Media Preview</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-video rounded-[32px] border-4 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group transition-all duration-300 ${editingItem.image ? 'border-blue-100 bg-slate-50' : 'border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {editingItem.image ? (
                      <img src={editingItem.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto text-slate-200 mb-2 group-hover:text-blue-300 transition-colors" size={48} />
                        <p className="text-sm font-black text-slate-400">Click to upload image</p>
                      </div>
                    )}
                    {editingItem.image && <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white font-black uppercase text-xs tracking-widest">Change Image</p></div>}
                  </div>
                </div>
              )}

              {modalType === 'Exercise' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Routine Title</label>
                    <input required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="e.g. Diaphragmatic Pelvic Breath" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Category</label>
                    <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                      <option>Pelvic Floor</option><option>Circulation</option><option>Yoga</option><option>Light</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Duration (e.g. 10 min)</label>
                    <input className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.duration || ''} onChange={e => setEditingItem({...editingItem, duration: e.target.value})} placeholder="10 min" />
                  </div>
                </div>
              )}

              {modalType === 'Supplement' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Product Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="e.g. Zinc + Magnesium Complex" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Price ($)</label>
                    <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} placeholder="49.99" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Initial Stock</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" value={editingItem.stock || ''} onChange={e => setEditingItem({...editingItem, stock: parseInt(e.target.value)})} placeholder="100" />
                  </div>
                </div>
              )}

              {modalType === 'Diet' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Tip Description</label>
                    <textarea required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" rows={4} value={editingItem.text || ''} onChange={e => setEditingItem({...editingItem, text: e.target.value})} placeholder="Describe the nutritional benefit or clinical guideline..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Type / Priority</label>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setEditingItem({...editingItem, type: 'Tip'})} className={`flex-1 py-4 rounded-2xl font-black transition-all ${editingItem.type === 'Tip' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Normal Tip</button>
                      <button type="button" onClick={() => setEditingItem({...editingItem, type: 'Alert'})} className={`flex-1 py-4 rounded-2xl font-black transition-all ${editingItem.type === 'Alert' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>High Alert</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.98]">
                  {editingItem.id ? 'Save Changes' : `Publish ${modalType}`}
                </button>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">Changes will take effect instantly for all patients</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
