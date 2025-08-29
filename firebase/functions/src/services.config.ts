import {
  ALGOLIA_API_KEY,
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX_NAME,
  CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
  IS_EMULATOR,
  STRIPE_DOMAIN,
  STRIPE_SECRET_KEY,
} from './config/config.runtime';
import { logger } from './instances/logger';
import { ServicesConfig } from './instances/services';

const DEBUG = false;

export const getConfig = (): ServicesConfig => {
  if (DEBUG) {
    logger.debug('getConfig', {});
  }

  return {
    isEmulator: IS_EMULATOR,
    clerk: {
      publishableKey: CLERK_PUBLISHABLE_KEY.value(),
      secretKey: CLERK_SECRET_KEY ? CLERK_SECRET_KEY.value() : '',
    },
    stripe: {
      secretKey: STRIPE_SECRET_KEY ? STRIPE_SECRET_KEY.value() : '',
      domain: STRIPE_DOMAIN.value(),
    },
    search: {
      appId: ALGOLIA_APP_ID.value(),
      apiKey: ALGOLIA_API_KEY.value(),
      indexName: ALGOLIA_INDEX_NAME.value(),
    },
    mock: {},
  };
};
