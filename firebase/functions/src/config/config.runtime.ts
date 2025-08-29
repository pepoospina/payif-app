import { envRuntime } from './typedenv.runtime';

/** Verify that all needed env variables were provided */
const mandatory: Array<keyof typeof envRuntime> = [
  'CLERK_PUBLISHABLE_KEY',
  'PROJECT_ID',
  'STRIPE_SECRET_KEY',
];

mandatory.forEach((varName) => {
  if (!envRuntime[varName]) {
    throw new Error(`${varName} undefined`);
  }
});

/** Export all independent constants used by the functions */
export const NODE_ENV = envRuntime.NODE_ENV;
export const PROJECT_ID = envRuntime.PROJECT_ID;
export const IS_EMULATOR = process.env.FIRESTORE_EMULATOR_HOST !== undefined;

export const APP_URL = envRuntime.APP_URL;
export const CLERK_PUBLISHABLE_KEY = envRuntime.CLERK_PUBLISHABLE_KEY;
export const CLERK_SECRET_KEY = envRuntime.CLERK_SECRET_KEY;

// Stripe configuration
export const STRIPE_SECRET_KEY = envRuntime.STRIPE_SECRET_KEY;
export const STRIPE_DOMAIN = APP_URL;

// Algolia configuration
export const ALGOLIA_APP_ID = envRuntime.ALGOLIA_APP_ID;
export const ALGOLIA_API_KEY = envRuntime.ALGOLIA_API_KEY;
export const ALGOLIA_INDEX_NAME = envRuntime.ALGOLIA_INDEX_NAME;
