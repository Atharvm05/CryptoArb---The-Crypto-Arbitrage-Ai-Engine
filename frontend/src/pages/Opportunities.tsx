import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { Zap, TrendingUp, ArrowRight } from 'lucide-react';

const Opportunities: React.FC = () => {
  const { marketData } = useMarketData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Arbitrage Opportunities</h1>
        <p className="text-sm text-gray-400 mt-1">Ranked by spread, with suggested trade direction</p>
      </div>

      {marketData.fundingOpportunities.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-12 text-center">
          <Zap size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-sm">Scanning exchanges for arbitrage opportunities...</p>
          <p className="text-gray-600 text-xs mt-2">Opportunities will appear here when funding rate spreads are detected</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {marketData.fundingOpportunities.map((opp, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <span className="text-sm font-bold">#{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{opp.asset}</h3>
                    <p className="text-xs text-gray-500">Funding Rate Arbitrage</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{(opp.spread * 100).toFixed(4)}%</p>
                  <p className="text-xs text-gray-500">Spread</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Long Side */}
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Long on</p>
                  <p className="text-sm font-semibold text-emerald-400 capitalize">{opp.longExchange}</p>
                  <p className="text-xs text-gray-500 mt-1">Rate: {(opp.longFundingRate * 100).toFixed(4)}%</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ArrowRight size={20} />
                    <TrendingUp size={20} className="text-emerald-400" />
                  </div>
                </div>

                {/* Short Side */}
                <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Short on</p>
                  <p className="text-sm font-semibold text-red-400 capitalize">{opp.shortExchange}</p>
                  <p className="text-xs text-gray-500 mt-1">Rate: {(opp.shortFundingRate * 100).toFixed(4)}%</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Est. profit per $10k: <span className="text-emerald-400 font-semibold">${opp.expectedProfitPer10k.toFixed(2)}</span> / cycle
                </p>
                <p className="text-xs text-gray-600">{new Date(opp.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
