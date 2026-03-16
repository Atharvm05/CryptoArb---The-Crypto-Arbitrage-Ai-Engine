import React, { useState } from 'react';
import { Calculator as CalcIcon, DollarSign, TrendingUp, Percent } from 'lucide-react';

const Calculator: React.FC = () => {
  const [capital, setCapital] = useState<string>('10000');
  const [leverage, setLeverage] = useState<string>('1');
  const [fundingSpread, setFundingSpread] = useState<string>('0.05');
  const [result, setResult] = useState<{
    profitPerCycle: number;
    profitPerDay: number;
    profitPerMonth: number;
    profitPerYear: number;
    roi: number;
  } | null>(null);

  const calculate = () => {
    const cap = parseFloat(capital) || 0;
    const lev = parseFloat(leverage) || 1;
    const spread = parseFloat(fundingSpread) || 0;

    const effectiveCapital = cap * lev;
    const profitPerCycle = effectiveCapital * (spread / 100);
    const cyclesPerDay = 3; // Funding is typically every 8 hours
    const profitPerDay = profitPerCycle * cyclesPerDay;
    const profitPerMonth = profitPerDay * 30;
    const profitPerYear = profitPerDay * 365;
    const roi = (profitPerYear / cap) * 100;

    setResult({
      profitPerCycle,
      profitPerDay,
      profitPerMonth,
      profitPerYear,
      roi,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Profit Calculator</h1>
        <p className="text-sm text-gray-400 mt-1">Estimate your potential returns from funding rate arbitrage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CalcIcon size={18} className="text-emerald-400" />
            Parameters
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <DollarSign size={14} /> Capital (USD)
              </label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Leverage
              </label>
              <input
                type="number"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                placeholder="1"
                min="1"
                max="125"
              />
              <p className="text-xs text-gray-600 mt-1">Higher leverage = higher risk. Recommended: 1-3x for arb</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Percent size={14} /> Funding Spread (%)
              </label>
              <input
                type="number"
                value={fundingSpread}
                onChange={(e) => setFundingSpread(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                placeholder="0.05"
                step="0.01"
              />
              <p className="text-xs text-gray-600 mt-1">The difference in funding rates between long and short exchange</p>
            </div>

            <button
              onClick={calculate}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-sm font-semibold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Calculate Profit
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Expected Returns</h2>

          {!result ? (
            <div className="h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <CalcIcon size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm">Enter your parameters and click Calculate</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Profit per Cycle (8h)', value: `$${result.profitPerCycle.toFixed(2)}`, color: 'text-emerald-400' },
                { label: 'Profit per Day', value: `$${result.profitPerDay.toFixed(2)}`, color: 'text-emerald-400' },
                { label: 'Profit per Month', value: `$${result.profitPerMonth.toFixed(2)}`, color: 'text-cyan-400' },
                { label: 'Profit per Year', value: `$${result.profitPerYear.toFixed(2)}`, color: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}

              {/* ROI Highlight */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Annualized ROI</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {result.roi.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Based on ${parseFloat(capital).toLocaleString()} capital at {leverage}x leverage with {fundingSpread}% spread
                </p>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-amber-400/80">
                  ⚠️ This is an estimation. Actual returns depend on market conditions, exchange fees, slippage, and funding rate changes. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
