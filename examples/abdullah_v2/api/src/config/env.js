import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const projectRoot = path.resolve(__dirname, '../../');

const envPath = path.join(projectRoot, '.env');
if (!fs.existsSync(envPath)) {
  throw new Error('Timeline API configuration error: missing .env file at project/api/.env');
}

config({ path: envPath });

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const env = {
  mode,
  port: Number(process.env.PORT || 4000),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'timeline_abdullah_v2',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  auth: {
    user: process.env.BASIC_AUTH_USER || null,
    pass: process.env.BASIC_AUTH_PASS || null,
  },
  cors: {
    origin: process.env.CORS_ALLOW_ORIGIN || '*',
  },
};
