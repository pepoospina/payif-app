import { getAuth } from '@clerk/express';
import { Request } from 'express';

import { DefinedIfTrue } from './@shared/types/types.user';
import { logger } from './instances/logger';
import { Services } from './instances/services';

const DEBUG = false;

export const getAuthenticatedClerkUser = <T extends boolean>(
  request: Request,
  fail?: T
): DefinedIfTrue<T, string> => {
  const { userId } = getAuth(request);

  if (DEBUG) logger.info('getAuthenticatedClerkUser', { userId });

  if (fail && !userId) {
    throw new Error(`userId not found on request`);
  }
  return (
    userId !== undefined && userId !== null ? userId : undefined
  ) as DefinedIfTrue<T, string>;
};

export const getAuthenticatedUser = <T extends boolean>(
  request: Request,
  shouldThrow?: T
): DefinedIfTrue<T, string> => {
  const clerkId = getAuthenticatedClerkUser(request, shouldThrow);

  if (!clerkId && shouldThrow) {
    throw new Error('clerkId not present on request');
  }

  return clerkId;
};

export const getServices = (request: Request) => {
  const services = (request as any).services as Services;
  if (!services) {
    throw new Error(`Services not found`);
  }
  return services;
};
