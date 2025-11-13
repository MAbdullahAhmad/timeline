import express from 'express';
import { Buffer } from 'node:buffer';
import routes from './routes/index.js';
import { env } from './config/env.js';

const app = express();

const allowedOrigin = env.cors?.origin || '*';
app.use((req, res, next) => {
  const origin = allowedOrigin === '*' ? req.headers.origin || '*' : allowedOrigin;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, X-Requested-With, Origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const requiresAuth = Boolean(env.auth?.user && env.auth?.pass);
if (requiresAuth) {
  app.use((req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Basic ')) {
      res.set('WWW-Authenticate', 'Basic realm="Timeline API"');
      return res.status(401).json({ message: 'Authentication required' });
    }

    let decoded;
    try {
      decoded = Buffer.from(header.replace('Basic ', ''), 'base64').toString();
    } catch {
      res.set('WWW-Authenticate', 'Basic realm="Timeline API"');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const idx = decoded.indexOf(':');
    const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
    const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
    if (user !== env.auth.user || pass !== env.auth.pass) {
      res.set('WWW-Authenticate', 'Basic realm="Timeline API"');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
