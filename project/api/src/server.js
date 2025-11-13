import app from './app.js';
import { env } from './config/env.js';
import { closePool } from './config/database.js';

const port = env.port;

const server = app.listen(port, () => {
  console.log(`Timeline API running in ${env.mode} mode on port ${port}`);
});

const shutdown = async () => {
  console.log('Shutting down server...');
  server.close();
  await closePool().catch(() => {});
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
