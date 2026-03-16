import { useState, useEffect, useRef, useCallback } from 'react';

export type FundingRateData = {
  exchange: string;
  symbol: string;
  fundingRate: number;
  timestamp: number;
  markPrice?: number;
}

export type TickerData = {
  exchange: string;
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  timestamp: number;
}

export type ArbitrageOpportunity = {
  asset: string;
  longExchange: string;
  shortExchange: string;
  longFundingRate: number;
  shortFundingRate: number;
  spread: number;
  expectedProfitPer10k: number;
  timestamp: number;
}

export type CrossExchangeOpportunity = {
  asset: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPct: number;
  timestamp: number;
}

export type SpotFuturesOpportunity = {
  asset: string;
  exchange: string;
  spotPrice: number;
  futuresPrice: number;
  spread: number;
  spreadPct: number;
  direction: 'PREMIUM' | 'DISCOUNT';
  timestamp: number;
}

export type FundingMatrixRow = {
  coin: string;
  rates: Record<string, number>;
  bestSpread: number;
  longExchange: string;
  shortExchange: string;
  opportunity: string;
  liquidityScore: number;
  rankScore: number;
}

export type MarketData = {
  fundingRates: FundingRateData[];
  fundingMatrix: FundingMatrixRow[];
  tickers: TickerData[];
  fundingOpportunities: ArbitrageOpportunity[];
  crossExchangeOpportunities: CrossExchangeOpportunity[];
  spotFuturesOpportunities: SpotFuturesOpportunity[];
}

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketData>({
    fundingRates: [],
    fundingMatrix: [],
    tickers: [],
    fundingOpportunities: [],
    crossExchangeOpportunities: [],
    spotFuturesOpportunities: [],
  });
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const requestUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsManualUpdate(true);
      wsRef.current.send(JSON.stringify({ type: 'REQUEST_UPDATE' }));
    }
  }, []);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket('ws://localhost:5001');
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          setError(null);
          console.log('WebSocket connected');
          ws.send(JSON.stringify({ type: 'REQUEST_UPDATE' }));
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'MARKET_DATA_UPDATE') {
              setMarketData(message.data);
              setIsManualUpdate(false); // Reset manual update flag after data arrives
            }
          } catch (e) {
            console.error('Failed to parse WS message:', e);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          reconnectTimeoutRef.current = window.setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setError('Connection error');
          ws.close();
        };
      } catch (e) {
        setError('Failed to connect');
      }
    };

    connect();
    return () => {
      wsRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Use a second state to "freeze" the data when autoRefresh is OFF
  const [frozenData, setFrozenData] = useState<MarketData>(marketData);

  useEffect(() => {
    // Update frozenData ONLY if autoRefresh is ON OR if we just triggered a manual update
    if (autoRefresh || isManualUpdate) {
      setFrozenData(marketData);
    }
  }, [marketData, autoRefresh, isManualUpdate]);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  useEffect(() => {
    if (marketData.fundingRates.length > 0) {
      setLastUpdated(new Date());
    }
  }, [marketData]);

  return { 
    marketData: frozenData, 
    connected, 
    error, 
    autoRefresh, 
    setAutoRefresh, 
    requestUpdate,
    lastUpdated
  };
}
