import { useState, useEffect, useRef, useCallback } from 'react';

export type FundingRateData = {
  exchange: string;
  symbol: string;
  coin: string;
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsManualUpdate(true);
      wsRef.current.send(JSON.stringify({ type: 'REQUEST_UPDATE' }));
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        console.log('WebSocket connected');
        ws.send(JSON.stringify({ type: 'REQUEST_UPDATE' }));
        
        // Start heartbeat
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000); // Ping every 20 seconds
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'MARKET_DATA_UPDATE') {
            if (autoRefresh || isManualUpdate) {
              setMarketData(message.data);
              setLastUpdated(new Date());
              setIsManualUpdate(false);
            }
          } else if (message.type === 'PONG') {
            // Heartbeat received
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket disconnected, attempting reconnect...');
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        
        // Exponential backoff for reconnection
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('Connection error occurred');
        ws.close();
      };
    } catch (e) {
      console.error('WebSocket connection failed:', e);
      setError('Failed to connect to server');
    }
  }, [autoRefresh, isManualUpdate]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { 
    marketData, 
    connected, 
    error, 
    autoRefresh, 
    setAutoRefresh, 
    requestUpdate,
    lastUpdated
  };
}
