import React, { useState, useMemo } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { RefreshCw, Search, Filter, ArrowUpDown } from 'lucide-react';

export type FundingMatrixRow = {
  coin: string;
  rates: Record<string, number>;
  bestSpread: number;
  longExchange: string;
  shortExchange: string;
  opportunity: string;
  liquidityScore: number;
  rankScore: number;
};

const EXCHANGES = [
  'binance', 'bybit', 'okx', 'bitget', 'kucoin', 'gateio', 'mexc', 'htx', 'bingx', 'phemex', 'coinex', 'ascendex', 'deribit', 'dydx', 'hyperliquid'
];

const Dashboard: React.FC = () => {
  const { marketData, connected, autoRefresh, setAutoRefresh, requestUpdate, lastUpdated } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [minSpread, setMinSpread] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'spread' | 'coin' | 'rank'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatRate = (rate: number | undefined) => {
    if (rate === undefined) return '—';
    const pct = (rate * 100).toFixed(4);
    return `${parseFloat(pct) >= 0 ? '+' : ''}${pct}%`;
  };

  const filteredData = useMemo(() => {
    let data = [...marketData.fundingMatrix];

    // Search filter
    if (searchTerm) {
      data = data.filter(row => row.coin.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Min spread filter
    if (minSpread > 0) {
      data = data.filter(row => row.bestSpread * 100 >= minSpread);
    }

    // Sorting
    data.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'spread') {
        valA = a.bestSpread;
        valB = b.bestSpread;
      } else if (sortBy === 'coin') {
        valA = a.coin;
        valB = b.coin;
      } else {
        valA = a.rankScore;
        valB = b.rankScore;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Limit displayed items to 40 for initial performance, unless searching
    return searchTerm ? data : data.slice(0, 40);
  }, [marketData.fundingMatrix, searchTerm, minSpread, sortBy, sortOrder]);

  const toggleSort = (field: 'spread' | 'coin' | 'rank') => {
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
            Funding Matrix
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-400">Real-time perpetual funding arbitrage scanner</p>
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

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search coin (BTC, ETH...)"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-4 bg-white/5 border border-white/10 rounded-xl">
          <Filter className="text-gray-500" size={18} />
          <span className="text-sm text-gray-400 whitespace-nowrap">Min Spread %:</span>
          <input
            type="number"
            step="0.01"
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
            value={minSpread || ''}
            onChange={(e) => setMinSpread(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('spread')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${sortBy === 'spread' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
          >
            Sort by Spread <ArrowUpDown size={14} />
          </button>
          <button
            onClick={() => toggleSort('coin')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${sortBy === 'coin' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
          >
            Sort by Coin <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-20 text-center">
            <RefreshCw size={40} className="mx-auto text-gray-700 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Scanning markets...</p>
            <p className="text-gray-600 text-sm mt-2">Connecting to 15+ exchanges for funding data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-[11px] text-gray-500 uppercase tracking-wider border-b border-white/[0.05]">
                  <th className="px-6 py-4 text-left font-bold sticky left-0 bg-[#0a0a0a] z-10">Coin</th>
                  {EXCHANGES.map(ex => (
                    <th key={ex} className="px-4 py-4 text-center font-bold capitalize">{ex}</th>
                  ))}
                  <th className="px-6 py-4 text-right font-bold bg-blue-500/5">Spread</th>
                  <th className="px-6 py-4 text-right font-bold">Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredData.map((row) => (
                  <tr key={row.coin} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 sticky left-0 bg-[#0a0a0a] z-10 group-hover:bg-[#111] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-white/80 border border-white/10">
                          {row.coin[0]}
                        </div>
                        <span className="font-bold text-white">{row.coin}</span>
                      </div>
                    </td>
                    {EXCHANGES.map(ex => {
                      const rate = row.rates[ex];
                      const isBestLong = row.longExchange === ex;
                      const isBestShort = row.shortExchange === ex;
                      return (
                        <td key={ex} className="px-4 py-4 text-center">
                          <span className={`text-xs font-mono px-2 py-1 rounded ${
                            rate === undefined ? 'text-gray-600' :
                            rate > 0 ? 'text-emerald-400 bg-emerald-500/5' : 
                            rate < 0 ? 'text-red-400 bg-red-500/5' : 'text-gray-400'
                          } ${isBestLong ? 'ring-1 ring-red-500/50' : ''} ${isBestShort ? 'ring-1 ring-emerald-500/50' : ''}`}>
                            {formatRate(rate)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right bg-blue-500/5">
                      <span className="text-sm font-bold text-blue-400">
                        {(row.bestSpread * 100).toFixed(3)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-tighter">
                          Long {row.longExchange}
                        </span>
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-tighter">
                          Short {row.shortExchange}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
