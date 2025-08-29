import * as fs from 'fs';
import * as path from 'path';

import { AppThread } from '../../src/@shared/types/types.posts';
import { AccountProfile } from '../../src/@shared/types/types.profiles';
import { Services } from '../../src/instances/services';

export async function initializeDBWithSampleData(
  services: Services
): Promise<void> {
  // Read sample data files
  const sampleProfilesPath = path.join(__dirname, '../../sample.profiles.json');
  const samplePostsPath = path.join(__dirname, '../../sample.posts.json');
  // const sampleClustersPath = path.join(__dirname, '../../sample.clusters.json');

  const profiles: AccountProfile[] = JSON.parse(
    fs.readFileSync(sampleProfilesPath, 'utf-8')
  );
  const threads: AppThread[] = JSON.parse(
    fs.readFileSync(samplePostsPath, 'utf-8')
  );
  // const clusters: Cluster[] = JSON.parse(
  //   fs.readFileSync(sampleClustersPath, 'utf-8')
  // );

  // Initialize DB with sample data
  await services.db.run(async (manager) => {
    await Promise.all(
      profiles.map((profile) =>
        services.profiles.createProfile(profile, manager, profile.clusters)
      )
    );
  });

  await services.db.run(async (manager) => {
    await Promise.all(
      threads.map(async (thread) => {
        const threadCreated = services.postsManager.processing.threads.create(
          thread,
          manager,
          thread.id
        );
        /** trigger sync to clusters */
        await services.postsManager.processing.updateThread(
          threadCreated.id,
          { meta: thread.meta },
          manager
        );
      })
    );
  });
}
