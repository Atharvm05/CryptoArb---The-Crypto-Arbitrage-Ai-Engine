import React, { useState, useMemo } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { ArrowLeftRight, RefreshCw, Search, Filter, ArrowUpDown } from 'lucide-react';

const SpotFutures: React.FC = () => {
  const { marketData, connected, lastUpdated, autoRefresh, setAutoRefresh, requestUpdate } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [minSpread, setMinSpread] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'spread' | 'coin' | 'exchange'>('spread');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const data = marketData.spotFuturesOpportunities;
  const loading = !connected && data.length === 0;

  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(item => 
        item.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.exchange.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by min spread
    if (minSpread !== 0) {
      result = result.filter(item => Math.abs(item.spreadPct) >= minSpread);
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'spread') {
        valA = Math.abs(a.spreadPct);
        valB = Math.abs(b.spreadPct);
      } else if (sortBy === 'coin') {
        valA = a.asset;
        valB = b.asset;
      } else {
        valA = a.exchange;
        valB = b.exchange;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchTerm, minSpread, sortBy, sortOrder]);

  const toggleSort = (field: 'spread' | 'coin' | 'exchange') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    requestUpdate();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Spot vs Futures Arbitrage
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-400">Scan premiums and discounts across 100+ assets</p>
            <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded-full border border-white/5">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${autoRefresh ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
          >
            {autoRefresh ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF'}
          </button>
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-all ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={12} className={isRefreshing || (connected && autoRefresh) ? 'animate-spin-slow' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
            {connected ? 'Live Data' : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search coin (BTC, ETH...) or exchange..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select
            value={minSpread}
            onChange={(e) => setMinSpread(Number(e.target.value))}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
          >
            <option value="0">Min Spread: 0%</option>
            <option value="0.1">Min Spread: 0.1%</option>
            <option value="0.5">Min Spread: 0.5%</option>
            <option value="1.0">Min Spread: 1.0%</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('spread')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${sortBy === 'spread' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
          >
            Sort by Spread <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ArrowLeftRight size={18} className="text-cyan-400" />
            Global Arbitrage Ranking
          </h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg font-mono">
            {filteredData.length} Opportunities Found
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <RefreshCw size={40} className="mx-auto text-gray-700 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Scanning all exchanges...</p>
            <p className="text-gray-600 text-sm mt-2">Loading Spot and Futures prices</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-20 text-center">
            <ArrowLeftRight size={48} className="mx-auto text-gray-800 mb-4 opacity-20" />
            <p className="text-gray-500">No arbitrage opportunities found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-[11px] text-gray-500 uppercase tracking-wider border-b border-white/[0.05]">
                  <th className="px-6 py-4 text-left font-bold w-16">Rank</th>
                  <th className="px-6 py-4 text-left font-bold">Coin</th>
                  <th className="px-4 py-4 text-left font-bold">Exchange</th>
                  <th className="px-4 py-4 text-right font-bold">Spot Price</th>
                  <th className="px-4 py-4 text-right font-bold">Futures Price</th>
                  <th className="px-6 py-4 text-right font-bold bg-blue-500/5">Spread %</th>
                  <th className="px-6 py-4 text-center font-bold">Direction</th>
                  <th className="px-6 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredData.map((item, i) => {
                  const isPremium = item.direction === 'PREMIUM';
                  const absSpread = Math.abs(item.spreadPct);
                  const isLargeSpread = absSpread > 1.0;

                  return (
                    <tr key={`${item.asset}-${item.exchange}`} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-xs font-mono text-gray-600">#{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-white/80 border border-white/10 group-hover:scale-110 transition-transform">
                            {item.asset[0]}
                          </div>
                          <span className="font-bold text-white">{item.asset.split('/')[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-gray-400 capitalize bg-white/5 px-2 py-1 rounded">
                          {item.exchange}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-gray-300">
                        ${item.spotPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-gray-300">
                        ${item.futuresPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </td>
                      <td className={`px-6 py-4 text-right bg-blue-500/5`}>
                        <span className={`text-sm font-bold ${isPremium ? 'text-emerald-400' : 'text-red-400'} ${isLargeSpread ? 'text-base underline' : ''}`}>
                          {item.spreadPct >= 0 ? '+' : ''}{item.spreadPct.toFixed(3)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${isPremium ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {item.direction}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-white transition-colors">
                          {isPremium ? 'Buy Spot / Short Futures' : 'Short Spot / Long Futures'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotFutures;
