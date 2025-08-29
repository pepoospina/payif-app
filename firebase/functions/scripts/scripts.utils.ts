import * as admin from 'firebase-admin';
import { AppOptions } from 'firebase-admin';
import readline from 'readline';

import { logger } from '../src/instances/logger';

export const initApp = (
  config: AppOptions,
  name: string,
  host: string = 'localhost:8080'
) => {
  const app = admin.initializeApp(config, name);

  if (config.projectId?.startsWith('demo-')) {
    logger.info(`Connecting to emulator - ${config.projectId}`);
    app.firestore().settings({
      host,
      ssl: false,
    });
  }

  return app;
};

export const askForConfirmation = (message: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'yes');
    });
  });
};
