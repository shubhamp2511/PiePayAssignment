// backend/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for local dev/frontend requests

// In-memory database to store product prices keyed by productTitle
const priceStore: {
  [productTitle: string]: {
    wowDealPrice: number | null;
    flipkartPrice: number;
    productImgUri: string;
  };
} = {};

// Static image URI sample (your choice)
const SAMPLE_IMAGE_URI = 'https://example.com/sample-product-image.png';

// POST /api/prices
// Expects JSON body: { productTitle: string, wowDealPrice: string | null }
app.post('/api/prices', (req: Request, res: Response) => {
  try {
    const { productTitle, wowDealPrice } = req.body;
    if (!productTitle) {
      return res.status(400).json({ error: 'Missing productTitle' });
    }
    // Convert wowDealPrice string with possible currency symbols to number or null
    let wowPriceNum: number | null = null;
    if (wowDealPrice && typeof wowDealPrice === 'string') {
      const digits = wowDealPrice.replace(/[^0-9.]/g, '');
      wowPriceNum = digits ? parseFloat(digits) : null;
    }

    // Using static Flipkart price (could be randomized or fixed as per assignment)
    const flipkartPrice = 5000;

    priceStore[productTitle] = {
      wowDealPrice: wowPriceNum,
      flipkartPrice,
      productImgUri: SAMPLE_IMAGE_URI,
    };

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/prices/:productTitle
app.get('/api/prices/:productTitle', (req: Request, res: Response) => {
  try {
    const { productTitle } = req.params;
    const data = priceStore[productTitle];
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If wowDealPrice is null, use flipkartPrice for display
    const wowDealPrice = data.wowDealPrice ?? data.flipkartPrice;

    // Calculate savingsPercentage
    const savingsPercentage = data.wowDealPrice
      ? Math.round(((data.flipkartPrice - data.wowDealPrice) / data.flipkartPrice) * 100)
      : 0;

    res.json({
      flipkartPrice: data.flipkartPrice,
      wowDealPrice,
      productImgUri: data.productImgUri,
      savingsPercentage,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
});
