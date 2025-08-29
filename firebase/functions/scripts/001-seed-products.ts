import { services } from './scripts.services';

// Read posts from a source and create them in the target (uses new ids and creates the platform posts and profiles)
(async () => {
  await services.products.seed(process.env.FILE_ID as string);
})();
