import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import SpotFutures from './pages/SpotFutures';
import CrossExchange from './pages/CrossExchange';
import Analytics from './pages/Analytics';
import Calculator from './pages/Calculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/spot-futures" element={<SpotFutures />} />
          <Route path="/cross-exchange" element={<CrossExchange />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
