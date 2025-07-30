import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Events } from '../events.types';
import { Event } from '../events.types';

const app = express();
const PORT = 4000;

app.use(express.json());

const endpoints: string[] = [
  '/collect/gtm',
  '/collect/meta',
  '/collect/ometria',
  '/collect/secure'
];

// Zod schemas for each event type
const BaseEventPayloadSchema = z.object({
  page_url: z.string(),
});

export const PageViewPayloadSchema = BaseEventPayloadSchema.extend({
  event_type: z.literal('page_view'),
});export const AddToCartPayloadSchema = BaseEventPayloadSchema.extend({
  event_type: z.literal('add_to_cart'),
  product_id: z.string(),
  quantity: z.number().int().positive(),
});

export const CheckoutSuccessPayloadSchema = BaseEventPayloadSchema.extend({
  event_type: z.literal('checkout_success'),
  order_id: z.string(),
  total: z.number().nonnegative(),
  email: z.email(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    postcode: z.string(),
    country: z.string()
  })
});

export const AnalyticsEventPayloadSchema = z.union([
  PageViewPayloadSchema,
  AddToCartPayloadSchema,
  CheckoutSuccessPayloadSchema,
]);

const eventsFilePath = path.resolve('./mock-server/events/events.json');

const eventsDir = path.dirname(eventsFilePath);
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}
let events: Events = {};
if (fs.existsSync(eventsFilePath)) {
  try {
    events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
  } catch {
    events = {};
  }
} else {
  fs.writeFileSync(eventsFilePath, JSON.stringify({}, null, 2));
}

endpoints.forEach(endpoint => {
  app.post(endpoint, (req: Request, res: Response) => {
    if (endpoint === '/collect/secure') {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (authHeader !== 'supersecretkey') {
        res.status(401).json({ error: 'Unauthorized: missing or invalid Authorization header' });
        return;
      }
    }
    console.log(`Received POST ${endpoint}:`, req.body);
    // Validate payload shape
    const result = AnalyticsEventPayloadSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid payload', details: result.error.issues });
      return;
    }
    // Store event in events object
    if (!events[endpoint]) events[endpoint] = [];
    events[endpoint].push({ timestamp: Date.now(), payload: result.data });
    // Write to file
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
    res.status(200).json({ status: 'ok' });
  });
});

app.listen(PORT, () => {
  console.log(`Mock analytics server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  endpoints.forEach(e => console.log(`  POST ${e}`));
});

// Serve HTML report of event counts per endpoint
app.get('/report', (req: Request, res: Response) => {
  const eventsDir = path.dirname(eventsFilePath);
  if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
  }
  let fileEvents: Events = {};
  if (fs.existsSync(eventsFilePath)) {
    try {
      fileEvents = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
    } catch {
      fileEvents = {};
    }
  } else {
    fs.writeFileSync(eventsFilePath, JSON.stringify({}, null, 2));
  }

  // Collect all event types
  const eventTypes = ['page_view', 'add_to_cart', 'checkout_success'];

  let html = `<!DOCTYPE html><html><head><title>Analytics Event Report</title><style>body{font-family:sans-serif;}table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#eee;}</style></head><body>`;
  html += `<h1>Analytics Event Report</h1>`;
  endpoints.forEach(endpoint => {
    html += `<h2>Endpoint: ${endpoint}</h2>`;
    html += `<table><thead><tr><th>Event Type</th><th>Count</th></tr></thead><tbody>`;
    eventTypes.forEach(type => {
      let count = 0;
      if (Array.isArray(fileEvents[endpoint])) {
        fileEvents[endpoint].forEach((e: Event) => {
          if (e.payload && e.payload.event_type === type) {
            count++;
          }
        });
      }
      html += `<tr><td>${type}</td><td>${count}</td></tr>`;
    });
    html += `</tbody></table>`;
  });
  html += `</body></html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});
