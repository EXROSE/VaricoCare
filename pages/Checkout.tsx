
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Edit2,
  Package,
  MapPin,
  CreditCard as CardIcon,
  Download
} from 'lucide-react';
import { useCart } from '../context/CartContext';

type CheckoutStep = 'details' | 'review';

export const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Simple form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2500);
  };

  const maskCardNumber = (num: string) => {
    const cleanNum = num.replace(/\s/g, '');
    if (cleanNum.length < 4) return '****';
    return `**** **** **** ${cleanNum.slice(-4)}`;
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="hidden print:block border-b-2 border-blue-600 pb-6 mb-10 text-left">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900">VaricoCare Order Receipt</h1>
              <p className="text-slate-500">Purchase Confirmation & Record</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700">Order ID: VC-{Math.floor(Math.random() * 1000000)}</p>
              <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Billed To</p>
              <p className="text-slate-900 font-bold">{formData.name}</p>
              <p className="text-slate-600">{formData.email}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Shipping To</p>
              <p className="text-slate-600">{formData.address}</p>
              <p className="text-slate-600">{formData.city}, {formData.zip}</p>
            </div>
          </div>
        </div>

        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50 no-print">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed px-4 no-print">
          Thank you for choosing VaricoCare. Your order is being prepared and will be shipped within 24 hours. A confirmation email has been sent to your inbox.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-white text-slate-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Export Receipt
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="text-blue-600 font-bold hover:underline"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 no-print">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => step === 'review' ? setStep('details') : navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {step === 'review' ? 'Back to Details' : 'Back to Shopping'}
        </button>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
            <span>1. Details</span>
          </div>
          <div className="w-4 h-px bg-slate-200"></div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            <span>2. Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form or Review */}
        <div className="lg:col-span-7 space-y-8 animate-in fade-in duration-500">
          {step === 'details' ? (
            <>
              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Shipping Information</h2>
                </div>
                
                <form id="checkout-form" onSubmit={handleContinueToReview} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Shipping Address</label>
                    <input 
                      required
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="123 Health Way"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                    <input 
                      required
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ZIP / Postal Code</label>
                    <input 
                      required
                      type="text" 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="94103"
                    />
                  </div>
                </form>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="0000 0000 0000 0000"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                      <input 
                        required
                        type="text" 
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CVC</label>
                      <input 
                        required
                        type="password" 
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="***"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Review Your Order</h2>
              <p className="text-slate-500">Please confirm your details before completing the purchase.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
                  <button 
                    onClick={() => setStep('details')}
                    className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <MapPin size={20} />
                    <h3 className="font-bold uppercase text-[10px] tracking-widest">Shipping Address</h3>
                  </div>
                  <p className="font-bold text-slate-900">{formData.name}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{formData.address}</p>
                  <p className="text-slate-600 text-sm">{formData.city}, {formData.zip}</p>
                  <p className="text-slate-400 text-xs mt-4 font-medium">{formData.email}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
                  <button 
                    onClick={() => setStep('details')}
                    className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <CardIcon size={20} />
                    <h3 className="font-bold uppercase text-[10px] tracking-widest">Payment Method</h3>
                  </div>
                  <p className="font-bold text-slate-900">Card ending in {formData.cardNumber.slice(-4)}</p>
                  <p className="text-slate-600 text-sm">{maskCardNumber(formData.cardNumber)}</p>
                  <p className="text-slate-400 text-xs mt-4 font-medium">Expires {formData.expiry}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                  <Package size={20} className="text-slate-400" />
                  <h3 className="font-bold uppercase text-[10px] tracking-widest text-slate-500">Order Items</h3>
                </div>
                <div className="p-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{item.quantity}x</span>
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl sticky top-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <h2 className="text-xl font-black mb-8 relative z-10">Order Summary</h2>
            
            <div className="space-y-6 mb-8 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Calculated Free</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Tax</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>
              
              <div className="pt-6 flex justify-between items-end border-t border-white/10">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Payable</p>
                  <span className="text-4xl font-black text-blue-400 tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
                {step === 'details' && (
                   <span className="text-[10px] font-black text-slate-500 uppercase bg-white/5 px-2 py-1 rounded">1 of 2</span>
                )}
              </div>
            </div>

            <div className="relative z-10">
              {step === 'details' ? (
                <button 
                  form="checkout-form"
                  className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  Continue to Review
                  <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleFinalPayment}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authorizing...
                    </>
                  ) : (
                    <>
                      Confirm & Pay ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl border border-white/10">
              <ShieldCheck className="text-blue-400 shrink-0" size={18} />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Stripe Encryption Verified
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4 no-print">
            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-xs text-blue-800 font-bold leading-relaxed">
              VaricoCare Promise: Discreet shipping in plain packaging. Supplements are third-party tested for purity and potency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};