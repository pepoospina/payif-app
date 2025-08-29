import * as admin from 'firebase-admin';
import { HttpsOptions } from 'firebase-functions/https';
import { SecretParam } from 'firebase-functions/lib/params/types';

import { IS_EMULATOR } from './config/config.runtime';
import { envDeploy } from './config/typedenv.deploy';
import { envRuntime } from './config/typedenv.runtime';

export const region = envDeploy.REGION;

export const appConfig = IS_EMULATOR
  ? {
      projectId: 'demo-project',
    }
  : {};

const app = admin.initializeApp(appConfig);
export const firestore = app.firestore();

export const secrets: SecretParam[] = [
  envRuntime.CLERK_SECRET_KEY,
  envRuntime.STRIPE_SECRET_KEY,
  envRuntime.ALGOLIA_API_KEY,
].filter((secret) => secret !== undefined) as SecretParam[];

export const deployConfig: HttpsOptions = {
  timeoutSeconds: envDeploy.CONFIG_TIMEOUT,
  memory: envDeploy.CONFIG_MEMORY,
  minInstances: envDeploy.CONFIG_MININSTANCE,
  secrets,
};
