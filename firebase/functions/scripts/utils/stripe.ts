import Stripe from 'stripe';

const DEBUG = false;

export const deleteProduct = async (stripe: Stripe, productId: string) => {
  // Mark each product as inactive
  await stripe.products.update(productId, { active: false });
  if (DEBUG) console.log(`Marked product ${productId} as inactive`);
};

export const getOrCreateProduct = async (stripe: Stripe, name: string) => {
  // Check if product already exists
  const existingProducts = await stripe.products.search({
    limit: 100,
    query: `name:"${name}"`,
  });

  const existingProduct = existingProducts.data.find((p) => p.name === name);

  if (existingProduct) {
    if (DEBUG) console.log(`Product ${name} already exists.`);
    if (!existingProduct.active) {
      await stripe.products.update(existingProduct.id, { active: true });
      if (DEBUG) console.log(`Activated product ${name}`);
    }
    return existingProduct;
  } else {
    const createdProduct = await stripe.products.create({
      name,
      description: name,
    });
    return createdProduct;
  }
};

export const addOrUpdateProductPrice = async (
  stripe: Stripe,
  productId: string,
  price: { lookup_key: string; value: number; currency: string }
) => {
  /** make sure the lookup key is freed */
  const existingPrice = await stripe.prices.list({
    limit: 100,
    lookup_keys: [price.lookup_key],
  });

  if (existingPrice.data.length > 0) {
    await stripe.prices.update(existingPrice.data[0].id, {
      active: false,
      lookup_key: Date.now().toString(),
    });
  }

  const createdPrice = await stripe.prices.create({
    unit_amount: price.value,
    currency: price.currency,
    product: productId,
    lookup_key: price.lookup_key,
    recurring: {
      interval: 'month',
      interval_count: 1,
      trial_period_days: 0,
    },
  });
  if (DEBUG)
    console.log(
      `Created price for product ${price.lookup_key} with price ID: ${createdPrice.id}`
    );
};
