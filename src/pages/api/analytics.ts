import type { NextApiRequest, NextApiResponse } from 'next';

// Key to access the /collect/secure endpoint, used in a header named 'Authorization' with the value 'supersecretkey'
const ANALYTICS_API_KEY = 'supersecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Logic to forward the analytics event goes here
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({
      error: 'Failed to forward analytics event',
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
