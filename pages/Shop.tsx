
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Filter, ShoppingBag, Plus, Heart, Package } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'VaricoEase Herbal Blend',
    description: 'Specialized blend to support vein health and testicular circulation.',
    price: 49.99,
    discountPrice: 39.99,
    image: 'https://picsum.photos/400/400?random=1',
    stock: 50,
    category: 'Supplements'
  },
  {
    id: '2',
    name: 'Premium Zinc + L-Carnitine',
    description: 'Boost sperm motility and testosterone production naturally.',
    price: 29.99,
    image: 'https://picsum.photos/400/400?random=2',
    stock: 120,
    category: 'Vitamins'
  }
];

export const Shop: React.FC = () => {
  const { addToCart, totalItems, setIsCartOpen, toggleWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('vc_products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('vc_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">VaricoCare Store</h1>
          <p className="text-slate-500 font-medium">Premium recovery tools and supplements recommended by specialists.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white px-1">
                {totalItems}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <ShoppingBag size={20} />
            Checkout
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 py-2">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg transition-all duration-300 z-10 ${
                    isInWishlist(product.id) ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-6 left-6 right-6 py-4 bg-white/90 backdrop-blur-xl text-blue-600 font-black rounded-2xl shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add to Cart
                </button>
              </div>
              <div className="p-8">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">${product.price}</span>
                  <button onClick={() => addToCart(product)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
           <Package className="mx-auto text-slate-200" size={64} />
           <p className="text-slate-400 font-bold">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};
