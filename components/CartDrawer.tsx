
import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    successMessage,
    setSuccessMessage 
  } = useCart();
  
  const navigate = useNavigate();
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const itemToConfirm = cart.find(item => item.id === confirmRemoveId);

  const handleConfirmDelete = () => {
    if (confirmRemoveId) {
      removeFromCart(confirmRemoveId);
      setConfirmRemoveId(null);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Success Toast Banner */}
        {successMessage && (
          <div className="absolute top-20 left-6 right-6 z-30 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span className="text-sm font-bold">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="hover:opacity-70">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog Overlay */}
        {confirmRemoveId && itemToConfirm && (
          <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-6 max-w-xs">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Remove Item?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Are you sure you want to remove <span className="font-semibold text-slate-700">"{itemToConfirm.name}"</span> from your cart?
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleConfirmDelete}
                  className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Yes, Remove Item
                </button>
                <button 
                  onClick={() => setConfirmRemoveId(null)}
                  className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
              <div className="relative mb-10">
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-50 to-emerald-50 rounded-full flex items-center justify-center text-blue-500 animate-pulse">
                  <ShoppingBag size={64} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center">
                  <Heart className="text-rose-500 animate-bounce" size={24} fill="currentColor" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h3>
              <p className="text-slate-500 mb-10 leading-relaxed">
                Take the first step towards a healthier you. Our curated supplements and recovery tools are designed to support your varicocele journey.
              </p>
              
              <button 
                onClick={() => setIsCartOpen(false)}
                className="group w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
              >
                Start Exploring
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-12 pt-8 border-t border-slate-50 w-full">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Why shop with us?</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-800">Expert Picked</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-800">Secure Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 pt-16"> {/* Extra padding for toast */}
              {cart.map((item, index) => (
                <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {item.name}
                        {index === 0 && successMessage && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                      </h3>
                      <button 
                        onClick={() => setConfirmRemoveId(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-blue-600 mb-3">
                      ${(item.discountPrice || item.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white space-y-4 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.03)]">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Calculated at checkout</span>
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
            <div className="flex items-center justify-center gap-4 pt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 opacity-40 grayscale" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
