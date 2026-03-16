import React, { useState, useEffect, useMemo } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { LineChart, BarChart3, Activity, Search } from 'lucide-react';

const Analytics: React.FC = () => {
  const { marketData } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState<{rate: number; time: string}[]>([]);

  // Filter funding rates based on search term
  const filteredRates = useMemo(() => {
    if (!searchTerm) return [];
    return marketData.fundingRates.filter(r => 
      r.coin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.exchange.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [marketData.fundingRates, searchTerm]);

  // Build history for the SEARCHED coin (or average if no search)
  useEffect(() => {
    if (marketData.fundingRates.length > 0) {
      let targetRate = 0;
      
      if (searchTerm && filteredRates.length > 0) {
        // Average rate for the searched coin across exchanges
        targetRate = filteredRates.reduce((sum, r) => sum + r.fundingRate, 0) / filteredRates.length;
      } else if (!searchTerm) {
        // Global average if no search
        targetRate = marketData.fundingRates.reduce((sum, r) => sum + r.fundingRate, 0) / marketData.fundingRates.length;
      } else {
        return; // Search term exists but no matches
      }

      setHistoryData(prev => [
        ...prev.slice(-29), // keep last 30 data points
        { rate: targetRate, time: new Date().toLocaleTimeString() }
      ]);
    }
  }, [marketData.fundingRates, searchTerm, filteredRates]);

  const maxRate = Math.max(...historyData.map(d => Math.abs(d.rate)), 0.0001);

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm 
              ? `Showing analytics for "${searchTerm}"` 
              : 'Funding rate trends, volatility metrics, and market overview'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search coin (e.g. BTC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <LineChart size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {searchTerm ? 'Coin Avg Rate' : 'Global Avg Rate'}
              </p>
              <p className="text-xl font-bold">
                {searchTerm 
                  ? (filteredRates.length > 0 
                      ? `${((filteredRates.reduce((s, r) => s + r.fundingRate, 0) / filteredRates.length) * 100).toFixed(4)}%`
                      : '—')
                  : (marketData.fundingRates.length > 0
                      ? `${((marketData.fundingRates.reduce((s, r) => s + r.fundingRate, 0) / marketData.fundingRates.length) * 100).toFixed(4)}%`
                      : '—')
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <BarChart3 size={18} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Rate Volatility</p>
              <p className="text-xl font-bold">
                {((searchTerm ? filteredRates : marketData.fundingRates).length > 1)
                  ? (() => {
                      const dataSet = searchTerm ? filteredRates : marketData.fundingRates;
                      const rates = dataSet.map(r => r.fundingRate);
                      const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
                      const variance = rates.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / rates.length;
                      return `${(Math.sqrt(variance) * 100).toFixed(4)}%`;
                    })()
                  : '—'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Activity size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {searchTerm ? 'Exchanges for Coin' : 'Active Exchanges'}
              </p>
              <p className="text-xl font-bold">
                {new Set((searchTerm ? filteredRates : marketData.fundingRates).map(r => r.exchange)).size || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Rate Chart */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <LineChart size={18} className="text-emerald-400" />
            {searchTerm ? `Funding Rate Trend for ${searchTerm.toUpperCase()}` : 'Global Funding Rate Trend'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm 
              ? `Average funding rate for ${searchTerm.toUpperCase()} across available exchanges` 
              : 'Average funding rate across all exchanges and coins'}
          </p>
        </div>

        <div className="p-6">
          {historyData.length < 2 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-500">
                {searchTerm ? `Waiting for data on ${searchTerm.toUpperCase()}...` : 'Collecting data points...'}
              </p>
            </div>
          ) : (
            <div className="h-48 flex items-end gap-1">
              {historyData.map((point, i) => {
                const height = (Math.abs(point.rate) / maxRate) * 100;
                const isPositive = point.rate >= 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${isPositive ? 'bg-emerald-400/60' : 'bg-red-400/60'}`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10">
                      <p className="font-semibold">{(point.rate * 100).toFixed(4)}%</p>
                      <p className="text-gray-500">{point.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Per-Exchange Rates */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold">
            {searchTerm ? `Exchange Rates for ${searchTerm.toUpperCase()}` : 'Per-Exchange Global Rates'}
          </h2>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(searchTerm ? filteredRates : marketData.fundingRates).slice(0, 48).map((rate, i) => {
            const pct = (rate.fundingRate * 100).toFixed(4);
            const isPositive = rate.fundingRate >= 0;
            return (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">{rate.coin}</p>
                <p className="text-xs text-gray-400 capitalize mb-1">{rate.exchange}</p>
                <p className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{pct}%
                </p>
              </div>
            );
          })}
          {(searchTerm ? filteredRates : marketData.fundingRates).length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-gray-500">
                {searchTerm ? `No data found for "${searchTerm}"` : 'Waiting for funding rate data...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
