import dotenv from 'dotenv';

import { ServicesConfig } from '../src/instances/services';

// Load environment variables from .env file
dotenv.config({ path: './scripts/.env.script' });

export const config: ServicesConfig = {
  isEmulator: process.env.FIRESTORE_EMULATOR_HOST !== undefined,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    domain: process.env.STRIPE_DOMAIN as string,
  },
  clerk: {
    publishableKey: '1234',
    secretKey: '1234',
  },
  search: {
    appId: process.env.ALGOLIA_APP_ID as string,
    apiKey: process.env.ALGOLIA_API_KEY as string,
    indexName: process.env.ALGOLIA_INDEX_NAME as string,
  },
  mock: {},
};
