import { logger } from '../../src/instances/logger';
import { Services } from '../../src/instances/services';
import { fetchPlatformAccountTask } from '../../src/platforms/platforms.tasks';
import { FETCH_ACCOUNT_TASKS } from '../../src/platforms/platforms.tasks.config';
import {
  AUTOFETCH_POSTS_TASK,
  autofetchUserPosts,
} from '../../src/posts/tasks/posts.autofetch.task';

export const enqueueTaskMockOnTests = async (
  name: string,
  params: any,
  services: Services
) => {
  logger.debug('enqueueTaskStub', { name, params });

  await (async () => {
    if (name === AUTOFETCH_POSTS_TASK) {
      const postsCreated = await autofetchUserPosts(
        { data: params } as any,
        services
      );

      if (postsCreated === undefined) {
        throw new Error('postsCreated is undefined');
      }

      return;
    }

    if (Object.values(FETCH_ACCOUNT_TASKS).includes(name)) {
      await fetchPlatformAccountTask(
        {
          data: params,
        } as any,
        services
      );

      return;
    }

    throw new Error(`enqueueTaskStub - unknown task name: ${name}`);
  })();
};
