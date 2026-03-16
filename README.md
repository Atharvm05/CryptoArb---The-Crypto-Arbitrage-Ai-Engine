# CryptoArb AI — Real-time Crypto Arbitrage Intelligence

[![Deploy to Vercel (Frontend)](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAtharvm05%2FCryptoArb-AI-Real-Time-Crypto-Arbitrage-Engine&root-directory=frontend)
[![Deploy to Render (Backend)](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Atharvm05/CryptoArb-AI-Real-Time-Crypto-Arbitrage-Engine)

CryptoArb AI is a professional-grade, high-performance cryptocurrency arbitrage platform designed to identify and track profitable opportunities across 15+ global exchanges in real-time. 

## 🚀 Features

- **Funding Rate Screener**: Real-time matrix of funding rates across major exchanges (Binance, Bybit, OKX, etc.) for all available USDT perpetual pairs.
- **Spot vs Futures Arbitrage**: Automatically detects premium and discount spreads between spot and perpetual futures markets on the same exchange.
- **Cross-Exchange Arbitrage**: Identifies price disparities for the same asset across different exchanges (Buy Low / Sell High).
- **Advanced Analytics**: Search-driven analytics for individual coins, including average funding trends, volatility metrics, and exchange-specific breakdowns.
- **High-Performance Engine**: Optimized backend using CCXT with parallel fetching, background updates, and aggressive caching to handle thousands of pairs with 5s update cycles.
- **Sleek UI/UX**: Modern dark-themed dashboard with row virtualization, real-time WebSocket updates, and responsive design.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for ultra-fast builds
- **Tailwind CSS** for professional styling
- **Lucide React** for iconography
- **React Router 7** for navigation

### Backend
- **Node.js** with **TypeScript**
- **Express** for API routing
- **WebSocket (ws)** for real-time data broadcasting
- **CCXT** for unified exchange connectivity
- **ts-node-dev** for development

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Atharvm05/CryptoArb-AI-Real-Time-Crypto-Arbitrage-Engine.git
cd CryptoArb-AI-Real-Time-Crypto-Arbitrage-Engine
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:3000` and begin scanning 15+ exchanges.

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 📈 Performance Optimizations

- **Parallel Fetching**: Simultaneously fetches Spot and Swap tickers to maximize throughput.
- **Background Updates**: Uses a non-blocking cache strategy where UI updates are served instantly while fresh data is fetched in the background.
- **Virtualization**: Frontend tables are optimized to handle high-density data without browser lag.
- **Rate Limit Management**: Intelligent per-exchange queuing to prevent API bans while maintaining fast updates.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

---
Built for speed. Engineered for profit. **CryptoArb AI.**
