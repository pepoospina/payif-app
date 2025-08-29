import { expect } from 'chai';
import { getFirestore } from 'firebase-admin/firestore';

import { CartProduct, Language } from '../../src/@shared/types/types.products';
import { AppUser } from '../../src/@shared/types/types.user';
import { logger } from '../../src/instances/logger';
import { resetDB } from '../utils/db';
import { createUsers } from '../utils/users.utils';
import { testUsers } from './setup';
import { createTestServices, getTestConfig } from './test.services';

describe.only('002 create checkout session', () => {
  let user: AppUser;

  const services = createTestServices(getFirestore(), getTestConfig());

  before(async () => {
    logger.debug('seeding DB');

    await resetDB();
    await services.products.seed(process.env.FILE_ID as string);

    const users = await services.db.run(async (manager) => {
      return createUsers(services, testUsers, manager);
    });

    user = users[0];
  });

  it('creates checkout session', async () => {
    const products = await services.products.getProducts({
      amount: 3,
    });

    const cartProducts: CartProduct[] = products.map((product) => ({
      productId: product.id,
      quantity: 1,
    }));

    const cartProductsFull = await services.db.run(async (manager) => {
      return services.products.convertCartProductsToFull(cartProducts, manager);
    });

    const session = await services.payments.createCheckoutSession(
      user.email,
      cartProductsFull,
      Language.SPA
    );

    expect(session).to.be.an('object');
    expect(session.url).to.be.a('string');

    console.log(session.url);
  });
});
