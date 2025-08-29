import { Request } from 'express';

import { DefinedIfTrue } from './@shared/types/types.user';
import { Services } from './instances/services';

export const getAuthenticatedClerkUser = <T extends boolean>(
  request: Request,
  fail?: T
): DefinedIfTrue<T, string> => {
  const clerkUserId = (request as any).auth.userId;
  if (fail && !clerkUserId) {
    throw new Error(`userId not found on request`);
  }
  return clerkUserId;
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
