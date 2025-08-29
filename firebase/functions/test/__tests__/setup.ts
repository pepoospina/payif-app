import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Context } from 'mocha';

import { AppUserCreate } from '../../src/@shared/types/types.user';
import { envRuntime } from '../../src/config/typedenv.runtime';
import { resetUsers } from '../utils/db';
import { createTestServices, getTestConfig } from './test.services';

export const LOG_LEVEL_MSG = envRuntime.LOG_LEVEL_MSG.value();
export const LOG_LEVEL_OBJ = envRuntime.LOG_LEVEL_OBJ.value();

export let testUsers: TestUserData[] = [];

export interface TestUserData {
  user: AppUserCreate;
}

export type InjectableContext = Readonly<{
  // properties injected using the Root Mocha Hooks
}>;

export const TEST_THREADS: string[][] = process.env.TEST_THREADS
  ? JSON.parse(process.env.TEST_THREADS as string)
  : [];

// TestContext will be used by all the test
export type TestContext = Mocha.Context & Context;

export const app = getApps().length
  ? getApp() // Return the existing app if already initialized
  : initializeApp({
      projectId: 'demo-project',
    });

export let globalTestServices = createTestServices(
  getFirestore(),
  getTestConfig()
);

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    async beforeAll(this: Mocha.Context) {
      const context: InjectableContext = {};

      /** reset db */
      await resetUsers();

      /** load test users */
      testUsers = [
        {
          user: {
            clerkId: 'clerkId1',
            email: 'user1@example.com',
            settings: {},
            signupDate: Date.now(),
            profilesIds: [],
            clerkUser: {
              id: 'clerkId1',
              imageUrl: '',
              fullName: null,
              emailAddresses: [],
            },
          },
        },
      ];

      Object.assign(this, context);
    },
  };
};
