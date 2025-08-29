import { services } from './scripts.services';

// Read posts from a source and create them in the target (uses new ids and creates the platform posts and profiles)
(async () => {
  const products = await services.products.getProducts({
    amount: 5,
  });

  console.log(products);
})();
