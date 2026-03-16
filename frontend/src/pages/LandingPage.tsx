import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { BarChart3, Zap, ArrowLeftRight, TrendingUp, Shield, Clock } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden relative">
      {/* Animated background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Logo size={44} />
        <Link
          to="/dashboard"
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-emerald-300 font-medium">Live across 13+ exchanges</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Crypto Arbitrage
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Intelligence
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Scan funding rates, detect spreads, and find profitable arbitrage opportunities across
          Binance, Bybit, OKX, and 14 more exchanges — in real-time.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-base font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
          >
            Open Dashboard
          </Link>
          <Link
            to="/calculator"
            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-base font-semibold hover:bg-white/10 transition-all"
          >
            Try Calculator
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Funding Rate Screener',
              desc: 'Real-time funding rate table across all major exchanges with color-coded positive/negative rates.',
              color: 'from-emerald-400 to-emerald-600',
            },
            {
              icon: ArrowLeftRight,
              title: 'Spot vs Futures',
              desc: 'Compare spot and perpetual futures prices to find premium/discount arbitrage plays.',
              color: 'from-cyan-400 to-blue-600',
            },
            {
              icon: TrendingUp,
              title: 'Cross-Exchange Arb',
              desc: 'Detect price differences across exchanges and find buy-low, sell-high opportunities.',
              color: 'from-purple-400 to-purple-600',
            },
            {
              icon: Shield,
              title: 'Risk Scoring',
              desc: 'Each opportunity is ranked by spread, liquidity, and overall risk score.',
              color: 'from-amber-400 to-orange-600',
            },
            {
              icon: Clock,
              title: 'Real-Time Updates',
              desc: 'WebSocket-powered live data streams ensure you never miss an opportunity.',
              color: 'from-rose-400 to-pink-600',
            },
            {
              icon: BarChart3,
              title: 'Analytics Dashboard',
              desc: 'Funding rate history charts, open interest analysis, and volatility metrics.',
              color: 'from-teal-400 to-teal-600',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exchange Logos Strip */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-8">
          Supported Exchanges
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
          {['Binance', 'Bybit', 'OKX', 'Bitget', 'KuCoin', 'Gate.io', 'MEXC', 'HTX', 'Phemex', 'Deribit', 'CoinEx', 'BingX', 'AscendEX'].map(
            (name) => (
              <div
                key={name}
                className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium hover:text-emerald-400 hover:border-emerald-500/20 transition-colors"
              >
                {name}
              </div>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <p className="text-center text-xs text-gray-600">
          © 2026 CryptoArb AI — Real-time Crypto Arbitrage Intelligence
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
