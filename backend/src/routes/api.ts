import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint for historical funding rates (mock structure for now)
router.get('/funding-history', (req: Request, res: Response) => {
  const { symbol, limit } = req.query;
  // TODO: Fetch from database or exchange service
  res.json({
    symbol: symbol || 'BTC/USDT',
    data: [] // mock empty data for initial structure
  });
});

// Endpoint for opportunities ranking
router.get('/opportunities', (req: Request, res: Response) => {
  // TODO: Fetch from arbitrage engine
  res.json({
    opportunities: []
  });
});

export default router;
