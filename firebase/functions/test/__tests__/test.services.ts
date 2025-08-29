import { createClerkClient } from '@clerk/express';
import { Firestore } from 'firebase-admin/firestore';

import { DBInstance } from '../../src/db/instance';
import { DriveService } from '../../src/drive/drive.service';
import { logger } from '../../src/instances/logger';
import { Repositories, ServicesConfig } from '../../src/instances/services';
import { OrdersRepository } from '../../src/payments/orders.repository';
import { PaymentsService } from '../../src/payments/payments.service';
import { CategoriesRepository } from '../../src/products/categories.repository';
import { ProductsRepository } from '../../src/products/products.repository';
import { ProductsService } from '../../src/products/products.service';
import { SearchService } from '../../src/search/search.service';
import { TimeService } from '../../src/time/time.service';
import { UsersRepository } from '../../src/users/users.repository';
import { UsersService } from '../../src/users/users.service';

const DEBUG = false;

export interface ClerkConfig {
  publishableKey: string;
  secretKey: string;
}

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  domain: string;
}

export interface TestServices {
  users: UsersService;
  time: TimeService;
  db: DBInstance;
  payments: PaymentsService;
  products: ProductsService;
  drive: DriveService;
}

export const getTestConfig = (): ServicesConfig => {
  return {
    clerk: {
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY as string,
      secretKey: process.env.CLERK_SECRET_KEY as string,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || 'dummy',
      domain: process.env.STRIPE_DOMAIN || 'dummy',
    },
    search: {
      appId: process.env.ALGOLIA_APP_ID as string,
      apiKey: process.env.ALGOLIA_API_KEY as string,
      indexName: process.env.ALGOLIA_INDEX_NAME as string,
    },
    isEmulator: true,
    mock: {},
  };
};

export const createTestServices = (
  firestore: Firestore,
  config: ServicesConfig
) => {
  if (DEBUG) logger.info('Creating services');

  const db = new DBInstance(firestore);
  const time = new TimeService();
  const userRepo = new UsersRepository(db);
  const orderRepo = new OrdersRepository(db);
  const search = new SearchService(config.search);

  const repos: Repositories = {
    users: userRepo,
    products: new ProductsRepository(db),
    categories: new CategoriesRepository(db),
  };

  const drive = new DriveService({
    keyFile: process.env.DRIVE_KEY_FILE as string,
    scopes: JSON.parse(process.env.DRIVE_SCOPES as string) as string[],
  });

  const productsService = new ProductsService(db, repos, search, drive);

  const clerk = createClerkClient({
    publishableKey: config.clerk.publishableKey,
    secretKey: config.clerk.secretKey,
  });

  const payments = new PaymentsService(db, config.stripe);
  const usersService = new UsersService(
    db,
    userRepo,
    clerk,
    payments,
    productsService,
    orderRepo,
    time
  );

  const services: TestServices = {
    users: usersService,
    time,
    db,
    payments,
    products: productsService,
    drive,
  };

  if (DEBUG) {
    logger.debug('services', {});
  }
  return services;
};
