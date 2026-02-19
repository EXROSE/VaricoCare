
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LabAnalyzer } from './pages/LabAnalyzer';
import { Shop } from './pages/Shop';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { AdminDashboard } from './pages/AdminDashboard';
import { Exercises } from './pages/Exercises';
import { DietPlan } from './pages/DietPlan';
import { Profile } from './pages/Profile';
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/lab-analyzer" element={<LabAnalyzer />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/diet" element={<DietPlan />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<div className="p-8"><h1 className="text-2xl font-bold">Recovery Plans (Coming Soon)</h1></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
};

export default App;
