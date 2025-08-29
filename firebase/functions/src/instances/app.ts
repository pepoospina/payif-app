import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';

import { attachServices } from '../middleware/attach.services';
import { errorHandling } from '../middleware/errorHandlingMiddleware';
import { logger } from './logger';
import { ClerkConfig } from './services';

const DEBUG = false;

export const buildApp = (
  clerk: () => ClerkConfig,
  router?: express.Router
): express.Application => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: true,
    })
  );

  app.use(attachServices);
  app.use((req, res, next) => {
    const clerkConfig = clerk();

    if (DEBUG)
      logger.info('clerkMiddleware before', {
        headers: req.headers,
        clerkConfig,
      });

    clerkMiddleware({ ...clerkConfig, debug: true })(req, res, (err: any) => {
      if (err) {
        logger.error('Clerk middleware error:', err);
        return res.status(401).send('Authentication error');
      }
      if (DEBUG) {
        logger.info('clerkMiddleware after', {
          debug: (req as any).auth.debug(),
        });
      }
      next();
      return;
    });

    if (DEBUG)
      logger.info('clerkMiddleware after', {
        user: (req as any).user,
        auth: (req as any).auth,
      });
  });

  if (router) {
    app.use(router);
  }

  app.use(errorHandling);

  return app;
};
