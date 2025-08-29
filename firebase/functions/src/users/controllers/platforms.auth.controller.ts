import { RequestHandler } from 'express';

import {
  IDENTITY_PLATFORM,
  PLATFORM,
} from '../../@shared/types/types.platforms';
import { getAuthenticatedUser, getServices } from '../../controllers.utils';
import { logger } from '../../instances/logger';
import {
  oauthGetSignupContextSchema,
  twitterSignupDataSchema,
} from './auth.schema';

const DEBUG = false;
const DEBUG_PREFIX = '[AUTH-CONTROLLER]';

export const getSignupContextController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);
    const userId = getAuthenticatedUser(request, true);

    const platform = request.params.platform as PLATFORM;

    const payload = await oauthGetSignupContextSchema.validate(request.body);

    if (DEBUG) {
      logger.debug('getSignupContext', payload, DEBUG_PREFIX);
    }

    const context = await services.platforms.getSignupContext(platform, {
      callback_url: payload.callback_url,
      type: payload.type,
      stateValue: { ...payload.stateValue, userId },
    });

    response.status(200).send({ success: true, data: context });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const handleAccountConnectController: RequestHandler = async (
  request,
  response
) => {
  try {
    const platform = request.params.platform as IDENTITY_PLATFORM;

    const services = getServices(request);

    const payload = await (async () => {
      if (platform === PLATFORM.Twitter) {
        return twitterSignupDataSchema.validate(request.body);
      }
      if (platform === PLATFORM.Bluesky) {
        return twitterSignupDataSchema.validate(request.body);
      }

      throw new Error(`Unexpected platform ${platform}`);
    })();

    const result = await services.db.run(async (manager) => {
      const { profileId, state } = await services.platforms.handleSignupData(
        platform,
        payload as any,
        manager
      );

      await services.clusters.setAutopostProfile(
        state.clusterId,
        platform,
        profileId,
        manager
      );

      return {
        profileId,
        state,
      };
    });

    response.status(200).send({ success: true, data: result });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
