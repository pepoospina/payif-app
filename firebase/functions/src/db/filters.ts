import { logger } from '../instances/logger';
import { Query } from './instance';

const DEBUG = false;
const DEBUG_PREFIX = 'filterBy';

export const filterByArrayContains = (
  _base: Query,
  key: string,
  value?: string
) => {
  let query = _base;

  if (!value) return query;

  if (value) {
    if (DEBUG)
      logger.debug(`getMany - filter by ${key} includes`, value, DEBUG_PREFIX);

    query = query.where(key, 'array-contains', value);
  }

  return query;
};

export const filterByEqual = (_base: Query, key: string, value?: string) => {
  let query = _base;

  if (!value) return query;

  if (value) {
    if (DEBUG)
      logger.debug(`getMany - filter by ${key} equals`, value, DEBUG_PREFIX);

    query = query.where(key, '==', value);
  }

  return query;
};
