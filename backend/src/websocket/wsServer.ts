import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { initExchanges, fetchAllFundingRatesInternal, fetchTickersForExchanges } from '../services/exchangeService';
import { calculateFundingMatrix, findFundingArbitrageOpportunities, findCrossExchangeOpportunities, findSpotFuturesOpportunities } from '../services/arbitrageEngine';

export async function setupWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  // Initialize CCXT exchanges
  await initExchanges();

  const broadcastData = async (targetWs?: WebSocket) => {
    try {
      console.log('Fetching all market data...');
      const fundingRates = await fetchAllFundingRatesInternal();
      const tickers = await fetchTickersForExchanges();
      
      const fundingMatrix = calculateFundingMatrix(fundingRates);
      const fundingOpportunities = findFundingArbitrageOpportunities(fundingRates);
      const crossExchangeOpportunities = findCrossExchangeOpportunities(tickers);
      const spotFuturesOpportunities = findSpotFuturesOpportunities(tickers, fundingRates);

      const payload = JSON.stringify({
        type: 'MARKET_DATA_UPDATE',
        data: {
          fundingRates: fundingRates,
          fundingMatrix: fundingMatrix,
          tickers: tickers,
          fundingOpportunities: fundingOpportunities,
          crossExchangeOpportunities: crossExchangeOpportunities,
          spotFuturesOpportunities: spotFuturesOpportunities
        }
      });

      if (targetWs) {
        if (targetWs.readyState === WebSocket.OPEN) {
          targetWs.send(payload);
        }
      } else {
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching/broadcasting market data:', error);
    }
  };

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established.');
    
    // Set up ping-pong to detect dead connections
    (ws as any).isAlive = true;
    ws.on('pong', () => { (ws as any).isAlive = true; });

    // Send an initial message
    ws.send(JSON.stringify({ type: 'CONNECTION_SUCCESS', message: 'Connected to CryptoArb AI WebSocket server' }));

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'REQUEST_UPDATE') {
          console.log('Manual update requested by client');
          await broadcastData(ws);
        } else if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
        }
      } catch (e) {
        console.error('Failed to handle incoming message:', e);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
  });

  // Keep-alive heartbeat every 30 seconds
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if ((ws as any).isAlive === false) return ws.terminate();
      (ws as any).isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  // Broadcast market data every 5 seconds
  setInterval(async () => {
    if (wss.clients.size === 0) return; // Skip if no clients are connected
    await broadcastData();
  }, 5000); // 5 seconds interval

  return wss;
}
