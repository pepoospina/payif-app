import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';

import { deployConfig, region } from './firestore.config';
import { buildApp } from './instances/app';
import { router } from './router';
import { getConfig } from './services.config';

setGlobalOptions({
  region: region, // Replaces .region(region)
});

/** Registed the API as an HTTP triggered function */
exports['api'] = onRequest(
  {
    ...deployConfig,
    labels: { billing_name: 'api' },
  },
  buildApp(() => getConfig().clerk, router)
);
